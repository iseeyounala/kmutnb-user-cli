import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from '../constant/Axios';
import Modal from 'react-native-modal';
import AlertModalFail from '../components/AlertModalFail';
import AlertModalSuccess from '../components/AlertModalSuccess';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EquipmentListScreen = ({navigation}) => {
  const [dataEq, setDataEq] = useState([]);
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [textModal, setTextModal] = useState('');

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const getDataEq = () => {
    Axios.post('mobile/user/getDataEq')
      .then(res => {
        let {status, result} = res.data;
        if (status && result.length > 0) {
          let data_new = [];
          result.map((val, idx) => {
            data_new.push({
              eq_id: val.eq_id,
              eq_sport_name: val.eq_sport_name,
              eq_sport_amount: val.eq_sport_amount,
              eq_user_amount: 0,
            });
            if (result.length - 1 == idx) {
              setDataEq(data_new);
            }
          });
        }
        // console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    getDataEq();
  }, []);

  const incrementEqUserAmount = eq_id => {
    setDataEq(prevDataNew => {
      return prevDataNew.map(obj => {
        if (obj.eq_id === eq_id && obj.eq_user_amount < obj.eq_sport_amount) {
          return {...obj, eq_user_amount: obj.eq_user_amount + 1};
        } else {
          return obj;
        }
      });
    });
  };

  const minusEqUserAmount = eq_id => {
    setDataEq(prevDataNew => {
      return prevDataNew.map(obj => {
        if (obj.eq_id === eq_id && obj.eq_user_amount > 0) {
          return {...obj, eq_user_amount: obj.eq_user_amount - 1};
        } else {
          return obj;
        }
      });
    });
  };

  const handleSubmit = async () => {
    const data = dataEq.filter(val => val.eq_user_amount !== 0);
    if (data.length > 0) {
      try {
        const savedUser = await AsyncStorage.getItem('userData');
        const currentUser = JSON.parse(savedUser);
        Axios.post('/mobile/user/borrowEq', {
          data: data,
          std_id: currentUser.std_id,
        })
          .then(res => {
            let {status, meg} = res.data;
            if (status) {
              setTextModal(meg);
              toggleModalSuccess();
              setTimeout(() => {
                navigation.replace('BorrowEqList');
              }, 1500);
            }
          })
          .catch(err => {
            console.error(err);
          });
      } catch (error) {
        console.log(error);
      }

      //   console.log('borrow');
    } else {
      setTextModal('โปรดระบุอุปกรณ์ที่ต้องการยืม');
      toggleModalFail();
      //   console.log('fail');
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View>
        <TouchableOpacity
          onPress={() => navigation.replace('BorrowEqList')}
          className="bg-bule_new rounded-md h-10 flex-row justify-center items-center">
          <MaterialCommunityIcons name="human-dolly" color="#FFF" size={18} />
          <Text className="text-white text-[15px] font-kanit_semi_bold ml-2">
            การยืม
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {dataEq.map((val, key) => {
          return (
            <View
              key={key}
              className="flex-row bg-white rounded-lg justify-between p-2 mt-5">
              <View className="flex-row  rounded-lg h-[65px] items-center ml-2">
                <Text className="text-orange_theme text-[15px] font-kanit_semi_bold">
                  {val.eq_sport_name}
                </Text>
              </View>
              <View className="flex-row rounded-lg h-[65px] justify-center items-center">
                <MaterialCommunityIcons
                  name="archive"
                  color="#000000"
                  size={18}
                />
                <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                  {val.eq_sport_amount} ชิ้น
                </Text>
              </View>
              <View className="flex-row  rounded-lg h-[65px] justify-around items-center">
                <TouchableOpacity
                  onPress={() => minusEqUserAmount(val.eq_id)}
                  className="bg-red-500 h-[30px] w-[30px] justify-center items-center rounded-full mr-2">
                  <MaterialCommunityIcons
                    name="minus-circle-outline"
                    color="#FFF"
                    size={18}
                  />
                </TouchableOpacity>
                <Text className="text-black text-[15px] font-kanit_semi_bold mr-2">
                  -
                </Text>
                <TouchableOpacity
                  onPress={() => incrementEqUserAmount(val.eq_id)}
                  className="bg-green_new h-[30px] w-[30px] justify-center items-center rounded-full">
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    color="#FFF"
                    size={18}
                  />
                </TouchableOpacity>
                <Text className="text-black text-[15px] font-kanit_semi_bold ml-2 mr-2">
                  {val.eq_user_amount} ชิ้น
                </Text>
              </View>
            </View>
          );
        })}
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
      <View className="bg-gray-100 h-[55px] justify-center">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green_new rounded-md h-10 justify-center items-center">
          <Text className="text-white text-[18px] font-kanit_semi_bold">
            ยืม
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EquipmentListScreen;
