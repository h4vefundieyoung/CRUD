import { IncomingHttpHeaders } from "http";

export function transformHeaders(headers: IncomingHttpHeaders) {
  const fetchHeaders = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        fetchHeaders.append(key, v);
      }
    } else if (value !== undefined) {
      fetchHeaders.set(key, value);
    }
  }

  return fetchHeaders;
}