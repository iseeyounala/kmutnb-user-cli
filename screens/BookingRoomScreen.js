import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
// import {GOOGLE_MAP_KEY} from '../constants/googleMapKey';
import {commonImage} from '../constant/images';
import MapViewDirections from 'react-native-maps-directions';
import Loader from '../components/Loader';
import {locationPermission, getCurrentLocation} from '../helper/helperFunction';
import Entypo from 'react-native-vector-icons/Entypo';
import Axios from '../constant/Axios';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAP_KEY = 'AIzaSyBHBTkH9fICG5hTL1xNFkyLXaQGyZU6fek';

const BookingRoomScreen = ({navigation}) => {
  const mapRef = useRef();
  const markerRef = useRef();

  const [state, setState] = useState({
    curLoc: {
      latitude: 14.158639482849125,
      longitude: 101.34547505706499,
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
    showMaker: [],
  });

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
    showMaker,
  } = state;
  const updateState = data => setState(state => ({...state, ...data}));

  useEffect(() => {
    getLiveLocation();
    getLocationRoom();
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

  const onPressLocation = val => {
    // console.log(val);
    navigation.replace('SearchRoomScreen', {location: val});
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
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getLocationRoom = () => {
    Axios.get('/mobile/user/getCheckPointRoom')
      .then(res => {
        let {status, result} = res.data;
        status && updateState({showMaker: result});
        // console.log(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
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

          {Object.keys(destinationCords).length > 0 && (
            <Marker
              coordinate={destinationCords}
              image={commonImage.icGreenMarker}
            />
          )}

          {showMaker.map((val, key) => {
            return (
              <Marker
                onPress={() => onPressLocation(val)}
                key={key}
                coordinate={{latitude: val.cpr_lat, longitude: val.cpr_long}}>
                <Image
                  source={commonImage.roomMarker}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}
        </MapView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
          onPress={onCenter}>
          <Image source={commonImage.greenIndicator} />
        </TouchableOpacity>
      </View>
      <Loader isLoading={isLoading} />
    </View>
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

export default BookingRoomScreen;
