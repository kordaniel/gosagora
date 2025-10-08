import esbuild from 'esbuild';

const BUNDLED_FILES_EXT = '.bundle';
const OUT_DIR = 'assets/bundles/';

// Bundle CSS, once, don't watch for changes since this comes from npm package
await esbuild.build({
  entryPoints: [
    'node_modules/leaflet/dist/leaflet.css',
    'node_modules/leaflet.fullscreen/Control.FullScreen.css',
  ],
  bundle: true,
  loader: {
    '.png': 'dataurl',
    '.svg': 'base64',
  },
  outdir: OUT_DIR,
  outExtension: {
    '.css': `.css${BUNDLED_FILES_EXT}`
  },
});

// Bundle CSS, once, don't watch for changes since this comes from an outside lib
await esbuild.build({
  entryPoints: [
    'vendor/leaflet.boating/L.Control.Boating.css'
  ],
  bundle: true,
  loader: {
    '.png': 'dataurl',
    '.svg': 'base64',
  },
  outdir: `${OUT_DIR}leaflet.boating/`,
  outExtension: {
    '.css': `.css${BUNDLED_FILES_EXT}`
  },
});


let leafletCtx = await esbuild.context({
  entryPoints: [
    'src/bundles/leaflet/leaflet.ts'
  ],
  bundle: true,
  sourcemap: true,
  target: ['es2020'],
  format: 'iife',
  outdir: `${OUT_DIR}leaflet/`,
  outExtension: {
    '.js': `.js${BUNDLED_FILES_EXT}`
  },
});

let webStylesCtx = await esbuild.context({
  entryPoints: [
    'webstyles/leaflet.gosagora/leaflet.gosagora.css'
  ],
  bundle: true,
  loader: {
    '.png': 'dataurl',
    '.svg': 'base64',
  },
  outdir: `${OUT_DIR}/leaflet.gosagora/`,
  outExtension: {
    '.css': `.css${BUNDLED_FILES_EXT}`
  },
});

await leafletCtx.watch();
await webStylesCtx.watch();
console.log('esbuild is watching for changes in configured files..');

/**
 * This function must be defined after the ctx is initialized!
 */
const stopWatching = async () => {
  console.log('Shutting down esbuild..');
  await webStylesCtx.dispose();
  await leafletCtx.dispose();
  console.log('esbuild finished');
}

process.on('SIGINT', stopWatching);
process.on('SIGTERM', stopWatching);
