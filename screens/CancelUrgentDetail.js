import {View, Text} from 'react-native';
import React from 'react';

const CancelUrgentDetail = ({navigation, route}) => {
  return (
    <View className="flex-1 p-5">
      <View className="h-[160px] p-5 bg-white rounded">
        <View className="flex-row justify-center items-center">
          <Text className="font-kanit_semi_bold text-lg text-gray_new">
            ไม่รับรายการ
          </Text>
        </View>
        <View className="flex-row">
          <Text className="font-kanit_regular text-lg text-orange_theme">
            รายละเอียด: {route.params.detail}
          </Text>
          {/* <Text>{route.params.detail}</Text> */}
        </View>
      </View>
    </View>
  );
};

export default CancelUrgentDetail;
