import esbuild from 'esbuild';

const BUNDLED_FILES_EXT = '.bundle';
const OUT_DIR = 'assets/bundles/';

// Bundle CSS, once, don't watch for changes since this comes from npm package
await esbuild.build({
  entryPoints: [
    'node_modules/leaflet/dist/leaflet.css'
  ],
  bundle: true,
  loader: {
    '.png': 'dataurl',
  },
  outdir: OUT_DIR,
  outExtension: {
    '.css': `.css${BUNDLED_FILES_EXT}`
  },
});


let ctx = await esbuild.context({
  entryPoints: [
    'src/bundles/leaflet.ts'
  ],
  bundle: true,
  sourcemap: true,
  target: ['es2020'],
  format: 'iife',
  outdir: OUT_DIR,
  outExtension: {
    '.js': `.js${BUNDLED_FILES_EXT}`
  },
});

await ctx.watch();
console.log('esbuild is watching for changes in configured files..');

/**
 * This function must be defined after the ctx is initialized!
 */
const stopWatching = async () => {
  console.log('Shutting down esbuild..');
  await ctx.dispose();
  console.log('esbuild finished');
}

process.on('SIGINT', stopWatching);
process.on('SIGTERM', stopWatching);
