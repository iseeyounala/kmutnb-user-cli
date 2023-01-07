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
  Axios.defaults.baseURL = `${API_URL}`;
} else if (Platform.OS == 'android') {
  Axios.defaults.baseURL = 'http://192.168.1.5:3001';
}

AsyncStorage.getItem('userToken').then(val => {
  const token = val;
  console.log(token);
  Axios.defaults.headers.common['x-access-token'] = token;
});

export default Axios;
