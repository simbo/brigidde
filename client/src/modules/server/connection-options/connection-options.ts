const hostname = location.hostname;
const port = location.port;
const ssl = location.protocol === 'https';

export const serverConnectionOptions = {
  hostname,
  port,
  ssl
};

export function getServerBaseUrl(protocol: 'http' | 'ws' = 'http'): URL {
  return new URL(`${protocol}${ssl ? 's' : ''}://${hostname}:${port}`);
}
