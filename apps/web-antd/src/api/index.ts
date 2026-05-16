export * from './core';
export * from './system';

export function urlToRestful(
  url: string,
  params: Record<string, number | string>,
): string {
  let newstr: string = url;
  for (const key in params) {
    if (String(params[key]) === '') {
      return '';
    }
    newstr = newstr.replace(`{${key}}`, String(params[key]));
  }
  return newstr;
}
