import config from './config';

const logPrefix = () => `${new Date().toISOString()}:`;

const error = (...params: unknown[]) => {
  switch (config.NODE_ENV) {
    case 'test': return;
    default: console.error(logPrefix(), ...params);
  }
};

const errorAllEnvs = (...params: unknown[]) => {
  console.error(logPrefix(), ...params);
};

const info = (...params: unknown[]) => {
  switch (config.NODE_ENV) {
    case 'test': return;
    default: console.log(logPrefix(), ...params);
  };
};

const infoAllEnvs = (...params: unknown[]) => {
  console.log(logPrefix(), ...params);
};

export default {
  error,
  errorAllEnvs,
  info,
  infoAllEnvs,
};
