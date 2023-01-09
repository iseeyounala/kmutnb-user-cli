import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonImage} from '../constant/images';
import HeaderHome from '../components/HeaderHome';
import CardMenu from '../components/CardMenu';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const {logout, userToken} = useContext(AuthContext);
  let UserToken = AsyncStorage.getItem('userToken');
  return (
    <LinearGradient
      colors={['rgba(248,167,128,1)', 'rgba(248,167,128,0.3)']}
      start={{x: 1, y: 1}}
      end={{x: 0, y: 0}}
      className="flex-1">
      <SafeAreaView>
        <HeaderHome />
        <ScrollView>
          <CardMenu />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
