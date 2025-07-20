export * from './core';
export * from './system';

export function urlToRestful(url: string, params: object): string {
  let newstr: string = url;
  let key: keyof object;
  for (key in params) {
    if (String(params[key]) === '') {
      return '';
    }
    newstr = newstr.replace(`{${key}}`, String(params[key]));
  }
  return newstr;
}
