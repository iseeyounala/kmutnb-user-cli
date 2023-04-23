import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import ResponsiveImage from '../components/ResponsiveImage';
import Axios from '../constant/Axios';
import {commonImage} from '../constant/images';

const {width, height} = Dimensions.get('window');

const RoomListScreen = ({navigation}) => {
  const route = useRoute();
  const {date, startTime, endTime, cpr_id} = route.params;
  const [room, setRoom] = useState([]);

  useEffect(() => {
    handleSearchRoom();
  }, []);

  const handleSearchRoom = () => {
    Axios.post('/mobile/user/searchRoom', {
      cpr_id: cpr_id,
      date: date,
      startTime: startTime,
      endTime: endTime,
    })
      .then(res => {
        let {status, result} = res.data;
        status ? setRoom(result) : null;
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <>
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1 pl-5 pr-5 pt-5 pb-10 bg-white">
          {/* <View className="mb-5">
            <Text className="text-black font-kanit_semi_bold">
              วันที่ 13 / 03 / 2566
            </Text>
            <View className="bg-orange_theme h-[3px] w-[140px]" />
          </View> */}
          {room.map((val, key) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  navigation.navigate('DetailRoomScreen', {
                    room: val,
                    data_time: {
                      date: date,
                      startTime: startTime,
                      endTime: endTime,
                    },
                  });
                }}
                className="flex-row bg-white border-[1px] border-orange_new h-[150px] rounded-xl mb-5">
                <View className="flex-1 justify-center items-center">
                  <View className="flex-row rounded-lg">
                    <Image
                      className="rounded-lg"
                      // resizeMode="cover"
                      style={{
                        width: width * 0.3,
                        height: height * 0.1,
                        // overflow: 'visible',
                      }}
                      source={commonImage.roomSpark}
                    />
                  </View>
                </View>
                <View className="flex-col flex-1 justify-center items-start p-5">
                  <Text className="text-orange_theme text-[18px] font-kanit_bold">
                    {val.rtt_name}
                  </Text>
                  <View className="flex-row bg-green-200 rounded-lg h-[25px] w-[150px] justify-center items-center">
                    <MaterialIcons name="groups" color="#1DAE46" size={18} />
                    <Text className="text-green_new text-[15px] font-kanit_semi_bold pl-2">
                      {val.rtt_join_amount}
                    </Text>
                  </View>
                  {/* <Text className="text-green_new text-[15px] font-kanit_semi_bold">
                รายละเอียด 
              </Text> */}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default RoomListScreen;
