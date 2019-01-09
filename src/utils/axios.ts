import axios, {AxiosError} from 'axios';
import {VueClass} from 'vue-class-component/lib/declarations';
import {HttpStatus} from '@/model/HttpStatus';

// Request interceptor
axios.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});


// Response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status === HttpStatus.UNAUTHORIZED) {
    console.error('401 Unauthorized');
    return new Promise(() => {
    });
  }
  return Promise.reject(error);
});

export default axios;

export function Convoy(target: VueClass<any>, name: string, descr: PropertyDescriptor) {
  const fn = descr.value;

  descr.value = function () {
    // Call with `this` instead of `target` since VUE proxy
    fn.call(this)
      .catch((error: AxiosError) => {
        const {status = HttpStatus.OK} = error.response || {};
        if (status >= HttpStatus.SERVER_ERROR) {
          console.error('Internal error!', error.response);
        } else if (status >= HttpStatus.CLIENT_REQUEST) {
          console.error('Bad request!', error.response);
        }
      });
  };
  return descr;
}
