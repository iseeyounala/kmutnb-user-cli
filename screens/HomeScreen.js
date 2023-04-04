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
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthContext} from '../context/AuthContext';
import {commonImage} from '../constant/images';
import HeaderHome from '../components/HeaderHome';
import CardMenu from '../components/CardMenu';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {logout, userToken} = useContext(AuthContext);
  let UserToken = AsyncStorage.getItem('userToken');
  return (
    <View className="flex-1 bg-white">
      <View className="flex-col h-72 bg-orange_theme rounded-br-[70px] rounded-bl-[70px] justify-center items-start">
        <View className=" bg-white h-28 rounded-tr-[40px] rounded-br-[40px] items-center justify-center">
          <HeaderHome />
        </View>
      </View>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <CardMenu navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
