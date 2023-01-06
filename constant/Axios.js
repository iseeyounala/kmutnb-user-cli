import axios from 'axios';

const Axios = axios.create({
  baseURL: 'https://some-domain.com/api/',
  headers: {'X-Custom-Header': 'foobar'},
});

export default Axios;
