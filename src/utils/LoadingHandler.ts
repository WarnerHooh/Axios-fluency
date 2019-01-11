import {AxiosRequestConfig, AxiosResponse} from 'axios';
import {ignoreLoading} from '@/utils/Loading';
import {Loading} from 'element-ui';

let loadingInstance: any = null;
let loadingCounter: number = 0;

export function loadingFlux(config: AxiosRequestConfig) {
  if (!ignoreLoading(config.url || '')) {
    loadingInstance = Loading.service({
      text: 'Loading...',
    });
    loadingCounter++;
  }
}

export function loadingReflux(response: AxiosResponse) {
  if (!ignoreLoading(response.request.responseURL)) {
    loadingCounter--;
  }

  if (loadingCounter === 0 && loadingInstance) {
    loadingInstance.close();
  }
}