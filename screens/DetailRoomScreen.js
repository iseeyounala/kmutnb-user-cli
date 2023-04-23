import {
  View,
  Text,
  Button,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect, Fragment} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Carousel from 'react-native-reanimated-carousel';
import {useRoute} from '@react-navigation/native';
import moment from 'moment/min/moment-with-locales';
import {commonImage} from '../constant/images';
import Axios from '../constant/Axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModalSuccess from '../components/AlertModalSuccess';

const {width, height} = Dimensions.get('window');
moment.locale('th');

const DetailRoomScreen = ({navigation}) => {
  const route = useRoute();
  const {room, data_time} = route.params;
  const [imgRoom, setImgRoom] = useState([]);
  const [isModalChange, setIsModalChange] = useState(false);
  const [std_id, setStd_id] = useState();
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [textModal, setTextModal] = useState('');

  useEffect(() => {
    getImgRoom();
    get_user_data();
  }, []);

  const getImgRoom = () => {
    Axios.post('/mobile/user/getImgRoom', {
      rtt_id: room.rtt_id,
    })
      .then(res => {
        let {status, result} = res.data;
        status ? setImgRoom(result) : null;
      })
      .catch(err => {
        console.error(err);
      });
  };

  const toggleModalChange = () => {
    setIsModalChange(!isModalChange);
  };

  const get_user_data = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      setStd_id(currentUser.std_id);
    } catch (error) {
      console.log(error);
    }
  };

  const handelBookingRoom = () => {
    Axios.post('/mobile/user/bookingRoom', {
      std_id: std_id,
      rtt_id: room.rtt_id,
      booking_date: data_time.date,
      startTime: data_time.startTime,
      endTime: data_time.endTime,
    })
      .then(res => {
        let {status, meg} = res.data;
        if (status) {
          toggleModalChange();
          setTextModal(meg);
          setTimeout(() => {
            toggleModalSuccess();
          }, 500);
          setTimeout(() => {
            navigation.navigate('Home');
          }, 2000);
        }
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  return (
    <>
      <View className="flex-row justify-center items-center p-5">
        <Carousel
          loop
          width={width}
          height={width / 2}
          autoPlay={false}
          data={imgRoom}
          scrollAnimationDuration={1000}
          onSnapToItem={index => console.log('current index:', index)}
          renderItem={({item, index}) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: width * 1,
                  height: 100,
                  overflow: 'visible',
                }}
                // source={commonImage.roomSpark}
                source={{
                  uri: `http://172.20.10.4:3001/uploads/${item.rtt_img_name}`,
                }}
              />
            </View>
          )}
        />
      </View>
      <ScrollView className="flex-1 p-5 bg-gray-100">
        <View className="flex-colmn bg-white rounded-t-lg rounded-lg justify-center p-5">
          <View className="mt-2">
            <Text className="text-black text-[18px] font-kanit_bold">
              ห้อง {room.rtt_name}
            </Text>
            <View className="bg-orange_theme h-[3px] w-[100px]" />
          </View>
          <View className="flex-col">
            <View className="flex-row mt-2">
              <Text className="text-black text-[15px] font-kanit_semi_bold">
                วันที่:
              </Text>
              <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                {moment(data_time.date).format('LL')}
              </Text>
            </View>
            <View className="flex-row mt-2">
              <Text className="text-black text-[15px] font-kanit_semi_bold">
                เวลาเข้า:
              </Text>
              <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                {moment(data_time.startTime).format('LT')}
              </Text>
            </View>
            <View className="flex-row mt-2">
              <Text className="text-black text-[15px] font-kanit_semi_bold">
                เวลาออก:
              </Text>
              <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                {moment(data_time.endTime).format('LT')}
              </Text>
            </View>
            <View className="mt-2">
              <Text className="text-black text-[18px] font-kanit_bold">
                สิ่งอำนวยความสะดวก
              </Text>
              <View className="bg-orange_theme h-[3px] w-[170px]" />
            </View>
            <View className="flex-row justify-start items-center p-2">
              <MaterialCommunityIcons
                name="check-circle"
                color="#1DAE46"
                size={25}
              />
              <Text className="text-black text-[15px] ml-2 font-kanit_semi_bold">
                จอทีวี
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="flex-col p-5 bg-white">
        <TouchableOpacity
          onPress={toggleModalChange}
          className="bg-green_new rounded-md h-10 justify-center items-center mb-10">
          <Text className="text-white text-[15px] font-kanit_semi_bold">
            จอง
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        className="flex-1 p-10"
        isVisible={isModalChange}
        onBackdropPress={toggleModalChange}>
        <View className="flex-col bg-white rounded-md h-[250px] justify-center items-center">
          <View className="bg-red-500 h-15 w-15 p-4 rounded-full justify-center items-center mb-3">
            <MaterialCommunityIcons
              name="bell-outline"
              size={30}
              color="#FFFFFF"
            />
          </View>
          <Text className="text-lg font-normal font-kanit_light">
            ยืนยันการจองนี้?
          </Text>
          <View className="flex-row mt-5">
            <TouchableOpacity
              onPress={toggleModalChange}
              className="bg-red-500 rounded-lg h-[30px] w-[75px] justify-center items-center mr-5">
              <Text className="text-lg text-white font-normal font-kanit_light">
                ยกเลิก
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handelBookingRoom}
              className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
              <Text className="text-lg text-white font-normal font-kanit_light">
                ยืนยัน
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AlertModalSuccess
        isModalHandel={isModalHandelSuccess}
        onBackdropPress={toggleModalSuccess}
        detailText={textModal}
      />
    </>
  );
};

export default DetailRoomScreen;
