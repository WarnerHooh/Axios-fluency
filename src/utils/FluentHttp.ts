const queryString = require('query-string');

// TODO implement
export class FluentHttp {
  constructor(protected axios: any) {
  }
}

export function GET(url: string) {
  return function (target: any, methodName: string, descriptor: any) {
    descriptor.value = function(...args: any) {
      // Path
      const pathMetadata = target[`${methodName}_Path_parameters`] || []
      for (let param of pathMetadata) {
        url = url.replace(`:${param.key}`, args[param.paramIndex])
      }

      // Query
      const queryMetadata = target[`${methodName}_Query_parameters`] || []
      const api = new URL(url);
      const urlSearchParams = api.searchParams;
      const pathname = api.pathname;

      for (let param of queryMetadata) {
        const key = param.key
        const value = args[param.paramIndex]

        if (value instanceof Date) {
          urlSearchParams.set(key, (<Date>value).getTime().toString());
        } else if (Array.isArray(value)) {
          urlSearchParams.set(key, value.map((item) => item).join(','));
        } else if (typeof value === 'object') {
          for (let k in value) {
            if (value.hasOwnProperty(k) && value[k] !== undefined) {
              urlSearchParams.set(k, value[k]);
            }
          }
        } else if (!!value) {
          urlSearchParams.set(key, value.toString());
        } else {
          urlSearchParams.set(key, '');
        }

        urlSearchParams.set(`${param.key}`, args[param.paramIndex]);
      }

      return this.axios.get(api.href)
    }
    return descriptor;
  }
}

export function Path(key: string) {
  return function (target: any, methodName: string, paramIndex: number) {
    const metadataKey = `${methodName}_Path_parameters`;
    target[metadataKey] = [
      ...target[metadataKey] || [],
      {
        key,
        paramIndex
      }
    ]
  }
}

export function Query(key: string) {
  return function (target: any, methodName: string, paramIndex: number) {
    const metadataKey = `${methodName}_Query_parameters`;
    target[metadataKey] = [
      ...target[metadataKey] || [],
      {
        key,
        paramIndex
      }
    ]
  }
}