import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const HistoryScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="p-3">
        <TouchableOpacity className="bg-[#FFFF] h-30 items-start justify-start rounded-lg flex-row p-5 my-3 shadow-lg">
          <View className="bg-orange_intense rounded-full w-16 h-16 justify-center items-center">
            <Text>img</Text>
          </View>
          <View className=" flex-1 flex-col mx-3">
            <Text className="font-kanit_semi_bold text-lg">
              จองห้อง Spark 1
            </Text>
            <Text className="font-kanit_light">เวลา : 22/01/2023</Text>
            <Text className="font-kanit_light">
              สถานะ :{' '}
              <Text className="text-red-500 font-kanit_semi_bold">
                รอเช็คอิน
              </Text>
            </Text>
          </View>
          <View className="flex-col mx-3 items-end">
            <Text className="font-kanit_semi_bold text-green_new text-base">
              สำเร็จ
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#FFFF] h-30 items-start justify-start rounded-lg flex-row p-5 my-3 shadow-lg">
          <View className="bg-orange_intense rounded-full w-16 h-16 justify-center items-center">
            <Text>img</Text>
          </View>
          <View className=" flex-1 flex-col mx-3">
            <Text className="font-kanit_semi_bold text-lg">
              จองห้อง Spark 1
            </Text>
            <Text className="font-kanit_light">เวลา : 22/01/2023</Text>
            <Text className="font-kanit_light">
              สถานะ :{' '}
              <Text className="text-green-500 font-kanit_semi_bold">
                เช็คอินสำเร็จ
              </Text>
            </Text>
          </View>
          <View className="flex-col mx-3 items-end">
            <Text className="font-kanit_semi_bold text-green_new text-base">
              สำเร็จ
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
