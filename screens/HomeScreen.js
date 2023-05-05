import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
  Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthContext} from '../context/AuthContext';
import {commonImage} from '../constant/images';
import HeaderHome from '../components/HeaderHome';
import CardMenu from '../components/CardMenu';

const {width, height} = Dimensions.get('window');

import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import * as LocalAuthentication from 'expo-local-authentication';

const HomeScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext);

  const onFaceId = async () => {
    try {
      // Checking if device is compatible
      const isCompatible = await LocalAuthentication.hasHardwareAsync();

      if (!isCompatible) {
        console.log("Your device isn't compatible.");
        throw new Error("Your device isn't compatible.");
      }

      // Checking if device has biometrics records
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        Alert.alert('Authenticated', 'Fail!');
        // throw new Error('No Faces / Fingers found.');
      }

      // Authenticate user
      const UserAuth = await LocalAuthentication.authenticateAsync();
      if (UserAuth.success) {
        Alert.alert('Authenticated', 'Welcome back !');
      } else if (UserAuth.error == 'user_cancel' && !UserAuth.success) {
        Alert.alert('Authenticated Fail!!', '', [
          {
            text: 'OK',
            onPress: () => onFaceId(),
            style: 'cancel',
          },
        ]);
      }
      // console.log(UserAuth);
    } catch (error) {
      Alert.alert('An error as occured', error?.message);
    }
  };

  // const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  // const [fingerprint, setFingerprint] = useState(false);

  useEffect(() => {
    onFaceId();
    // (async () => {
    //   const compatible = await LocalAuthentication.hasHardwareAsync();
    //   console.log(compatible);
    //   setIsBiometricSupported(compatible);
    //   const enroll = await LocalAuthentication.isEnrolledAsync();
    //   if (enroll) {
    //     setFingerprint(true);
    //   }
    // })();
  }, []);

  // const handle = async () => {
  //   try {
  //     const biometricAuth = await LocalAuthentication.authenticateAsync();
  //     const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  //     console.log(biometricAuth);
  //     console.log(isEnrolled);
  //     // if (biometricAuth.success) {
  //     //   navigation.replace('Home');
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          {/* <Button title="Face ID" onPress={onFaceId} /> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
