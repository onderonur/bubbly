// This file is for absolute imports to work in production build.
// https://github.com/nestjs/nest/issues/986#issuecomment-414610484
// https://github.com/nestjs/nest/issues/986#issuecomment-503042620
const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

const { baseUrl, paths } = tsConfig.compilerOptions;
// eslint-disable-next-line no-restricted-syntax, guard-for-in
for (path in paths) {
  paths[path][0] = paths[path][0]
    .replace('server', 'dist/server')
    .replace('shared', 'dist/shared')
    .replace('.ts', '.js');
}

tsConfigPaths.register({ baseUrl, paths });
