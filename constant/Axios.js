import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {Platform} from 'react-native';

// const Axios = axios.create({
//   // baseURL: `${API_URL}`,
//   baseURL: 'http://192.168.1.5:3001',
// });

const Axios = axios.create({});

if (Platform.OS == 'ios') {
  // Axios.defaults.baseURL = `${API_URL}`;
  Axios.defaults.baseURL = 'http://20.244.36.170:3001';
} else if (Platform.OS == 'android') {
  // Axios.defaults.baseURL = 'http://20.244.36.170:3001';
  Axios.defaults.baseURL = 'http://192.168.1.5:3001';
  // Axios.defaults.baseURL = 'http://172.20.10.4:3001';
}

AsyncStorage.getItem('userToken').then(val => {
  const token = val;
  // console.log('token', token);
  Axios.defaults.headers.common['x-access-token'] = token;
});

// const token = await AsyncStorage.getItem('userToken');
// Axios.defaults.headers.common['x-access-token'] = token;

export default Axios;
