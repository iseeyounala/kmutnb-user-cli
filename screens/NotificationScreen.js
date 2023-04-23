import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Axios from '../constant/Axios';

const NotificationScreen = () => {
  const [dataNoti, setDataNoti] = useState([]);
  const get_noti = () => {
    Axios.post('/mobile/user/getNoti/')
      .then(res => {
        let {status, result} = res.data;
        status ? setDataNoti(result) : null;
        // console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    get_noti();
  }, []);

  return (
    <View className="flex-1 p-5 bg-gray-100">
      {dataNoti.length > 0 &&
        dataNoti.map((val, idx) => {
          return (
            <TouchableOpacity
              key={idx}
              className="bg-[#FFFF] h-30 items-center justify-start rounded-lg flex-row p-5 my-3 shadow-lg">
              <View className=" flex-1 flex-col mx-3">
                <Text className="font-kanit_semi_bold text-lg">
                  {val.announcement_name}
                </Text>
                <Text className="font-kanit_light">
                  {val.announcement_detail}
                </Text>
                <Text className="font-kanit_light">
                  {val.announcement_created_at}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default NotificationScreen;
