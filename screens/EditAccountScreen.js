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
import {useRoute} from '@react-navigation/native';

const EditAccountScreen = ({navigation}) => {
  const route = useRoute();
  const {userData} = route.params;
  useEffect(() => {
    console.log(userData);
    setStd_number_id(userData.std_number_id);
    setStd_fname(userData.std_fname);
    setStd_lname(userData.std_lname);
    setGender(userData.std_gender);
    setFaculty(userData.fct_id);
    setDepartment(userData.dpm_id);
  }, []);

  const [textModal, setTextModal] = useState('');
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail_Check, setModalHandelFail_Check] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);

  const toggleModalFail_check = () => {
    setModalHandelFail_Check(!isModalHandelFail_Check);
  };
  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };
  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

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

  useEffect(() => {
    getDataFaculty();
    getDataDepartment();
  }, []);

  const getDataFaculty = () => {
    Axios.post('/mobile/user/getFaculty')
      .then(res => {
        let {status, result} = res.data;
        status && setItemFaculty(result);
        // console.log(result);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getDataDepartment = () => {
    Axios.post('/mobile/user/getDepartment')
      .then(res => {
        let {status, result} = res.data;
        status && setItemDepartment(result);
        // console.log(result);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleRegister = () => {
    console.log(
      'valFaculty',
      valFaculty,
      'valDepartment',
      valDepartment,
      'valGender',
      valGender,
    );
    console.log(
      'std_number_id',
      std_number_id,
      'std_fname',
      std_fname,
      'std_lname',
      std_lname,
      //   'username',
      //   username,
      //   'password',
      //   password,
    );
    if (
      !std_number_id ||
      !std_fname ||
      !std_lname ||
      //   !username ||
      //   !password ||
      !valFaculty ||
      !valDepartment
    ) {
      setTextModal('ข้อมูลมีช่องว่าง');
      toggleModalFail();
    } else {
      Axios.post('/mobile/user/editUserdata', {
        std_id: userData.std_id,
        std_number_id: std_number_id,
        valGender: valGender,
        std_fname: std_fname,
        std_lname: std_lname,
        // username: username,
        // password: password,
        valFaculty: valFaculty,
        valDepartment: valDepartment,
      })
        .then(res => {
          let {status, meg} = res.data;
          if (status) {
            setTextModal(meg);
            toggleModalSuccess();
            setTimeout(() => {
              navigation.goBack();
            }, 1000);
          } else {
            setTextModal(meg);
            toggleModalFail();
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  };
  return (
    <View className="flex-1 bg-gray-100 pt-5">
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
                value={std_number_id}
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
                value={std_fname}
              />
              <Text className="text-gray_new font-kanit_light">
                <UserIcon color="black" size={20} /> นามสกุล
              </Text>
              <TextInput
                className="bg-orange_new rounded-md h-10 my-2 px-3"
                onChangeText={handleStd_lname}
                value={std_lname}
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
                value={valFaculty}
                open={openFaculty}
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
              <TouchableOpacity
                onPress={handleRegister}
                className="bg-orange_theme rounded-md h-10 my-2 justify-center items-center mt-5">
                <Text className="text-white font-kanit_light">แก้ไขข้อมูล</Text>
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
            detailText="ข้อมูลให้ครบ"
          />
        </View>
      </ScrollView>
      <View className="bg-gray-100 h-[8px] justify-center" />
    </View>
  );
};

export default EditAccountScreen;
