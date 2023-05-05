import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Axios from '../constant/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import AlertModalSuccess from '../components/AlertModalSuccess';
import AlertModalFail from '../components/AlertModalFail';

const AccountScreen = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const {logout} = useContext(AuthContext);
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [textModal, setTextModal] = useState('');

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const getUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/getUserData', {
        std_id: currentUser.std_id,
      }).then(res => {
        let {status, result} = res.data;
        // console.log(result);
        if (status) {
          setUserData(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const gotoEditUserdata = () => {
    navigation.navigate('EditAccountScreen', {userData: userData});
  };

  const handleDelUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/delUser', {
        std_id: currentUser.std_id,
      }).then(res => {
        let {status, meg} = res.data;
        if (status) {
          setTextModal(meg);
          toggleModalSuccess();
          logout();
        } else {
          toggleModalFail();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <ScrollView>
        <View className="flex-colmn bg-white rounded-t-lg rounded-lg mt-5 justify-center p-5">
          <View className="flex-row  rounded-lg justify-start items-center">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              รหัสนักศึกษา: {userData.std_number_id}
            </Text>
          </View>
          <View className="flex-row  rounded-lg justify-start items-center">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              ชื่อ: {userData.std_fname}
            </Text>
          </View>
          <View className="flex-row  rounded-lg justify-start items-center">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              นามสกุล: {userData.std_lname}
            </Text>
          </View>
          <View className="flex-row  rounded-lg justify-start items-center">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              คณะ: {userData.fct_name}
            </Text>
          </View>
          <View className="flex-row  rounded-lg justify-start items-center">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              สาขาวิชา: {userData.dpm_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={gotoEditUserdata}
            className="bg-orange_theme rounded-md h-10 justify-center items-center mt-5">
            <Text className="text-white text-[15px] font-kanit_semi_bold">
              แก้ไขบัญชี
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={logout}
            className="bg-bule_new rounded-md h-10 justify-center items-center mt-5">
            <Text className="text-white text-[15px] font-kanit_semi_bold">
              ออกจากระบบ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelUser}
            className="bg-red-500 rounded-md h-10 justify-center items-center mt-5">
            <Text className="text-white text-[15px] font-kanit_semi_bold">
              ลบบัญชี
            </Text>
          </TouchableOpacity>
        </View>
        <AlertModalFail
          isModalHandel={isModalHandelFail}
          onBackdropPress={toggleModalFail}
          detailText={textModal}
        />
        <AlertModalSuccess
          isModalHandel={isModalHandelSuccess}
          onBackdropPress={toggleModalSuccess}
          detailText={textModal}
        />
      </ScrollView>
      <View className="bg-gray-100 h-[55px] justify-center" />
    </View>
  );
};

export default AccountScreen;
