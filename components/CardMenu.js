import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const CardMenu = () => {
  return (
    <>
      <View className="flex flex-row justify-between mx-5 mt-3">
        <Text
          style={{fontFamily: 'Kanit-Medium', fontSize: 18}}
          className="text-gray_new">
          บริการ
        </Text>
        <Text
          style={{fontFamily: 'Kanit-Medium', fontSize: 15}}
          className="text-bule_new">
          ดูทั้งหมด
        </Text>
      </View>
      <View className="flex flex-row justify-between items-center mx-5 px-5 bg-white rounded-lg h-24 mt-2">
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_intense rounded-full justify-center items-center h-14 w-14">
            <Text>img</Text>
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 12}}
            className="text-gray_new">
            รถรับส่ง
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_intense rounded-full justify-center items-center h-14 w-14">
            <Text>img</Text>
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 12}}
            className="text-gray_new">
            จองห้อง
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_intense rounded-full justify-center items-center h-14 w-14">
            <Text>img</Text>
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 12}}
            className="text-gray_new">
            แจ้งปัญหา
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <TouchableOpacity className="bg-orange_intense rounded-full justify-center items-center h-14 w-14">
            <Text>img</Text>
          </TouchableOpacity>
          <Text
            style={{fontFamily: 'Kanit-Medium', fontSize: 12}}
            className="text-gray_new">
            ยืมอุปกรณ์กีฬา
          </Text>
        </View>
      </View>
    </>
  );
};

export default CardMenu;
