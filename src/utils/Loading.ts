import {RequestOptions} from './FluentHttp';

const POLLING = '_polling';

export default function (enable = true, polling = POLLING) {
  if (!enable) {
    return RequestOptions({params: {[polling]: 'true'}});
  }

  return function (target: any, method: string, descriptor: PropertyDescriptor) {
    return descriptor;
  };
};

export function ignoreLoading(request: any) {
  const regExp = new RegExp(`(\\?|&)${POLLING}=true`);
  return regExp.test(request.responseURL);
}