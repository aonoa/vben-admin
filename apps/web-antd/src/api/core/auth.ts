import { requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    userId: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
    accessToken: string;
    refreshToken: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth-api/v1/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return requestClient.post<AuthApi.RefreshTokenResult>(
    '/auth-api/v1/refresh',
    {
      withCredentials: true,
    },
    {
      headers: {
        'X-Action': 'refreshToken',
      },
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/auth-api/v1/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth-api/v1/access-codes');
}
