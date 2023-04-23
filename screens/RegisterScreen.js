import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';

import {UserIcon, LockClosedIcon} from 'react-native-heroicons/outline';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/AuthContext';
import {commonImage} from '../constant/images';
import AlertModalSuccess from '../components/AlertModalSuccess';
import AlertModalFail from '../components/AlertModalFail';
import Axios from '../constant/Axios';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = () => {
  const [openDropDownGender, setOpenDropDownGenger] = useState(false);
  const [valGender, setGender] = useState(null);
  const [itemGender, setItemGender] = useState([
    {label: 'นาย', value: 0},
    {label: 'นางสาว', value: 1},
    {label: 'นาง', value: 2},
  ]);

  const [openFaculty, setOpenFaculty] = useState(false);
  const [valFaculty, setFaculty] = useState(null);
  const [itemFaculty, setItemFaculty] = useState([]);

  const [openDepartment, setOpenDepartment] = useState(false);
  const [valDepartment, setDepartment] = useState(null);
  const [itemDepartment, setItemDepartment] = useState([]);

  const [std_number_id, setStd_number_id] = useState(null);
  const [std_fname, setStd_fname] = useState(null);
  const [std_lname, setStd_lname] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleIdStd = text => {
    setStd_number_id(text);
  };

  const handleStd_fname = text => {
    setStd_fname(text);
  };

  const handleStd_lname = text => {
    setStd_lname(text);
  };
  const handleUsername = text => {
    setUsername(text);
  };
  const handlePassword = text => {
    setPassword(text);
  };

  useEffect(() => {}, []);

  const handleRegister = () => {
    // console.log(
    //   'valFaculty',
    //   valFaculty,
    //   'valDepartment',
    //   valDepartment,
    //   'valGender',
    //   valGender,
    // );
    // console.log(
    //   'std_number_id',
    //   std_number_id,
    //   'std_fname',
    //   std_fname,
    //   'std_lname',
    //   std_lname,
    //   'username',
    //   username,
    //   'password',
    //   password,
    // );
  };

  return (
    <LinearGradient
      colors={['rgba(248,167,128,1)', 'rgba(248,167,128,0.3)']}
      start={{x: 1, y: 1}}
      end={{x: 0, y: 0}}
      className="flex-1 justify-center">
      <ScrollView>
        <View className="flex-1 justify-center">
          <View className="flex-colmn">
            <View className="bg-white m-5 rounded-md p-5">
              <Text className="text-gray_new font-kanit_light">
                <UserIcon color="black" size={20} /> รหัสนักศึกษา
              </Text>
              <TextInput
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                keyboardType="numeric"
                onChangeText={handleIdStd}
              />
              <Text className="text-gray_new font-kanit_light">
                <UserIcon color="black" size={20} /> คำนำหน้า
              </Text>
              <DropDownPicker
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                placeholder="เลือกคำนำหน้าชื่อ"
                placeholderStyle={{
                  color: 'grey',
                  fontWeight: 'bold',
                }}
                open={openDropDownGender}
                value={valGender}
                items={itemGender}
                setOpen={setOpenDropDownGenger}
                setValue={setGender}
                setItems={setItemGender}
              />
              <Text className="text-gray_new font-kanit_light mt-2">
                <UserIcon color="black" size={20} /> ชื่อ
              </Text>
              <TextInput
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                onChangeText={handleStd_fname}
              />
              <Text className="text-gray_new font-kanit_light">
                <UserIcon color="black" size={20} /> นามสกุล
              </Text>
              <TextInput
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                onChangeText={handleStd_lname}
              />
              <Text className="text-gray_new font-kanit_light">
                <UserIcon color="black" size={20} /> คณะ
              </Text>
              <DropDownPicker
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                placeholder="เลือกคณะ"
                placeholderStyle={{
                  color: 'grey',
                  fontWeight: 'bold',
                }}
                open={openFaculty}
                value={valFaculty}
                items={itemFaculty}
                setOpen={setOpenFaculty}
                setValue={setFaculty}
                setItems={setItemFaculty}
              />
              <Text className="text-gray_new font-kanit_light mt-2">
                <UserIcon color="black" size={20} /> สาขาวิชา
              </Text>
              <DropDownPicker
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                placeholder="เลือกสาขาวิชา"
                placeholderStyle={{
                  color: 'grey',
                  fontWeight: 'bold',
                }}
                open={openDepartment}
                value={valDepartment}
                items={itemDepartment}
                setOpen={setOpenDepartment}
                setValue={setDepartment}
                setItems={setItemDepartment}
              />
              <Text className="text-gray_new font-kanit_light mt-2">
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
                onPress={handleRegister}
                className="bg-green_new rounded-md h-10 my-2 justify-center items-center">
                <Text className="text-white font-kanit_light">สมัคร</Text>
              </TouchableOpacity>
            </View>
          </View>
          <AlertModalSuccess
          //   isModalHandel={isModalHandelSuccess}
          // onBackdropPress={toggleModalSuccess}
          //   detailText={textModal}
          />
          <AlertModalFail
          //   isModalHandel={isModalHandelFail}
          //   onBackdropPress={toggleModalFail}
          //   detailText={textModal}
          />
          <AlertModalFail
            //   isModalHandel={isModalHandelFail_Check}
            //   onBackdropPress={toggleModalFail_check}
            title={true}
            titleText="กรุณากรอก"
            detailText="Username หรือ Password"
          />
        </View>
      </ScrollView>
      {/* <View className="bg-gray-100 h-[8px] justify-center" /> */}
    </LinearGradient>
  );
};

export default RegisterScreen;
