import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { build } = require('./src/compiler/bundler');
const { version } = require('./package.json');

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';

await build(version, dev);

require('./dist/main');
