import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertModalFail from '../components/AlertModalFail';
import AlertModalSuccess from '../components/AlertModalSuccess';
import {useRoute} from '@react-navigation/native';
import Axios from '../constant/Axios';

const {width, height} = Dimensions.get('window');

const ReportActivity = ({navigation}) => {
  const route = useRoute();
  const {dataActivity} = route.params;
  const [data, setData] = useState();
  const [previewImg, setPreview] = useState('');
  const [detail, setDetail] = useState('');
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [textModal, setTextModal] = useState('');

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const showCameraRoll = () => {
    launchImageLibrary({includeBase64: true}, res => {
      if (!res.didCancel) {
        if (res.errorCode) {
          console.log('Error:', res.errorMessage);
        } else {
          // formData.append('photo', {
          //   uri: res.assets[0].uri,
          //   type: res.assets[0].type,
          //   fileName: res.assets[0].fileName,
          // });
          // setData(formData);
          setPreview(res.assets[0].base64);
          setData(res.assets[0].base64);
          // console.log('test', res.assets[0].base64);
        }
      } else {
        console.log('cancel');
      }
    });
  };

  const handleDetail = text => {
    setDetail(text);
  };

  const handleReport = () => {
    if (!data || !detail) {
      // console.log('not');
      setTextModal('ข้อมูลไม่ครบถ้วน');
      toggleModalFail();
    } else {
      Axios.post('/mobile/user/reportActivity', {
        base64: data,
        detail: detail,
        ev_join_id: dataActivity.ev_join_id,
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
          // console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
      // console.log('yes');
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      {previewImg && (
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
              uri: `data:image/jpeg;base64,${previewImg}`,
            }}
          />
        </View>
      )}
      <ScrollView className="flex-1 p-5 bg-gray-100">
        <TouchableOpacity
          onPress={showCameraRoll}
          className="bg-green-400 rounded-lg h-[35px] justify-center items-center flex-row">
          <MaterialCommunityIcons
            name="application-edit-outline"
            color="#FFFF"
            size={18}
          />
          <Text className="text-white text-[18px] font-kanit_bold ml-2">
            อัพโหลดหลักฐาน
          </Text>
        </TouchableOpacity>
        <Text className="text-black text-[18px] font-kanit_bold mt-5">
          {/* <UserIcon color="black" size={20} /> Username */}
          รายละเอียด
        </Text>
        <TextInput
          className="bg-orange_new rounded-md h-10 my-2 px-3"
          onChangeText={handleDetail}
        />
      </ScrollView>
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
      <View className="bg-gray-100 h-[55px] justify-center">
        <TouchableOpacity
          onPress={handleReport}
          className="bg-green_new rounded-md h-10 justify-center items-center mb-10">
          <Text className="text-white text-[15px] font-kanit_semi_bold">
            รายงาน
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReportActivity;
