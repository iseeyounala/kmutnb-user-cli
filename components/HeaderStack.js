import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';

const HeaderStack = ({title, goBackClose}) => {
  const navigation = useNavigation();
  return (
    <>
      {Platform.OS === 'ios' && (
        <View className="flex-row items-center h-[110px] pt-[35] bg-orange_theme">
          <View className="flex-1">
            {goBackClose ?? (
              <TouchableOpacity className="p-[10]" onPress={navigation.goBack}>
                <ChevronLeftIcon size={35} color="#FFFF" />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-1 justify-center items-center">
            <Text className="font-kanit_semi_bold text-[20px] text-[#FFFF]">
              {title}
            </Text>
          </View>
          <View className="flex-1" />
        </View>
      )}
      {Platform.OS === 'android' && (
        <View className="flex-row items-center h-[80] bg-orange_theme">
          <View className="flex-1">
            {goBackClose ?? (
              <TouchableOpacity className="p-[10]" onPress={navigation.goBack}>
                <ChevronLeftIcon size={35} color="#FFFF" />
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-1 justify-center items-center">
            <Text className="font-kanit_semi_bold text-[20px] p-[10] text-[#FFFF]">
              {title}
            </Text>
          </View>
          <View className="flex-1" />
        </View>
      )}
    </>
  );
};

export default HeaderStack;
