export default function loading(enable: boolean = true) {
  return function (target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('target: ', target);
    console.log('name: ', name);
    console.log('descriptor: ', descriptor);

    return descriptor;
  };
}

export function appendPolling(url = '') {
  const [path, queries = ''] = url.split('?');
  const params = queries.split('&');
  const queriesWithPolling = params.concat('polling=true')
    .filter(item => item.length > 0)
    .join('&');

  return `${path}?${queriesWithPolling}`;
}

export function ignoreLoading(request: any) {
  return /(\?|&)polling=true/.test(request.responseURL);
}