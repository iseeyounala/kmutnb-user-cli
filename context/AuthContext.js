import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../constant/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async token => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('userToken', token);
      await setUserToken(token);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };
  const getItem_token = async () => {
    try {
      let token = await AsyncStorage.getItem('userToken');
      // console.log('wdawdawda', token);
      setUserToken(token);
      return token;
    } catch (error) {
      console.error(error);
    }
  };
  const check_auth = () => {
    Axios.get('/auth')
      .then(res => {
        let {auth} = res.data;
        if (auth) {
          getItem_token();
        } else {
          setUserToken(null);
        }
        console.log(res.data);
      })
      .catch(err => {
        console.error('auth', err);
      });
  };
  const isLoggendIn = async () => {
    try {
      setIsLoading(true);
      check_auth();
      setIsLoading(false);
    } catch (error) {
      console.log(`is logged in error ${error}`);
    }
  };

  useEffect(() => {
    isLoggendIn();
  }, []);

  return (
    <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
      {children}
    </AuthContext.Provider>
  );
};
