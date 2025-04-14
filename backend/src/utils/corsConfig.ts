import os from 'os';
import type { NetworkInterfaceInfo } from 'os';
import type { CorsOptions } from 'cors';

import { CorsError } from '../errors/applicationError';
import config from './config';

const parseInterfaceAddresses = () => {
  const interfaces = os.networkInterfaces();
  if (!interfaces) {
    throw new Error('Invalid development environment configuration, unable to access network interfaces');
  }

  return Object.entries(interfaces)
    .reduce((acc: Pick<NetworkInterfaceInfo, 'family' | 'address'>[], cur) => {
      return !cur[1]
        ? acc
        : acc.concat(cur[1].map(iface => (
          { family: iface.family, address: iface.address }
        )));
    }, []);
};

const whitelist = [
  'http://localhost',
  ...parseInterfaceAddresses().map(iface => iface.family === 'IPv4'
    ? `http://${iface.address}`
    : `http://[${iface.address}]`
  )
];

const corsConfig: CorsOptions = {
  origin: config.IS_TEST_ENV ? '*' : (origin, cb) => {
    if (origin && whitelist.some(addr => origin.startsWith(addr))) {
      cb(null, true);
    } else {
      cb(new CorsError(
        'Request has been blocked by CORS policy',
        undefined,
        origin
      ));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsConfig;
