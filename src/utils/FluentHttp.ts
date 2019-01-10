const queryString = require('query-string');

export class FluentHttp {
  constructor(protected axios: any) {
  }
}

function brewByPath(target: any, methodName: string, url: string, args: any) {
  const pathMetadata = target[`${methodName}_Path_parameters`] || [];
  for (const param of pathMetadata) {
    url = url.replace(`:${param.key}`, args[param.paramIndex]);
  }
  return url;
}

function brewByQuery(target: any, methodName: string, url: string, args: any) {
  const queryMetadata = target[`${methodName}_Query_parameters`] || [];
  const api = new URL(url);
  const urlSearchParams = api.searchParams;
  const pathname = api.pathname;

  for (const param of queryMetadata) {
    const key = param.key;
    const value = args[param.paramIndex];

    if (value instanceof Date) {
      urlSearchParams.set(key, (<Date> value).getTime().toString());
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

  return api.href;
}

function brewByBody(target: any, methodName: string, args: any) {
  let body = null;
  const bodyMetadata = target[`${methodName}_Body_parameters`];
  if (bodyMetadata) {
    body = args[bodyMetadata[0].paramIndex];
  }
  return body;
}

function brewByHeader(target: any, methodName: string, args: any) {
  const headers: { [key: string]: string } = {};
  const headerMetadata = target[`${methodName}_Header_parameters`] || [];
  for (const param of headerMetadata) {
    const key = param.key;
    const value = args[param.paramIndex];
    headers[key] = value;
  }
  return headers;
}

function methodBuilder(method: string) {
  return function (url: string) {
    return function (target: any, methodName: string, descriptor: any) {
      descriptor.value = function (...args: any) {
        let realURL = url;
        // Path
        realURL = brewByPath(target, methodName, url, args);

        // Query
        realURL = brewByQuery(target, methodName, realURL, args);

        // Body
        const body = brewByBody(target, methodName, args);

        // Header
        const headers = brewByHeader(target, methodName, args);

        return this.axios.request({
          method,
          headers,
          url: realURL,
          data: body,
        });
      };

      return descriptor;
    };
  };
}


function paramBuilder(type: string, optional = false) {
  return function (key?: string) {
    if (!optional && !type) {
      throw new Error('Param key required!');
    }
    return function (target: any, methodName: string, paramIndex: number) {
      const metadataKey = `${methodName}_${type}_parameters`;
      target[metadataKey] = [
        ...target[metadataKey] || [],
        {
          key,
          paramIndex,
        },
      ];
    };
  };
}

export const Path = paramBuilder('Path');
export const Query = paramBuilder('Query');
export const Header = paramBuilder('Header');
export const Body = paramBuilder('Body', true)();

export const GET = methodBuilder('GET');
export const POST = methodBuilder('POST');
export const PUT = methodBuilder('PUT');
export const DELETE = methodBuilder('DELETE');
export const PATCH = methodBuilder('PATCH');
export const OPTIONS = methodBuilder('OPTIONS');
