export default function loading(arg: string) {
  // TODO
  return function (target: any, name: string, descriptor: Object) {
    console.log('target: ', target);
    console.log('name: ', name);
    console.log('descriptor: ', descriptor);

    return descriptor;
  };
}
