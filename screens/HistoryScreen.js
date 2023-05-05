import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Axios from '../constant/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment/min/moment-with-locales';
import {commonImage} from '../constant/images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width, height} = Dimensions.get('window');
moment.locale('th');
const HistoryScreen = () => {
  // const [std_id, setStd_id] = useState([]);
  const [dataRoom, setDataRoom] = useState([]);
  const [dataCar, setDataCar] = useState([]);

  const getDataStd = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      // setStd_id(currentUser.std_id);
      getDataRoom(currentUser.std_id);
      getDataCar(currentUser.std_id);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataRoom = std_id => {
    Axios.post('/mobile/user/getHistory', {
      std_id: std_id,
    }).then(res => {
      let {status, result} = res.data;
      if (status) {
        setDataRoom(result);
      }
      // console.log(res.data);
    });
  };

  const getDataCar = std_id => {
    Axios.post('/mobile/user/getHsitoryCar', {
      std_id: std_id,
    }).then(res => {
      let {status, result} = res.data;
      if (status) {
        setDataCar(result);
        // console.log(result);
      }
      // console.log(res.data);
    });
  };

  useEffect(() => {
    getDataStd();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="p-3">
        {dataRoom.length > 0 &&
          dataRoom.map((val, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                className="bg-[#FFFF] h-30 items-center justify-start rounded-lg flex-row p-5 my-3 shadow-lg">
                <View>
                  <Image
                    className="bg-orange_intense rounded-full w-16 h-16 justify-center items-center"
                    // resizeMode="cover"
                    // style={{
                    //   width: width * 0.3,
                    //   height: height * 0.1,
                    //   // overflow: 'visible',
                    // }}
                    source={commonImage.roomSpark}
                  />
                </View>
                <View className=" flex-1 flex-col mx-3">
                  <Text className="font-kanit_semi_bold text-lg">
                    {val.rtt_name}
                  </Text>
                  <Text className="font-kanit_light">
                    วันที่ : {moment(val.booking_date).format('LL')}
                  </Text>
                  <Text className="font-kanit_light">
                    เวลาเข้า : {val.booking_start_time}
                  </Text>
                  <Text className="font-kanit_light">
                    เวลาออก : {val.booking_end_time}
                  </Text>
                  {val.booking_status == 0 && (
                    <Text className="font-kanit_light">
                      สถานะ :{' '}
                      <Text className="text-red-500 font-kanit_semi_bold">
                        รอเช็คอิน
                      </Text>
                    </Text>
                  )}
                  {val.booking_status == 1 && (
                    <Text className="font-kanit_light">
                      สถานะ :{' '}
                      <Text className="text-green-500 font-kanit_semi_bold">
                        เช็คอินสำเร็จ
                      </Text>
                    </Text>
                  )}
                </View>
                <View className="flex-col mx-3 items-end">
                  <Text className="font-kanit_semi_bold text-green_new text-base">
                    สำเร็จ
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

        {dataCar.length > 0 &&
          dataCar.map((val, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                className="bg-[#FFFF] h-30 items-center justify-start rounded-lg flex-row p-5 my-3 shadow-lg">
                <View>
                  <TouchableOpacity
                    // onPress={handleNavigationCar}
                    className="bg-orange_theme rounded-full justify-center items-center h-16 w-16">
                    <MaterialCommunityIcons
                      name="train-car-passenger-door-open"
                      color="#FFF"
                      size={32}
                    />
                  </TouchableOpacity>
                </View>
                <View className=" flex-1 flex-col mx-3">
                  <Text className="font-kanit_semi_bold text-lg">รถรับส่ง</Text>
                  <Text className="font-kanit_light">
                    วันที่ : {moment(val.get_car_created_at).format('LLL')}
                  </Text>
                  <Text className="font-kanit_light">
                    ต้นทาง : {val.departure_name}
                  </Text>
                  <Text className="font-kanit_light">
                    ปลายทาง : {val.destination_name}
                  </Text>
                  {val.get_car_status == 0 && (
                    <Text className="font-kanit_light">
                      สถานะ :{' '}
                      <Text className="text-red-500 font-kanit_semi_bold">
                        เกิดข้อผิดพลาด
                      </Text>
                    </Text>
                  )}
                  {val.get_car_status == 1 && (
                    <Text className="font-kanit_light">
                      สถานะ :{' '}
                      <Text className="text-orange_theme font-kanit_semi_bold">
                        รอรถ
                      </Text>
                    </Text>
                  )}
                  {val.get_car_status == 2 && (
                    <Text className="font-kanit_light">
                      สถานะ :{' '}
                      <Text className="text-green_new font-kanit_semi_bold">
                        อยู่บนรถ
                      </Text>
                    </Text>
                  )}
                  {val.get_car_status == 3 && (
                    <Text className="font-kanit_light">
                      สถานะ :{' '}
                      <Text className="text-green_new font-kanit_semi_bold">
                        สำเร็จ
                      </Text>
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

        {/* <TouchableOpacity className="bg-[#FFFF] h-30 items-start justify-start rounded-lg flex-row p-5 my-3 shadow-lg">
          <View className="bg-orange_intense rounded-full w-16 h-16 justify-center items-center">
            <Text>img</Text>
          </View>
          <View className=" flex-1 flex-col mx-3">
            <Text className="font-kanit_semi_bold text-lg">
              จองห้อง Spark 1
            </Text>
            <Text className="font-kanit_light">เวลา : 22/01/2023</Text>
            <Text className="font-kanit_light">
              สถานะ :{' '}
              <Text className="text-green-500 font-kanit_semi_bold">
                เช็คอินสำเร็จ
              </Text>
            </Text>
          </View>
          <View className="flex-col mx-3 items-end">
            <Text className="font-kanit_semi_bold text-green_new text-base">
              สำเร็จ
            </Text>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
      <View className="bg-gray-100 h-[8px] justify-center" />
    </SafeAreaView>
  );
};

export default HistoryScreen;
