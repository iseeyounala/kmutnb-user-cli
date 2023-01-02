import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {UserIcon, LockClosedIcon} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/AuthContext';
var {width} = Dimensions.get('window');

const LoginScreen = () => {
  const {login} = useContext(AuthContext);
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  const handleUsername = text => {
    console.log(text);
    setUsername(text);
  };
  const handleSubmit = () => {
    if (!Username && !Password) {
      let data = {
        username: Username,
        password: Password,
      };
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
            <Image
              resizeMode="contain"
              style={{
                width: width * 0.5,
                height: 130,
                overflow: 'visible',
                margin: 5,
              }}
              source={require('../assets/logo_kmutnb_2.png')}
            />
            <Image
              resizeMode="cover"
              style={{width: width * 0.5, height: 50, overflow: 'visible'}}
              source={require('../assets/logo-kmutnb.png')}
            />
            <Text
              className="text-gray_new text-lg"
              style={{fontFamily: 'Kanit-Regular'}}>
              SMART SERVICE
            </Text>
          </View>
          <View className="bg-white m-5 rounded-md p-5">
            <Text className="text-gray_new" style={{fontFamily: 'Kanit-Light'}}>
              <UserIcon color="black" size={20} /> Username
            </Text>
            <TextInput
              className="bg-orange_new backdrop-invert rounded-md h-7 my-2 px-3"
              onChange={handleUsername}
            />
            <Text className="text-gray_new" style={{fontFamily: 'Kanit-Light'}}>
              <LockClosedIcon color="black" size={20} className="mr-5" />
              Password
            </Text>
            <TextInput
              className="bg-orange_new rounded-md h-7 my-2 px-3"
              secureTextEntry={true}
            />
            <TouchableOpacity
              onPress={login}
              className="bg-green_new backdrop-invert rounded-md h-10 my-2 justify-center items-center">
              <Text className="text-white" style={{fontFamily: 'Kanit-Light'}}>
                เข้าสู่ระบบ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
