import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModalSuccess from '../components/AlertModalSuccess';
import AlertModalFail from '../components/AlertModalFail';
import moment from 'moment/min/moment-with-locales';
import {useRoute} from '@react-navigation/native';
import Axios from '../constant/Axios';

const {width, height} = Dimensions.get('window');
moment.locale('th');

const DetailActivityScreen = ({navigation}) => {
  const route = useRoute();
  const {detail_event} = route.params;
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [textModal, setTextModal] = useState('');

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const handleJoin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/joinActivity', {
        dataActivity: detail_event,
        std_id: currentUser.std_id,
      })
        .then(res => {
          let {status, meg} = res.data;
          if (status) {
            setTextModal(meg);
            toggleModalSuccess();
            setTimeout(() => {
              navigation.replace('Home');
            }, 1500);
          } else {
            setTextModal(meg);
            toggleModalFail();
          }
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View className="flex-1 bg-gray-100 pt-5">
      <View
        style={{
          flex: 1,
          //   borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: width * 0.6,
            height: 50,
            overflow: 'visible',
          }}
          // source={commonImage.roomSpark}
          source={{
            uri: `http://172.20.10.4:3001/uploads/${detail_event.event_img}`,
          }}
        />
      </View>
      <ScrollView className="flex-1 p-5 bg-gray-100">
        <View className="flex-colmn bg-white rounded-t-lg rounded-lg justify-center p-5">
          <View className="mt-2">
            <Text className="text-orange_theme text-[18px] font-kanit_bold">
              {detail_event.event_name}
            </Text>
            <View className="bg-orange_theme h-[3px] w-[150px]" />
          </View>
          <View className="flex-col">
            <View className="flex-row mt-2">
              <Text className="text-black text-[15px] font-kanit_semi_bold">
                วันที่เริ่มสมัคร:
              </Text>
              <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                {moment(detail_event.event_start_date).format('LL')}
              </Text>
            </View>
            <View className="flex-row mt-2">
              <Text className="text-black text-[15px] font-kanit_semi_bold">
                วันที่สิ้นสุด:
              </Text>
              <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                {moment(detail_event.event_end_date).format('LL')}
              </Text>
            </View>
            <View className="mt-2">
              <Text className="text-black text-[18px] font-kanit_bold">
                รายละเอียด
              </Text>
              <View className="bg-orange_theme h-[3px] w-[170px]" />
            </View>
            <View className="flex-row justify-start items-center">
              <Text className="text-black text-[15px] font-kanit_semi_bold mt-2">
                {detail_event.event_detail}
              </Text>
            </View>
          </View>
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
      <View className="flex-col p-5 bg-white">
        <TouchableOpacity
          onPress={handleJoin}
          className="bg-green_new rounded-md h-10 justify-center items-center mb-10">
          <Text className="text-white text-[15px] font-kanit_semi_bold">
            เข้าร่วม
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailActivityScreen;
