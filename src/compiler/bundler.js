const { rmSync, mkdirSync, writeFileSync } = require('fs');
const sass = require('sass');

const esbuild = require('esbuild');

async function build(version, dev) {
  rmSync(`./public/dist/${version}`, {
    recursive: true,
    force: true
  });

  const clientResult = await esbuild.build({
    entryPoints: {
      './locales/en': './src/locales/en.ts',
      './locales/ru': './src/locales/ru.ts',
      './locales/kz': './src/locales/kz.ts',
      './main': './src/client/main.ts',
      './views/layouts/main-layout': './src/client/views/layouts/main-layout.ts',
      './views/home-page': './src/client/views/pages/home-page.ts',
      './views/sign-in-page': './src/client/views/pages/sign-in-page.ts',
      './views/sign-up-page': './src/client/views/pages/sign-up-page.ts'
    },
    outdir: `./public/dist/${version}/js`,
    format: 'esm',
    target: 'esnext',
    bundle: true,
    splitting: true,
    sourcemap: dev,
    minify: !dev
  });
  
  console.log('client - ', clientResult);

  const styles = sass.compile('./src/client/styles/main.scss', {
    style: !dev ? 'compressed' : undefined,
    sourceMap: dev,
    loadPaths: ['node_modules/']
  });

  const dirPath = `./public/dist/${version}/css`;

  mkdirSync(dirPath, {
    recursive: true
  });

  writeFileSync(
    `${dirPath}/main.css`, 
    styles.css, {
      flag: 'w+'
    }
  );

  console.log('styles - compiled');

  rmSync('./dist', {
    recursive: true,
    force: true
  });

  const serverResult = await esbuild.build({
    entryPoints: [
      './src/server/main.ts'
    ],
    external: [
      'knex',
      'better-sqlite3'
    ],
    outdir: './dist',
    loader: {
      '.ejs': 'text'
    },
    format: 'cjs',
    platform: 'node',
    bundle: true,
    minify: !dev
  });

  console.log('server - ', serverResult);  
}

module.exports = {
  build
};
