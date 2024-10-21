import { IncomingHttpHeaders } from 'http';

export const convertToHeadersInit = (headers: IncomingHttpHeaders): HeadersInit => {
  const headersInit = new Headers();
  
  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      headersInit.append(key, Array.isArray(value) ? value.join(', ') : value);
    }
  }
  
  return headersInit;
};