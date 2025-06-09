// Learn more https://docs.expo.io/guides/customizing-metro

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(projectRoot);
defaultConfig.resolver.sourceExts.push('cjs');

defaultConfig.resolver.extraNodeModules = {
  '@common': path.resolve(workspaceRoot, 'packages/common'),
};
defaultConfig.watchFolders = [
  path.resolve(workspaceRoot, 'packages/common'),
];

module.exports = defaultConfig;
