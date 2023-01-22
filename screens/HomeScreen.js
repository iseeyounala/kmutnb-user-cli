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
import DropShadow from 'react-native-drop-shadow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-shadow-cards';

import {AuthContext} from '../context/AuthContext';
import {commonImage} from '../constant/images';
import HeaderHome from '../components/HeaderHome';
import CardMenu from '../components/CardMenu';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {logout, userToken} = useContext(AuthContext);
  let UserToken = AsyncStorage.getItem('userToken');
  return (
    // <LinearGradient
    //   colors={[
    //     'rgba(243,114,52,1)',
    //     'rgba(255,255,255,1)',
    //     // 'rgba(255,255,255,1)',

    //     // 'rgba(243,114,52,0.6)',
    //   ]}
    //   // colors={['rgba(248,167,128,1)', 'rgba(248,167,128,0.3)']}
    //   start={{x: 0, y: 2}}
    //   end={{x: 0, y: 0}}
    //   className="flex-1">
    //   <SafeAreaView>
    //     <HeaderHome />
    //     <ScrollView>
    //       <CardMenu navigation={navigation} />
    //     </ScrollView>
    //   </SafeAreaView>
    // </LinearGradient>
    <View className="flex-1 bg-white">
      <View className="flex-col h-72 bg-orange_theme rounded-br-[70px] rounded-bl-[70px] justify-center items-start">
        <View className=" bg-white h-28 rounded-tr-[40px] rounded-br-[40px] items-center justify-center">
          <HeaderHome />
          {/* <Text className="text-[#FFFF] text-[45px] font-kanit_semi_bold">
            KMUTNB
          </Text>
          <Text className="text-[#FFFF] text-[25px] font-kanit_semi_bold mt-[-20]">
            SMART SERVICE
          </Text> */}
        </View>
      </View>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <CardMenu navigation={navigation} />
          {/* <DropShadow
            style={{
              shadowColor: '#171717',
              shadowOffset: {width: 2, height: 100},
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}> */}
          {/* <View className="flex-row justify-around">
            <View>
              <View className="bg-green-500 rounded border-gray_new border h-32 w-36 justify-center items-center">
                <View className="bg-white border-gray_new border rounded-full w-16 h-16 justify-center items-center">
                  <Text>img</Text>
                </View>
                <Text className="text-white">wwww</Text>
              </View>
            </View>

            <View className="bg-white border-gray_new border rounded h-32 w-36 justify-center items-center">
              <Text>wwww</Text>
              <Text>wwww</Text>
            </View>
          </View> */}
          {/* <CardMenu navigation={navigation} /> */}
          {/* </DropShadow> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
