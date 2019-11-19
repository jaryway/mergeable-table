'use strict';

const fs = require('fs');
const path = require('path');
// const assign = require('object-assign');

const getPath = (...filePath) => path.join(process.cwd(), ...filePath);

module.exports = function() {
  let my = {};
  if (fs.existsSync(getPath('tsconfig.json'))) {
    my = require(getPath('tsconfig.json'));
  }
  return Object.assign(
    {
      noUnusedParameters: true,
      noUnusedLocals: true,
      strictNullChecks: true,
      target: 'es6',
      jsx: 'preserve',
      moduleResolution: 'node',
      declaration: true,
      allowSyntheticDefaultImports: true,
    },
    my.compilerOptions
  );
};
