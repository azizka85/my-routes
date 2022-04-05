import { trimSlashes } from '@azizka/router';

import { LANGUAGES } from './globals';

export function getQueryParameters(
  query: {[key: string]: string}
) {
  const parameters: string[] = [];

  for(let key of Object.keys(query)) {
    if(query[key]) {
      parameters.push(`${key}=${query[key]}`);
    } else {
      parameters.push(key);
    }
  }

  return parameters.join('&');  
}

export function setQueryParameter(
  query: {[key: string]: string}, 
  parameter: string, 
  value: string
) {
  const data = {...query};

  data[parameter] = value;

  return getQueryParameters(data);
}

export function toggleQueryParameter(
  query: {[key: string]: string}, 
  parameter: string
) {
  const data = {...query};

  if(parameter in data) {
    delete data[parameter];

    return getQueryParameters(data);
  }

  return setQueryParameter(data, parameter, '1');
}

export function capitalize(input: string) {
  if(!input) {
    return input;
  }

  const chars = input.split('');

  return chars[0].toUpperCase() + chars.slice(1).join('').toLowerCase();
}

export function toCamel(input: string) {
  const parts = input.split('-');

  return parts.map(item => capitalize(item)).join('');
}

export const localeRoute = `(${Object.keys(LANGUAGES).join('|')})?`;

export function changeLangPath(url: string, lang: string) {
  url = trimSlashes(url);

  const langRoute = new RegExp(`^(${Object.keys(LANGUAGES).join('|')})`);

  const index = url.search(langRoute);

  if(index >= 0) {
    return url.replace(langRoute, lang)
  }

  return `${lang}/${url}`;
}

export function groupParamsByKey(params: URLSearchParams) {
  return [...params.entries()].reduce((acc, tuple) => {
    const [key, val] = tuple;

    if(acc.hasOwnProperty(key)) {
      if(Array.isArray(acc[key])) {
        (acc[key] as string[]).push(val);
      } else {
        acc[key] = [acc[key] as string, val];
      }
    } else {
      acc[key] = val;
    }

    return acc;
  }, {} as { 
    [key: string]: string | string[] 
  });
}
