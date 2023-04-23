import React, {useState, useRef, useEffect, Fragment, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  Circle,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {XMarkIcon} from 'react-native-heroicons/outline';
// import {GOOGLE_MAP_KEY} from '../constants/googleMapKey';
import {locationPermission, getCurrentLocation} from '../helper/helperFunction';
import {commonImage} from '../constant/images';
import socket from '../constant/socket';
import Loader from '../components/Loader';
import AlertModalFail from '../components/AlertModalFail';
import AlertModalSuccess from '../components/AlertModalSuccess';
import BottomSheetCustom from '../components/BottomSheet';
import Axios from '../constant/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  CodeScanner,
} from 'vision-camera-code-scanner';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAP_KEY = 'AIzaSyBHBTkH9fICG5hTL1xNFkyLXaQGyZU6fek';
import {AuthContext} from '../context/AuthContext';

const CarScreen = ({navigation}) => {
  const mapRef = useRef();
  const markerRef = useRef();
  // const {getUserData} = useContext(AuthContext);

  const [state, setState] = useState({
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
    showCheckPoint: [],
    radius: 100,
  });
  const [isModalHandelFail, setModalHandelFail] = useState(false);

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
    showCheckPoint,
    radius,
  } = state;
  const updateState = data => setState(state => ({...state, ...data}));

  const toggleModalFail = () => {
    setModalHandelFail(!isModalHandelFail);
  };

  useEffect(() => {
    getLiveLocation();
    getDataCheckPoint();
    getUserData();
    updateSocketId();
    // logout();
  }, []);

  const checkOldOrderUser = id => {
    Axios.post('/mobile/user/checkOldOrderUser', {
      std_id: id,
    })
      .then(res => {
        console.log(res.data);
        let {status} = res.data;
        let {
          get_car_id,
          get_car_status,
          departure_id,
          departure_name,
          departure_location,
          destination_id,
          destination_name,
          destination_location,
        } = res.data;
        if (status) {
          setDataPickUp(state => ({
            ...state,
            orderDetail: {
              get_car_id: get_car_id,
              get_car_status: get_car_status,
              departure_id: departure_id,
              departure_name: departure_name,
              departure_location: {
                latitude: departure_location.latitude,
                longitude: departure_location.longitude,
              },
              destination_id: destination_id,
              destination_name: destination_name,
              destination_location: {
                latitude: destination_location.latitude,
                longitude: destination_location.longitude,
              },
            },
          }));
          setSheetShowDetailGetCar(true);
          updateState({
            destinationCords: {
              latitude: destination_location.latitude,
              longitude: destination_location.longitude,
            },
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const {latitude, longitude, heading} = await getCurrentLocation();
      console.log('get live location after 4 second', heading);
      animate(latitude, longitude);
      updateState({
        heading: heading,
        curLoc: {latitude, longitude},
        coordinate: new AnimatedRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      });
    }
  };

  const fetchValue = data => {
    console.log('this is data', data);
    updateState({
      destinationCords: {
        latitude: data.destinationCords.latitude,
        longitude: data.destinationCords.longitude,
      },
    });
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS == 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    // toggleShowSheetDes();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
      getDataLocationCar();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkLocationInCircle = (center, radius, location) => {
    center.cpd_lat = parseFloat(center.cpd_lat);
    location.latitude = parseFloat(location.latitude);
    location.longitude = parseFloat(location.longitude);
    center.cpd_long = parseFloat(center.cpd_long);
    const R = 6371e3; // Earth's radius in meters
    const lat1 = (center.cpd_lat * Math.PI) / 180;
    const lat2 = (location.latitude * Math.PI) / 180;
    const deltaLat = ((location.latitude - center.cpd_lat) * Math.PI) / 180;
    const deltaLon = ((location.longitude - center.cpd_long) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    // return distance <= radius;
    if (!distance <= radius) {
      setDataPickUp(state => ({
        ...state,
        userOrgin: center,
      }));
      setSheetShowDestination(true);
      // console.log('in circle');
    } else {
      console.log(distance, 'out circle', radius);
      setTextModal('คุณอยู่ห่างจากจุด CheckPoint');
      toggleModalFail();
    }
  };

  const fetchTime = (d, t) => {
    updateState({
      distance: d,
      time: t,
    });
  };

  const [showSheetDestination, setSheetShowDestination] = useState(false);
  const [showSheetDetailOrder, setSheetShowDetailOrder] = useState(false);
  const [showSheetDetailGetCar, setSheetShowDetailGetCar] = useState(false);
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [isModalChange, setModalChange] = useState(false);
  const [isModalHandelSuccess, setModalHandelSuccess] = useState(false);
  const [isModalScanQr, setModalScanQr] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [dataPickUp, setDataPickUp] = useState({
    std_id: '',
    userOrgin: {},
    destination: {},
    orderDetail: {},
  });
  const [dataCar, setDataCar] = useState([]);
  const [dataQrCode, setDataQrCode] = useState({});
  const [hasPermission, setHasPermission] = useState(false);
  const [activeCamera, setActiveCamera] = useState(true);
  const devices = useCameraDevices();
  const device = devices.back;

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

  const updateSocketId = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      Axios.post('/mobile/user/updateSocketId', {
        std_id: currentUser.std_id,
        socketId: socket.id,
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModalSuccess = () => {
    setModalHandelSuccess(!isModalHandelSuccess);
  };

  const toggleActiveCamera = () => {
    if (barcodes && barcodes.length > 0) {
      setActiveCamera(false);
      barcodes.forEach(async val => {
        if (val.rawValue != '') {
          console.log(val.rawValue);
          try {
            let data = JSON.parse(val.rawValue);
            if (data?.car_id != undefined) {
              Axios.post('/mobile/user/updateStatusGetCar', {
                car_id: data.car_id,
                std_id: dataPickUp.std_id,
              }).then(res => {
                let {status, meg, success} = res.data;
                if (status) {
                  setModalScanQr(false);
                  setTextModal(meg);
                  setTimeout(() => {
                    toggleModalSuccess();
                    checkOldOrderUser(dataPickUp.std_id);
                  }, 500);
                  setTimeout(() => {
                    success && navigation.goBack();
                  }, 1000);
                } else {
                  setModalScanQr(false);
                  setTextModal('OrCode ไม่ถูกต้อง');
                  setTimeout(() => {
                    toggleModalFail();
                  }, 500);
                }
                console.log(res.data);
              });
            } else {
              setModalScanQr(false);
              setTextModal('รูปแบบ qr ไม่ถูกต้อง');
              setTimeout(() => {
                toggleModalFail();
              }, 500);
            }
          } catch (error) {
            setModalScanQr(false);
            setTextModal('รูปแบบ qr ไม่ถูกต้อง');
            setTimeout(() => {
              toggleModalFail();
            }, 500);
            // console.log('รูปแบบ qr ไม่ถูกต้อง');
          }
        }
      });
    }
  };

  const toggleModalConfirm = () => {
    setModalConfirm(!isModalConfirm);
  };

  const toggleModalScanQr = () => {
    setModalScanQr(!isModalScanQr);
    setActiveCamera(true);
    // setDataQrCode([]);
  };

  const toggleModalChange = () => {
    setModalChange(!isModalChange);
  };

  const getDataCheckPoint = () => {
    Axios.get('/mobile/user/getCheckPoint')
      .then(res => {
        let {status, result} = res.data;
        // console.log(res.data);
        status && updateState({showCheckPoint: result});
        // console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const HandleUserDestination = val => {
    let {cpd_id, cpd_lat, cpd_long, cpd_name} = val;
    setDataPickUp(state => ({
      ...state,
      destination: val,
    }));
    setSheetShowDestination(false);
    setSheetShowDetailOrder(true);
    // console.log(val);
  };
  const getUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const currentUser = JSON.parse(savedUser);
      setDataPickUp(state => ({
        ...state,
        std_id: currentUser.std_id,
      }));
      checkOldOrderUser(currentUser.std_id);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataLocationCar = () => {
    Axios.post('/mobile/user/getLocationCar', {})
      .then(res => {
        let {status, result} = res.data;
        console.log(res.data);
        status && setDataCar(result);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const HandleSendDataPickUp = () => {
    Axios.post('/mobile/user/addDataGetCar', {dataPickUp: dataPickUp})
      .then(res => {
        let {status, meg} = res.data;
        let {
          get_car_id,
          get_car_status,
          departure_id,
          departure_name,
          departure_location,
          destination_id,
          destination_name,
          destination_location,
        } = res.data;
        if (status) {
          // socket.emit('addDataGetCar');
          setDataPickUp(state => ({
            ...state,
            orderDetail: {
              get_car_id: get_car_id,
              get_car_status: get_car_status,
              departure_id: departure_id,
              departure_name: departure_name,
              departure_location: {
                latitude: departure_location.latitude,
                longitude: departure_location.longitude,
              },
              destination_id: destination_id,
              destination_name: destination_name,
              destination_location: {
                latitude: destination_location.latitude,
                longitude: destination_location.longitude,
              },
            },
          }));
          setTextModal(meg);
          setSheetShowDetailOrder(false);
          toggleModalSuccess();
          setSheetShowDetailGetCar(true);
          updateState({
            destinationCords: {
              latitude: destination_location.latitude,
              longitude: destination_location.longitude,
            },
          });
        } else {
          setTextModal(meg);
          toggleModalFail();
        }
        // console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const cancelGetCar = () => {
    let {orderDetail} = dataPickUp;
    Axios.post('/mobile/user/cancelGetCar', {
      get_car_id: orderDetail.get_car_id,
    })
      .then(res => {
        let {status, meg} = res.data;
        if (status) {
          toggleModalConfirm();
          setTextModal(meg);
          setTimeout(() => {
            updateState({
              destinationCords: {},
              distance: 0,
              time: 0,
            });
            setDataPickUp(state => ({
              ...state,
              orderDetail: {},
            }));
            setSheetShowDetailGetCar(false);
            toggleModalSuccess();
          }, 500);
        }
        console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const changeGetCar = () => {
    toggleModalChange();
    setSheetShowDetailOrder(false);
    setDataPickUp(state => ({
      ...state,
      userOrgin: {},
      destination: {},
      orderDetail: {},
    }));
  };

  useEffect(() => {
    socket.on('get_car_emgcy', meg => {
      navigation.replace('CarEmgcyScreen', {detail: meg});
      // get_data_check_point();
    });
  }, [socket]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{flex: 1}}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            ...curLoc,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker.Animated ref={markerRef} coordinate={coordinate}>
            <Image
              source={commonImage.icCurLoc}
              style={{
                width: 40,
                height: 40,
                transform: [{rotate: `${heading}deg`}],
              }}
              resizeMode="contain"
            />
          </Marker.Animated>

          {dataCar.length > 0 &&
            dataCar.map((val, key) => {
              return (
                <Marker.Animated
                  key={key}
                  // onPress={location => {
                  //   checkLocationInCircle(val, radius, curLoc);
                  // }}
                  coordinate={{
                    latitude: val.driver_lat,
                    longitude: val.driver_long,
                  }}>
                  <Image
                    source={commonImage.busMarker}
                    style={{
                      width: 40,
                      height: 40,
                    }}
                    resizeMode="contain"
                  />
                </Marker.Animated>
              );
            })}

          {Object.keys(destinationCords).length > 0 && (
            <Marker
              coordinate={destinationCords}
              image={commonImage.icGreenMarker}
            />
          )}

          {showCheckPoint.map((val, key) => {
            return (
              <Fragment key={key}>
                <Marker
                  onPress={location => {
                    checkLocationInCircle(val, radius, curLoc);
                  }}
                  coordinate={{
                    latitude: val.cpd_lat,
                    longitude: val.cpd_long,
                  }}>
                  <Entypo name="location-pin" color="#F37234" size={40} />
                </Marker>
                <Circle
                  center={{latitude: val.cpd_lat, longitude: val.cpd_long}}
                  radius={radius}
                  fillColor="rgba(250,226,214,0.5)"
                  // strokeWidth={0}
                />
              </Fragment>
            );
          })}

          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey={GOOGLE_MAP_KEY}
              strokeWidth={4}
              strokeColor="orange"
              optimizeWaypoints={true}
              onStart={params => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`,
                );
              }}
              onReady={result => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                fetchTime(result.distance, result.duration),
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      // right: 30,
                      // bottom: 300,
                      // left: 30,
                      // top: 100,
                    },
                  });
                if (result.distance < 0.02) {
                  updateState({
                    destinationCords: {},
                    distance: 0,
                    time: 0,
                  });
                }
              }}
              onError={errorMessage => {
                // console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 120,
            right: 0,
          }}
          onPress={onCenter}>
          <Image source={commonImage.greenIndicator} />
        </TouchableOpacity>
      </View>
      {distance !== 0 && time !== 0 && (
        <View className="justify-center items-center rounded-md bg-orange_theme m-3 h-20 w-[200] absolute top-[10] left-[80]">
          <Text className="font-kanit_semi_bold text-lg text-white">
            เวลา: {time.toFixed(0)} นาที
          </Text>
          <Text className="font-kanit_semi_bold text-lg text-white">
            ระยะทาง: {distance.toFixed(0)} KM
          </Text>
        </View>
      )}
      {showSheetDestination && (
        <BottomSheetCustom>
          <View className="p-5">
            <View className="flex-row">
              <MaterialIcons name="directions" color="#1DAE46" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                จุดที่เลือก : {dataPickUp.userOrgin.cpd_name}
              </Text>
            </View>
            <Text className="text-black font-kanit_bold text-[20px] mt-3">
              เลือก CheckPoint ปลายทาง
            </Text>
            <ScrollView className="mb-10">
              {showCheckPoint.map((data, idx) => {
                return data.cpd_id !== dataPickUp.userOrgin.cpd_id ? (
                  <TouchableOpacity
                    key={idx}
                    className="flex-col justify-between"
                    onPress={() => HandleUserDestination(data)}>
                    <View className="flex-col rounded-lg p-3">
                      <View className="flex-row">
                        <MaterialIcons
                          name="directions"
                          color="#F37234"
                          size={25}
                        />
                        <Text className="text-black font-kanit_regular text-[20px] ml-1">
                          {data.cpd_name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : null;
              })}
            </ScrollView>
          </View>
        </BottomSheetCustom>
      )}
      {showSheetDetailOrder && (
        <BottomSheetCustom>
          <View className="p-5">
            <View className="flex-row">
              <MaterialIcons name="directions" color="#1DAE46" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                จุดรับ : {dataPickUp.userOrgin.cpd_name}
              </Text>
            </View>
            <View className="flex-row">
              <MaterialIcons name="directions" color="#FF0000" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                จุดส่ง : {dataPickUp.destination.cpd_name}
              </Text>
            </View>
            <View className="flex-row justify-around mt-5">
              <TouchableOpacity
                onPress={toggleModalChange}
                className="bg-red_theme rounded-lg h-[30px] w-[75px] justify-center items-center">
                <Text className="text-white font-kanit_regular text-[15px]">
                  ยกเลิก
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={HandleSendDataPickUp}
                className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                <Text className="text-white font-kanit_regular text-[15px]">
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetCustom>
      )}
      {showSheetDetailGetCar ? (
        <BottomSheetCustom>
          <View className="p-5">
            <View className="flex-row">
              <MaterialIcons name="directions" color="#1DAE46" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                จุดรับ : {dataPickUp.orderDetail.departure_name}
              </Text>
            </View>
            <View className="flex-row">
              <MaterialIcons name="directions" color="#FF0000" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                จุดส่ง : {dataPickUp.orderDetail.destination_name}
              </Text>
            </View>
            <View className="flex-row justify-center mt-2">
              {/* <MaterialIcons name="directions" color="#FF0000" size={25} /> */}
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                สถานะ :
              </Text>
              {dataPickUp.orderDetail.get_car_status == 1 && (
                <Text className="text-orange_theme font-kanit_bold text-[15px] ml-1">
                  รอรถ
                </Text>
              )}
              {dataPickUp.orderDetail.get_car_status == 2 && (
                <Text className="text-green_new font-kanit_bold text-[15px] ml-1">
                  อยู่บนรถ
                </Text>
              )}
            </View>
            <View className="flex-row justify-around mt-5">
              {dataPickUp.orderDetail.get_car_status == 1 && (
                <>
                  <TouchableOpacity
                    onPress={toggleModalConfirm}
                    className="bg-red_theme rounded-lg h-[30px] w-[75px] justify-center items-center">
                    <Text className="text-white font-kanit_regular text-[15px]">
                      ยกเลิก
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleModalScanQr}
                    className="flex-row bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                    <MaterialIcons
                      name="filter-center-focus"
                      color="#FFF"
                      size={20}
                    />
                    <Text className="text-white font-kanit_regular text-[15px] ml-1">
                      SCAN
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {dataPickUp.orderDetail.get_car_status == 2 && (
                <>
                  <TouchableOpacity
                    onPress={toggleModalScanQr}
                    className="flex-row bg-green-400 rounded-lg h-[50px] w-[75px] justify-center items-center">
                    <MaterialIcons
                      name="filter-center-focus"
                      color="#FFF"
                      size={20}
                    />
                    <Text className="text-white font-kanit_regular text-[15px] ml-1">
                      SCAN
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </BottomSheetCustom>
      ) : null}
      <Loader isLoading={isLoading} />
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
              onPress={cancelGetCar}
              className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
              <Text className="text-lg text-white font-normal font-kanit_light">
                ยืนยัน
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        className="flex-1 p-10"
        isVisible={isModalChange}
        onBackdropPress={toggleModalChange}>
        <View className="flex-col bg-white rounded-md h-[250px] justify-center items-center">
          <View className="bg-red-500 h-15 w-15 p-4 rounded-full justify-center items-center mb-3">
            <MaterialIcons
              name="notification-important"
              size={30}
              color="#FFFFFF"
            />
          </View>
          <Text className="text-lg font-normal font-kanit_light">
            เปลี่ยนจุดรับ-ส่งนี้?
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
              onPress={changeGetCar}
              className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
              <Text className="text-lg text-white font-normal font-kanit_light">
                ยืนยัน
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    </GestureHandlerRootView>
  );
};

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

export default CarScreen;
