import {
  View,
  Text,
  Button,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Carousel from 'react-native-reanimated-carousel';
import {useRoute} from '@react-navigation/native';
import Axios from '../constant/Axios';
import {commonImage} from '../constant/images';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  CodeScanner,
} from 'vision-camera-code-scanner';
import Modal from 'react-native-modal';
import moment from 'moment/min/moment-with-locales';
import AlertModalFail from '../components/AlertModalFail';
import AlertModalSuccess from '../components/AlertModalSuccess';

moment.locale('th');
const {width, height} = Dimensions.get('window');

const SearchRoomScreen = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [dataBookingList, setDataBookingList] = useState([]);
  const [bookingSelect, setBookingSelect] = useState();

  const route = useRoute();
  const {location} = route.params;

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setDatePicker(false);
  };

  const onChangeStartTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartTime(currentDate);
    setTimePicker(false);
  };

  const onChangeEndTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndTime(currentDate);
  };

  const handleNavigate = () => {
    // console.log(date, startTime, endTime);
    navigation.navigate('RoomListScreen', {
      cpr_id: location.cpr_id,
      date: date,
      startTime: startTime,
      endTime: endTime,
    });
  };

  const getDataBookingList = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/getDataBookingList', {
        std_id: currentUser.std_id,
      })
        .then(res => {
          let {status, result} = res.data;
          status ? setDataBookingList(result) : null;
          // console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataBookingList();
  }, []);

  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalHandelFail, setModalHandelFail] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [isModalScanQr, setModalScanQr] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [activeCamera, setActiveCamera] = useState(true);
  const devices = useCameraDevices();
  const device = devices.back;

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
    let {booking_rtt_id} = data;
    setBookingSelect(booking_rtt_id);
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
            let data = JSON.parse(val.rawValue);
            // console.log('select', bookingSelect);
            if (data.booking_rtt_id == bookingSelect) {
              Axios.post('/mobile/user/updateStatusBookingRoom', {
                booking_rtt_id: data.booking_rtt_id,
                booking_status: data.booking_status,
              })
                .then(res => {
                  let {status, meg} = res.data;
                  if (status) {
                    setModalScanQr(false);
                    setTextModal(meg);
                    setTimeout(() => {
                      toggleModalSuccess();
                    }, 500);
                    getDataBookingList();
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

  const handleCancelBooking = () => {
    Axios.post('/mobile/user/cancelBookingRoom', {
      booking_rtt_id: bookingSelect,
    })
      .then(res => {
        let {status, meg} = res.data;
        if (status) {
          toggleModalConfirm();
          setTextModal(meg);
          setTimeout(() => {
            toggleModalSuccess();
          }, 500);
          getDataBookingList();
        } else {
          toggleModalConfirm();
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
  };

  const [datePicker, setDatePicker] = useState(false);
  const [timePicker, setTimePicker] = useState(false);
  const [timePickerEnd, setTimePickerEnd] = useState(false);

  const showDatePicker = () => {
    setDatePicker(true);
  };

  const showTimePicker = () => {
    setTimePicker(true);
  };

  const showTimeEndPicker = () => {
    setTimePickerEnd(true);
  };

  // function showTimePicker() {
  //   setTimePicker(true);
  // }

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <ScrollView>
        <View className="flex-colmn bg-white rounded-t-lg rounded-lg mt-5 justify-center p-5">
          <View className="justify-center items-center">
            <Text className="text-black text-[15px] font-kanit_bold">
              {location.cpr_name}
            </Text>
            <View className="bg-orange_theme h-[3px]" />
          </View>
          <TouchableOpacity
            onPress={showDatePicker}
            className="flex-row  rounded-lg h-[65px] justify-start items-center p-2 bg-orange-50 mt-5">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              วันที่:
            </Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()}
                themeVariant="light"
                onChange={onChangeDate}
              />
            ) : (
              <>
                {datePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    minimumDate={new Date()}
                    themeVariant="light"
                    onChange={onChangeDate}
                  />
                )}
                <Text>{moment(date).format('LL')}</Text>
              </>
            )}
            {/* {Platform.OS == 'ios' && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()}
                themeVariant="light"
                onChange={onChangeDate}
              />
            )} */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTimePicker}
            className="flex-row  rounded-lg h-[65px] justify-start items-center p-2 bg-orange-50 mt-3">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              เวลาเข้า:
            </Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={startTime}
                minuteInterval={10}
                mode="time"
                is24Hour={true}
                themeVariant="light"
                onChange={onChangeStartTime}
              />
            ) : (
              <>
                {timePicker && (
                  <DateTimePicker
                    value={startTime}
                    minuteInterval={10}
                    mode="time"
                    is24Hour={true}
                    themeVariant="light"
                    onChange={onChangeStartTime}
                  />
                )}
                <Text>{moment(startTime).format('LT')}</Text>
              </>
            )}
            {/* <DateTimePicker
              value={startTime}
              minuteInterval={10}
              mode="time"
              is24Hour={true}
              themeVariant="light"
              onChange={onChangeStartTime}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showTimeEndPicker}
            className="flex-row rounded-lg h-[65px] justify-start items-center p-2 bg-orange-50 mt-3">
            <Text className="text-black text-[15px] font-kanit_semi_bold">
              เวลาออก:
            </Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={endTime}
                mode="time"
                minuteInterval={10}
                is24Hour={true}
                themeVariant="light"
                onChange={onChangeEndTime}
              />
            ) : (
              <>
                {timePickerEnd && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    minuteInterval={10}
                    is24Hour={true}
                    themeVariant="light"
                    onChange={onChangeEndTime}
                  />
                )}
                <Text>{moment(endTime).format('LT')}</Text>
              </>
            )}
            {/* <DateTimePicker
              value={endTime}
              mode="time"
              minuteInterval={10}
              is24Hour={true}
              themeVariant="light"
              onChange={onChangeEndTime}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNavigate}
            className="bg-bule_new rounded-md h-10 justify-center items-center mt-5">
            <Text className="text-white text-[15px] font-kanit_semi_bold">
              ค้นหา
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mt-5">
          <Text className="text-blac text-[20px] font-kanit_bold">
            รายการจอง
          </Text>
          <View className="bg-orange_theme h-[3px] w-[140px]" />
        </View>
        {dataBookingList.length > 0 &&
          dataBookingList.map((val, key) => {
            return (
              <View
                key={key}
                className="flex-col bg-white rounded-lg justify-center p-5 mt-5">
                <View className="flex-row">
                  <View className="flex-row justify-center items-center m-5">
                    <Image
                      className="rounded-lg"
                      style={{
                        width: width * 0.3,
                        height: height * 0.1,
                      }}
                      source={commonImage.roomSpark}
                    />
                  </View>
                  <View className="flex-col">
                    <Text className="text-orange_theme text-[20px] font-kanit_bold">
                      {val.rtt_name}
                    </Text>
                    <View className="flex-row justify-start items-center">
                      <MaterialCommunityIcons
                        name="calendar-month"
                        color="#000000"
                        size={18}
                      />
                      <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                        {moment(val.booking_date).format('LL')}
                      </Text>
                    </View>
                    <View className="flex-row justify-start items-center">
                      <MaterialCommunityIcons
                        name="alarm-multiple"
                        color="#000000"
                        size={18}
                      />
                      <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                        {val.booking_start_time}
                      </Text>
                    </View>
                    <View className="flex-row justify-start items-center">
                      <MaterialCommunityIcons
                        name="alarm-multiple"
                        color="#000000"
                        size={18}
                      />
                      <Text className="text-black text-[15px] font-kanit_semi_bold ml-2">
                        {val.booking_end_time}
                      </Text>
                    </View>
                    <View className="flex-row justify-start items-center">
                      {val.booking_status == 0 && (
                        <Text className="text-green_new text-[15px] font-kanit_semi_bold ml-2">
                          รอCheckIn
                        </Text>
                      )}
                      {val.booking_status == 1 && (
                        <Text className="text-red_theme text-[15px] font-kanit_semi_bold ml-2">
                          รอCheckOut
                        </Text>
                      )}
                    </View>
                    <View className="flex-row justify-around mt-2">
                      {val.booking_status == 0 && (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setBookingSelect(val.booking_rtt_id);
                              toggleModalConfirm();
                            }}
                            className="bg-red-500 rounded-lg h-[35px] w-[50px] justify-center items-center mr-5">
                            <MaterialCommunityIcons
                              name="close-box"
                              color="#FFFF"
                              size={18}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => toggleModalScanQr(val)}
                            className="bg-green-400 rounded-lg h-[35px] w-[50px] justify-center items-center">
                            <MaterialCommunityIcons
                              name="data-matrix-scan"
                              color="#FFFF"
                              size={18}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                      {val.booking_status == 1 && (
                        <>
                          <TouchableOpacity
                            onPress={() => toggleModalScanQr(val)}
                            className="bg-green-400 rounded-lg h-[35px] w-[50px] justify-center items-center">
                            <MaterialCommunityIcons
                              name="data-matrix-scan"
                              color="#FFFF"
                              size={18}
                            />
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
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
        <Modal
          className="flex-1 p-10"
          isVisible={isModalConfirm}
          onBackdropPress={toggleModalConfirm}>
          <View className="flex-col bg-white rounded-md h-[250px] justify-center items-center">
            <View className="bg-red-500 h-15 w-15 p-4 rounded-full justify-center items-center mb-3">
              <MaterialIcons
                name="notification-important"
                size={30}
                color="#FFFFFF"
              />
            </View>
            <Text className="text-lg font-normal font-kanit_light">
              ยกเลิกรายการนี้?
            </Text>
            <View className="flex-row mt-5">
              <TouchableOpacity
                onPress={toggleModalConfirm}
                className="bg-red-500 rounded-lg h-[30px] w-[75px] justify-center items-center mr-5">
                <Text className="text-lg text-white font-normal font-kanit_light">
                  ยกเลิก
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelBooking}
                className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                <Text className="text-lg text-white font-normal font-kanit_light">
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View className="bg-gray-100 h-[50px] justify-center items-center" />
    </View>
  );
};

export default SearchRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  // inpuStyle: {
  //   backgroundColor: 'white',
  //   borderRadius: 4,
  //   borderWidth: 1,
  //   alignItems: 'center',
  //   height: 48,
  //   justifyContent: 'center',
  //   marginTop: 16,
  // },
});
