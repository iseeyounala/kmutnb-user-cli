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
import MapView, {Marker, AnimatedRegion, Circle} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import {XMarkIcon} from 'react-native-heroicons/outline';
// import {GOOGLE_MAP_KEY} from '../constants/googleMapKey';
import {locationPermission, getCurrentLocation} from '../helper/helperFunction';
import {commonImage} from '../constant/images';
import Loader from '../components/Loader';
import AlertModalFail from '../components/AlertModalFail';
import BottomSheetCustom from '../components/BottomSheet';
import Axios from '../constant/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // logout();
  }, []);

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
  const [isModalConfirm, setModalConfirm] = useState(false);
  const [dataPickUp, setDataPickUp] = useState({
    std_id: '',
    userOrgin: {},
    destination: {},
  });

  // const toggleShowSheetDes = () => {
  //   setSheetShowDestination(!showSheetDestination);
  // };

  const toggleModalConfirm = () => {
    setModalConfirm(!isModalConfirm);
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
      // return currentUser;
      // console.log(currentUser);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{flex: 1}}>
        <MapView
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
                  strokeWidth={0}
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
            bottom: 70,
            right: 0,
          }}
          onPress={onCenter}>
          <Image source={commonImage.greenIndicator} />
        </TouchableOpacity>
      </View>
      {distance !== 0 && time !== 0 && (
        <View className="justify-center items-center rounded-md bg-orange_theme m-3 h-20 w-[200] absolute top-[10] left-[70]">
          <Text className="font-kanit_semi_bold text-lg text-white">
            ????????????: {time.toFixed(0)} ????????????
          </Text>
          <Text className="font-kanit_semi_bold text-lg text-white">
            ?????????????????????: {distance.toFixed(0)} KM
          </Text>
        </View>
      )}
      {/* <View style={styles.bottomCard}>
        <Text className="font-kanit_semi_bold text-lg">
          ???????????????????????? Check Point
        </Text>
        <TouchableOpacity
          className="justify-center items-center bg-orange_theme h-10 rounded-md"
          onPress={onPressLocation}
          style={styles.inpuStyle}>
          <Text className="font-kanit_semi_bold text-white">
            Choose your Check Point
          </Text>
        </TouchableOpacity>
      </View> */}
      {showSheetDestination && (
        <BottomSheetCustom>
          <View className="p-5">
            <View className="flex-row">
              <MaterialIcons name="directions" color="#1DAE46" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                ????????????????????????????????? : {dataPickUp.userOrgin.cpd_name}
              </Text>
            </View>
            <Text className="text-black font-kanit_bold text-[20px] mt-3">
              ??????????????? CheckPoint ?????????????????????
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
                ?????????????????? : {dataPickUp.userOrgin.cpd_name}
              </Text>
            </View>
            <View className="flex-row">
              <MaterialIcons name="directions" color="#FF0000" size={25} />
              <Text className="text-black font-kanit_bold text-[15px] ml-1">
                ?????????????????? : {dataPickUp.destination.cpd_name}
              </Text>
            </View>
            <View className="flex-row justify-around mt-5">
              <TouchableOpacity
                onPress={toggleModalConfirm}
                className="bg-red_theme rounded-lg h-[30px] w-[75px] justify-center items-center">
                <Text className="text-white font-kanit_regular text-[15px]">
                  ??????????????????
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
                <Text className="text-white font-kanit_regular text-[15px]">
                  ??????????????????
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetCustom>
      )}
      <Loader isLoading={isLoading} />
      <AlertModalFail
        isModalHandel={isModalHandelFail}
        onBackdropPress={toggleModalFail}
        detailText="??????????????????????????????????????????????????? CheckPoint"
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
            ??????????????????????????????????????????????
          </Text>
          <View className="flex-row mt-5">
            <TouchableOpacity
              onPress={toggleModalConfirm}
              className="bg-red-500 rounded-lg h-[30px] w-[75px] justify-center items-center mr-5">
              <Text className="text-lg text-white font-normal font-kanit_light">
                ??????????????????
              </Text>
            </TouchableOpacity>
            <View className="bg-green-400 rounded-lg h-[30px] w-[75px] justify-center items-center">
              <Text className="text-lg text-white font-normal font-kanit_light">
                ??????????????????
              </Text>
            </View>
          </View>
        </View>
      </Modal>
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
