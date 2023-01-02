import React, {useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const {logout, userToken} = useContext(AuthContext);
  let UserToken = AsyncStorage.getItem('userToken');
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={logout}>
        <Text>HomeScreen</Text>
      </TouchableOpacity>
      <Text>{userToken}</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
