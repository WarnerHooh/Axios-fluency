import axios, {AxiosError} from 'axios';
import {Message} from 'element-ui';
import {VueClass} from 'vue-class-component/lib/declarations';
import {HttpStatus} from '@/model/HttpStatus';
import {loadingFlux, loadingReflux} from '@/utils/LoadingHandler';

axios.defaults.baseURL = 'http://localhost:8882';

// Request interceptor
axios.interceptors.request.use(function (config) {
  loadingFlux(config);
  return config;
}, function (error) {
  return Promise.reject(error);
});

// Response interceptor
axios.interceptors.response.use(function (response) {
  console.log(response.request);
  loadingReflux(response);

  return response;
}, function (error) {
  console.log(error.response);
  loadingReflux(error.response);

  if (error.response.status === HttpStatus.UNAUTHORIZED) {
    console.error('401 Unauthorized');
    Message.error('Unauthorized，please login first...');

    return new Promise(() => {
    });
  }
  return Promise.reject(error);
});

export default axios;

export function Convoy(target: VueClass<any>, name: string, descriptor: PropertyDescriptor) {
  const fn = descriptor.value;

  descriptor.value = function (...args: any) {
    // Call with `this` instead of `target` since VUE proxy
    const promise = fn.call(this, ...args);

    if (promise && 'then' in promise) {
      return promise
        .catch((error: AxiosError) => {
          const {status = HttpStatus.OK} = error.response || {};
          if (status >= HttpStatus.SERVER_ERROR) {
            console.error('Internal error!', error.response);
            Message.error('Internal error, please retry later!');
          } else if (status >= HttpStatus.CLIENT_ERROR) {
            console.error('Bad request!', error.response);
            Message.error('Bad request, please check!');
          }
        });
    }

    throw new Error('Unable to convoy the request! Did you forget return the result(Promise) of API request?');
  };
  return descriptor;
}
