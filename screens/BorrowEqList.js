import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, Fragment} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment/min/moment-with-locales';
import Axios from '../constant/Axios';

import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  CodeScanner,
} from 'vision-camera-code-scanner';
import Modal from 'react-native-modal';
import AlertModalFail from '../components/AlertModalFail';
import AlertModalSuccess from '../components/AlertModalSuccess';

const BorrowEqList = ({navigation}) => {
  const [data, setData] = useState([]);
  const [dataSelect, setDataSelect] = useState();
  const [dataStatusSelect, setDataStatusSelect] = useState();
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [isModalScanQr, setModalScanQr] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [activeCamera, setActiveCamera] = useState(true);
  const devices = useCameraDevices();
  const device = devices.back;

  const getDataBorrow = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/getBorrowList', {
        std_id: currentUser.std_id,
      })
        .then(res => {
          let {status, result} = res.data;
          if (status) {
            setData(result);
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

  useEffect(() => {
    getDataBorrow();
  }, []);

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const toggleModalConfirm = () => {
    setModalConfirm(!isModalConfirm);
  };

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: false,
  });

  useEffect(() => {
    toggleActiveCamera();
    // console.log(barcodes);
  }, [barcodes]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const toggleModalScanQr = data => {
    let {eq_br_id, eq_br_status} = data;
    setDataSelect(eq_br_id);
    setDataStatusSelect(eq_br_status);
    setModalScanQr(!isModalScanQr);
    setActiveCamera(true);
    // setDataQrCode([]);
  };

  const toggleActiveCamera = () => {
    if (barcodes && barcodes.length > 0) {
      setActiveCamera(false);
      barcodes.forEach(async val => {
        if (val.rawValue != '') {
          try {
            let data_scan = JSON.parse(val.rawValue);
            // console.log('select', bookingSelect);
            if (data_scan.eq_br_id == dataSelect) {
              Axios.post('/mobile/user/updateBorrow', {
                eq_br_id: data_scan.eq_br_id,
                eq_br_status: dataStatusSelect,
              })
                .then(res => {
                  let {status, meg} = res.data;
                  if (status) {
                    setModalScanQr(false);
                    setTextModal(meg);
                    setTimeout(() => {
                      toggleModalSuccess();
                    }, 500);
                    setTimeout(() => {
                      navigation.navigate('Home');
                    }, 1000);
                    getDataBorrow();
                  } else {
                    setModalScanQr(false);
                    setTextModal(meg);
                    setTimeout(() => {
                      toggleModalFail();
                    }, 500);
                  }
                  console.log(res.data);
                })
                .catch(err => {
                  console.error(err);
                });
            } else {
              setModalScanQr(false);
              setTextModal('ข้อมูลไม่ตรงกัน');
              setTimeout(() => {
                toggleModalFail();
              }, 500);
            }
            // console.log(data);
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <ScrollView>
        {data.length > 0 &&
          data.map((val, idx) => {
            return (
              <View
                key={idx}
                className="flex-col bg-white rounded-lg justify-center p-5 mt-5">
                <View className="flex-col">
                  <Text className="text-orange_theme text-[20px] font-kanit_bold">
                    {moment(val.eq_br_created_at).format('LLL')}
                  </Text>
                  <View className="flex-row justify-start items-center">
                    <MaterialCommunityIcons
                      name="archive"
                      color="#000000"
                      size={18}
                    />
                    <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                      สถานะ:
                    </Text>
                    {val.eq_br_status == 0 && (
                      <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                        รอยืม
                      </Text>
                    )}
                    {val.eq_br_status == 1 && (
                      <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                        ยืมอยู่
                      </Text>
                    )}
                    {val.eq_br_status == 2 && (
                      <Text className="text-orange_theme text-[15px] font-kanit_semi_bold ml-2">
                        คืนแล้ว
                      </Text>
                    )}
                  </View>
                  {val.list.map((val_list, key) => {
                    return (
                      <Fragment key={key}>
                        <View
                          key={key}
                          className="flex-row justify-start items-center">
                          <MaterialCommunityIcons
                            name="alarm-multiple"
                            color="#000000"
                            size={18}
                          />
                          <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                            {val_list.eq_sport_name}
                          </Text>
                          <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                            {val_list.borrow_list_amount}
                          </Text>
                        </View>
                      </Fragment>
                    );
                  })}
                  <View className="flex-row justify-around">
                    {/* <TouchableOpacity
                      // onPress={handleNavigate}
                      className="bg-red-500 rounded-md h-10 w-[50px] justify-center items-center mt-5">
                      <MaterialCommunityIcons
                        name="close-box"
                        color="#FFFF"
                        size={18}
                      />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => toggleModalScanQr(val)}
                      className="bg-green-400 rounded-md h-10 w-[50px] justify-center items-center mt-5">
                      <MaterialCommunityIcons
                        name="data-matrix-scan"
                        color="#FFFF"
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        <Modal
          className="flex-1 p-10"
          isVisible={isModalScanQr}
          onBackdropPress={toggleModalScanQr}>
          <View className="flex-col bg-white rounded-md h-[250px] justify-center items-center">
            {device != null && hasPermission && (
              <>
                <Camera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={activeCamera}
                  frameProcessor={frameProcessor}
                  frameProcessorFps={5}
                />
                {barcodes.map((barcode, idx) => (
                  <Text key={idx}>{barcode.displayValue}</Text>
                ))}
              </>
            )}
          </View>
        </Modal>
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
      <View className="bg-gray-100 h-[50px] justify-center items-center" />
    </View>
  );
};

export default BorrowEqList;
