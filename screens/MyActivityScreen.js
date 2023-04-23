import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, Fragment, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../constant/Axios';
const {width, height} = Dimensions.get('window');

const MyActivityScreen = ({navigation}) => {
  const [dataMyActivity, setDataMyActivity] = useState([]);

  const getDataActivity = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/getMyActivity', {std_id: currentUser.std_id})
        .then(res => {
          let {status, result} = res.data;
          status && setDataMyActivity(result);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataActivity();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <ScrollView>
        {dataMyActivity.length > 0 &&
          dataMyActivity.map((val, idx) => {
            return (
              <Fragment key={idx}>
                <View
                  //   onPress={() => {
                  //     navigation.navigate('DetailActivityScreen', {
                  //       detail_event: val,
                  //     });
                  //   }}
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
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ReportActivity', {
                          dataActivity: val,
                        })
                      }
                      className="bg-green-400 rounded-lg h-[35px] w-[50px] justify-center items-center">
                      <MaterialCommunityIcons
                        name="application-edit-outline"
                        color="#FFFF"
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Fragment>
            );
          })}
      </ScrollView>
      <View className="bg-gray-100 h-[55px] justify-center" />
    </View>
  );
};

export default MyActivityScreen;
