/**
 * Custom request handler for generated API code
 * This file replaces the generated core/request.ts to integrate with the existing requestClient.
 *
 * Key differences from the generated version:
 * - Uses requestClient.instance (axios with interceptors) instead of raw axios
 * - Auth token, error handling, and token refresh are handled by requestClient interceptors
 * - IMPORTANT: requestClient.instance has response interceptors that return the body data directly
 *   (due to responseReturn: 'body' config), so we don't need to unwrap response.data again
 */
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

import axios from 'axios';

import { requestClient } from '#/api/request';

import { ApiError } from './ApiError';
import { CancelablePromise } from './CancelablePromise';

// ============ Utility Functions ============

export const isDefined = <T>(
  value: null | T | undefined,
): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isStringWithValue = (value: any): value is string => {
  return isString(value) && value !== '';
};

export const isBlob = (value: any): value is Blob => {
  return (
    typeof value === 'object' &&
    typeof value.type === 'string' &&
    typeof value.stream === 'function' &&
    typeof value.arrayBuffer === 'function' &&
    typeof value.constructor === 'function' &&
    typeof value.constructor.name === 'string' &&
    /^(Blob|File)$/.test(value.constructor.name) &&
    /^(Blob|File)$/.test(value[Symbol.toStringTag])
  );
};

export const isFormData = (value: any): value is FormData => {
  return value instanceof FormData;
};

export const isSuccess = (status: number): boolean => {
  return status >= 200 && status < 300;
};

/**
 * Check if value looks like an AxiosResponse (has status, headers, data)
 */
const isAxiosResponse = (value: any): value is AxiosResponse => {
  return (
    value &&
    typeof value === 'object' &&
    'status' in value &&
    'headers' in value &&
    'data' in value
  );
};

export const base64 = (str: string): string => {
  try {
    return btoa(str);
  } catch {
    const utf8Bytes = new TextEncoder().encode(str);
    const binary = Array.from(utf8Bytes, (byte) =>
      String.fromCodePoint(byte),
    ).join('');
    return btoa(binary);
  }
};

export const getQueryString = (params: Record<string, any>): string => {
  const qs: string[] = [];

  const append = (key: string, value: any) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  const process = (key: string, value: any) => {
    if (isDefined(value)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          process(key, v);
        });
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          process(`${key}[${k}]`, v);
        });
      } else {
        append(key, value);
      }
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    process(key, value);
  });

  if (qs.length > 0) {
    return `?${qs.join('&')}`;
  }

  return '';
};

export const getFormData = (
  options: ApiRequestOptions,
): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData();

    const process = (key: string, value: any) => {
      if (isString(value) || isBlob(value)) {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    };

    Object.entries(options.formData)
      .filter(([, value]) => isDefined(value))
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process(key, v));
        } else {
          process(key, value);
        }
      });

    return formData;
  }
  return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

export const resolve = async <T>(
  options: ApiRequestOptions,
  resolver?: Resolver<T> | T,
): Promise<T | undefined> => {
  if (typeof resolver === 'function') {
    return (resolver as Resolver<T>)(options);
  }
  return resolver;
};

export const getRequestBody = (options: ApiRequestOptions): any => {
  if (options.body) {
    return options.body;
  }
  return undefined;
};

// ============ Request Functions ============

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI;

  const path = options.url
    .replace('{api-version}', config.VERSION)
    .replaceAll(/{(.*?)}/g, (substring: string, group: string) => {
      if (Object.prototype.hasOwnProperty.call(options.path, group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });

  const url = `${config.BASE}${path}`;
  if (options.query) {
    return `${url}${getQueryString(options.query)}`;
  }
  return url;
};

const getHeaders = async (
  _config: OpenAPIConfig,
  options: ApiRequestOptions,
  formData?: FormData,
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (formData) {
    const formHeaders =
      typeof (formData as any).getHeaders === 'function'
        ? (formData as any).getHeaders()
        : {};
    Object.assign(headers, formHeaders);
  }

  // Handle body content type
  if (options.body !== undefined) {
    if (options.mediaType) {
      headers['Content-Type'] = options.mediaType;
    } else if (typeof options.body === 'string') {
      headers['Content-Type'] = 'text/plain';
    } else if (formData) {
      // FormData handles its own content type
    } else {
      headers['Content-Type'] = 'application/json';
    }
  }

  return headers;
};

const catchErrorCodes = (
  options: ApiRequestOptions,
  result: ApiResult,
): void => {
  const errors: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    ...options.errors,
  };

  const error = errors[result.status];
  if (error) {
    throw new ApiError(options, result, error);
  }

  if (!result.ok) {
    const errorStatus = result.status ?? 'unknown';
    const errorStatusText = result.statusText ?? 'unknown';
    const errorBody = (() => {
      try {
        return JSON.stringify(result.body, null, 2);
      } catch {
        return undefined;
      }
    })();

    throw new ApiError(
      options,
      result,
      `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`,
    );
  }
};

/**
 * Send request using requestClient.instance (axios with interceptors)
 * Returns the response body directly because requestClient interceptors unwrap it
 */
const sendRequest = async <T>(
  _config: OpenAPIConfig,
  options: ApiRequestOptions,
  url: string,
  body: any,
  formData: FormData | undefined,
  headers: Record<string, string>,
  onCancel: OnCancel,
): Promise<{ data: T; headers: any; status: number; statusText: string }> => {
  // Use requestClient.instance - the underlying axios instance with all interceptors
  const axiosInstance = requestClient.instance;

  const requestConfig: AxiosRequestConfig = {
    url,
    headers,
    data: body ?? formData,
    method: options.method,
    withCredentials: true,
  };

  // Set up cancellation if supported
  const CancelToken = axios.CancelToken;
  let cancelSource: any = null;
  if (CancelToken) {
    cancelSource = CancelToken.source();
    requestConfig.cancelToken = cancelSource.token;
    onCancel(() => cancelSource.cancel('The user aborted a request.'));
  }

  try {
    // The interceptors on requestClient.instance return the body directly (responseReturn: 'body')
    // So the result is not an AxiosResponse but the actual data
    const result = await axiosInstance.request<T>(requestConfig);

    // Check if interceptors already unwrapped the response
    return isAxiosResponse(result)
      ? {
        // Interceptors didn't unwrap, return standard structure
        data: result.data,
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
      }
      : {
        // Interceptors already unwrapped (responseReturn: 'body')
        // Return the data with a fake 200 status
        data: result as T,
        status: 200,
        statusText: 'OK',
        headers: {},
      };
  } catch (error) {
    const axiosError = error as AxiosError<T>;
    if (axiosError.response) {
      // Error response - this is still an AxiosResponse
      return {
        data: axiosError.response.data,
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
        headers: axiosError.response.headers,
      };
    }
    throw error;
  }
};

/**
 * Request method - modified to use requestClient.instance
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions,
): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    try {
      const url = getUrl(config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(config, options, formData);

      if (!onCancel.isCancelled) {
        const response = await sendRequest<T>(
          config,
          options,
          url,
          body,
          formData,
          headers,
          onCancel,
        );

        const result: ApiResult = {
          url,
          ok: isSuccess(response.status),
          status: response.status,
          statusText: response.statusText,
          body: response.data,
        };

        catchErrorCodes(options, result);

        resolve(result.body);
      }
    } catch (error) {
      reject(error);
    }
  });
};
