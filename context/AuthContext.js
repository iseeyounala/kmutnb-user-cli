import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../constant/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async ({token, std_id}) => {
    let data = {
      std_id: std_id,
    };
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(data));
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
  // const getUserData = async () => {
  //   try {
  //     const savedUser = await AsyncStorage.getItem('userData');
  //     // const currentUser = JSON.parse(savedUser);
  //     return savedUser;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const check_auth = () => {
    AsyncStorage.getItem('userToken').then(val => {
      const token = val;
      if (token.length > 0) {
        Axios.get('/auth')
          .then(res => {
            let {auth} = res.data;
            if (auth) {
              setUserToken(token);
            } else {
              setUserToken(null);
            }
            console.log(res.data);
          })
          .catch(err => {
            console.error('auth', err);
          });
      }
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
