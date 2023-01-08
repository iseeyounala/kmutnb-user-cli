import React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import {commonImage} from '../constant/images';

const {width, height} = Dimensions.get('window');

const HeaderHome = () => {
  return (
    <>
      <View className="flex-col justify-center items-center">
        <Image
          resizeMode="contain"
          style={{
            width: width * 0.5,
            height: 90,
            overflow: 'visible',
            margin: 5,
          }}
          source={commonImage.logoKMUTNB}
        />
        <Image
          resizeMode="contain"
          style={{
            width: width * 0.5,
            height: 38,
            overflow: 'visible',
            marginBottom: -10,
          }}
          source={commonImage.logoTextKMUTNB}
        />
        <Text
          className="text-gray_new text-lg"
          style={{fontFamily: 'Kanit-Regular'}}>
          SMART SERVICE
        </Text>
      </View>
    </>
  );
};

export default HeaderHome;
