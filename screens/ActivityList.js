import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, Fragment} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Axios from '../constant/Axios';
const {width, height} = Dimensions.get('window');

const ActivityList = ({navigation}) => {
  const [dataActivity, setDataActivity] = useState([]);
  const getDataActivity = () => {
    Axios.post('/mobile/user/getDataActivity')
      .then(res => {
        let {status, result} = res.data;
        status && setDataActivity(result);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    getDataActivity();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="mb-5">
        <TouchableOpacity
          onPress={() => navigation.navigate('MyActivityScreen')}
          className="bg-bule_new rounded-md h-10 flex-row justify-center items-center">
          <MaterialCommunityIcons name="cards" color="#FFF" size={18} />
          <Text className="text-white text-[15px] font-kanit_semi_bold ml-2">
            กิจกรรมที่เข้าร่วม
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {dataActivity.length > 0 &&
          dataActivity.map((val, idx) => {
            return (
              <Fragment key={idx}>
                {val.event_join_status == 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('DetailActivityScreen', {
                        detail_event: val,
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
                          source={{
                            uri: `http://172.20.10.4:3001/uploads/${val.event_img}`,
                          }}
                        />
                      </View>
                    </View>
                    <View className="flex-col flex-1 justify-center items-start p-5">
                      <Text className="text-orange_theme text-[18px] font-kanit_bold">
                        {val.event_name}
                      </Text>
                      <View className="flex-row bg-green-200 rounded-lg h-[25px] w-[150px] justify-center items-center">
                        <MaterialCommunityIcons
                          name="account-lock-open"
                          color="#1DAE46"
                          size={18}
                        />
                        <Text className="text-green_new text-[15px] font-kanit_semi_bold pl-2">
                          เปิด
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                {val.event_join_status == 1 && (
                  <TouchableOpacity className="flex-row bg-white border-[1px] border-orange_new h-[150px] rounded-xl mb-5">
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
                          source={{
                            uri: `http://192.168.1.5:3001/uploads/${val.event_img}`,
                          }}
                        />
                      </View>
                    </View>
                    <View className="flex-col flex-1 justify-center items-start p-5">
                      <Text className="text-orange_theme text-[18px] font-kanit_bold">
                        {val.event_name}
                      </Text>
                      <View className="flex-row bg-red-200 rounded-lg h-[25px] w-[150px] justify-center items-center">
                        <MaterialCommunityIcons
                          name="account-lock"
                          color="#E80000"
                          size={18}
                        />
                        <Text className="text-red-500 text-[15px] font-kanit_semi_bold pl-2">
                          ปิด
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </Fragment>
            );
          })}
      </ScrollView>
      <View className="bg-gray-100 h-[55px] justify-center" />
    </View>
  );
};

export default ActivityList;
