import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext} from 'react';

import {UserIcon, LockClosedIcon} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/AuthContext';
import {commonImage} from '../constant/images';
import AlertModalSuccess from '../components/AlertModalSuccess';
import AlertModalFail from '../components/AlertModalFail';
import Axios from '../constant/Axios';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const {login} = useContext(AuthContext);
  const [test, setTest] = useState(AsyncStorage.getItem('userToken'));
  const [textModal, setTextModal] = useState('');
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail_Check, setModalHandelFail_Check] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  const handleUsername = text => {
    setUsername(text);
  };
  const handlePassword = text => {
    setPassword(text);
  };
  const toggleModalFail_check = () => {
    setModalHandelFail_Check(!isModalHandelFail_Check);
  };
  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };
  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };
  const call_api_login = () => {
    Axios.post('/mobile/user/login', {
      username: Username,
      password: Password,
    })
      .then(res => {
        let {status, meg, token, std_id} = res.data;
        if (status) {
          toggleModalSuccess();
          setTextModal(meg);
          setTimeout(() => {
            // login(token, std_id);
            login(res.data);
          }, 1000);
        } else {
          toggleModalFail();
          setTextModal(meg);
        }
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const loginHandle = () => {
    if (!Username == '' && !Password == '') {
      call_api_login();
    } else {
      toggleModalFail_check();
    }
  };
  return (
    <LinearGradient
      colors={['rgba(248,167,128,1)', 'rgba(248,167,128,0.3)']}
      start={{x: 1, y: 1}}
      end={{x: 0, y: 0}}
      className="flex-1 justify-center">
      <SafeAreaView className="flex-1 justify-center">
        <View className="flex-colmn">
          <View className="items-center">
            {/* <Image
              resizeMode="contain"
              style={{
                width: width * 0.5,
                height: 130,
                overflow: 'visible',
                margin: 5,
              }}
              source={commonImage.logoKMUTNB}
            /> */}
            <Image
              resizeMode="cover"
              style={{width: width * 0.5, height: 50, overflow: 'visible'}}
              source={commonImage.logoTextKMUTNB}
            />
            <Text className="text-gray_new text-lg font-kanit_regular">
              SMART SERVICE
            </Text>
          </View>
          <View className="bg-white m-5 rounded-md p-5">
            <Text className="text-gray_new font-kanit_light">
              <UserIcon color="black" size={20} /> Username
            </Text>
            <TextInput
              className="bg-orange_new rounded-md h-10 my-2 px-3"
              onChangeText={handleUsername}
            />
            <Text className="text-gray_new font-kanit_light">
              <LockClosedIcon color="black" size={20} className="mr-5" />
              Password
            </Text>
            <TextInput
              className="bg-orange_new rounded-md h-10 my-2 px-3"
              secureTextEntry={true}
              onChangeText={handlePassword}
            />
            <TouchableOpacity
              onPress={loginHandle}
              className="bg-green_new rounded-md h-10 my-2 justify-center items-center">
              <Text className="text-white font-kanit_light">เข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AlertModalSuccess
          isModalHandel={isModalHandelSuccess}
          // onBackdropPress={toggleModalSuccess}
          detailText={textModal}
        />
        <AlertModalFail
          isModalHandel={isModalHandelFail}
          onBackdropPress={toggleModalFail}
          detailText={textModal}
        />
        <AlertModalFail
          isModalHandel={isModalHandelFail_Check}
          onBackdropPress={toggleModalFail_check}
          title={true}
          titleText="กรุณากรอก"
          detailText="Username หรือ Password"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
