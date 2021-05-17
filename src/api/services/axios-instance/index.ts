import Axios from 'axios';

export * from 'axios';

const axios = Axios.create();

axios.interceptors.request.use(config => {
  config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  console.log('Axios Request: ');
  console.log(JSON.stringify(config, null, 2));

  return config;
});

axios.interceptors.response.use(
  response => {
    // console.log('response => ', response);
    return response;
  },
  err => {
    console.log('Axios request ERROR: ');
    console.log(err);
    console.log('=====================');

    const { data } = err.response;
    const message = data && data.message ? data.message : 'Unhandled server error!';

    throw new Error(`${message}`);
  }
);

export default axios;
