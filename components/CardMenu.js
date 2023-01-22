import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
// import {TruckIcon} from 'react-native-heroicons/outline';
import {
  TruckIcon,
  ExclamationCircleIcon,
  TagIcon,
} from 'react-native-heroicons/solid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CardMenu = ({navigation}) => {
  const handleNavigationCar = () => {
    navigation.navigate('Car');
  };
  return (
    <>
      <View className="flex flex-row justify-between mx-5 mt-3">
        <Text
          style={{fontFamily: 'Kanit-Medium', fontSize: 24}}
          className="text-gray_new">
          บริการ
        </Text>
        {/* <Text
          style={{fontFamily: 'Kanit-Medium', fontSize: 15}}
          className="text-bule_new">
          ดูทั้งหมด
        </Text> */}
      </View>
      <View className="flex flex-row justify-between items-center mx-5 px-3 backdrop-opacity-50 rounded-lg h-24 mt-2 backdrop-blur-none">
        <View className="flex-col justify-center items-center">
          <TouchableOpacity
            onPress={handleNavigationCar}
            className="bg-orange_theme rounded-full justify-center items-center h-16 w-16">
            <MaterialCommunityIcons
              name="train-car-passenger-door-open"
              color="#FFF"
              size={32}
            />
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 15}}
            className="text-gray_new">
            รถรับส่ง
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_theme rounded-full justify-center items-center h-16 w-16">
            <TagIcon color="#FFF" size={32} />
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 15}}
            className="text-gray_new">
            จองห้อง
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_theme rounded-full justify-center items-center h-16 w-16">
            <ExclamationCircleIcon color="#FFF" size={32} />
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 15}}
            className="text-gray_new">
            แจ้งปัญหา
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_theme rounded-full justify-center items-center h-16 w-16">
            <MaterialIcons name="sports-cricket" color="#FFF" size={32} />
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 15}}
            className="text-gray_new">
            อุปกรณ์กีฬา
          </Text>
        </View>
      </View>
    </>
  );
};

export default CardMenu;
