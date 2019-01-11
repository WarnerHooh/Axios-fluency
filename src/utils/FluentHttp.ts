const queryString = require('query-string');

export interface RequestOptions {
  headers?: { [key: string]: string | string[] };
  params?: { [key: string]: string | string[] };
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
  withCredentials?: boolean;
}

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
  const URI = queryString.parseUrl(url);
  const urlQuery = URI.query;

  for (const param of queryMetadata) {
    const key = param.key;
    const value = args[param.paramIndex];

    if (value instanceof Date) {
      urlQuery[key] = (<Date> value).getTime().toString();
    } else if (Array.isArray(value)) {
      urlQuery[key] = value.map((item) => item).join(',');
    } else if (typeof value === 'object') {
      for (const k in value) {
        if (value.hasOwnProperty(k) && value[k] !== undefined) {
          urlQuery[k] = value[k];
        }
      }
    } else if (!!value) {
      urlQuery[key] = value.toString();
    } else {
      urlQuery[key] = '';
    }

    urlQuery[param.key] = args[param.paramIndex];
  }

  const stringifiedQueries = queryString.stringify(urlQuery);

  return stringifiedQueries ? `${URI.url}?${stringifiedQueries}` : URI.url;
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

function brewByOptions(url: string, options: RequestOptions) {
  const URI = queryString.parseUrl(url);
  const urlQuery = URI.query;

  const params = options ? options.params || {} : {};

  Object.keys(params).forEach(key => {
    urlQuery[key] = params[key].toString();
  });

  const stringifiedQueries = queryString.stringify(urlQuery);

  return stringifiedQueries ? `${URI.url}?${stringifiedQueries}` : URI.url;
}

function methodBuilder(method: string) {
  return function (url: string) {
    return function (target: any, methodName: string, descriptor: any) {
      descriptor.value = function (...args: any) {
        let realURL = `${this.axios.defaults.baseURL || ''}${url}`;

        // RequestOptions
        const options = descriptor.requestOptions;

        // Path
        realURL = brewByPath(target, methodName, realURL, args);

        // Query
        realURL = brewByQuery(target, methodName, realURL, args);

        // Options
        realURL = brewByOptions(realURL, options);

        // Body
        const body = brewByBody(target, methodName, args);

        // Header
        const headers = brewByHeader(target, methodName, args);

        return this.axios.request({
          method,
          url: realURL,
          data: body,
          headers: {
            ...headers,
            ...(options ? options.headers : {}),
          },
          responseType: options ? options.responseType : 'json',
          withCredentials: options ? options.withCredentials : false,
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

export function RequestOptions(options: RequestOptions) {
  return function (target: any, propertyKey: string, descriptor: any) {
    options.responseType = options.responseType || 'json';
    options.withCredentials = options.withCredentials || false;

    descriptor.requestOptions = options;
    return descriptor;
  };
}

export const Headers = function (headers: { [key: string]: any }) {
  return RequestOptions({headers});
};

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
