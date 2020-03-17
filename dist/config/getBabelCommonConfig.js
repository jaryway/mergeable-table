const resolve = moduleName => require.resolve(moduleName);

module.exports = function(modules) {
  // Setting this to false will not transform modules.
  const libraryDirectory = modules !== false ? 'lib' : 'es';
  // console.log('libraryDirectory', modules, libraryDirectory);

  const plugins = [
    [
      resolve('@babel/plugin-transform-typescript'),
      {
        isTSX: true,
      },
    ],
    // resolve('babel-plugin-inline-import-data-uri'),
    resolve('@babel/plugin-transform-member-expression-literals'),
    resolve('@babel/plugin-transform-object-assign'),
    resolve('@babel/plugin-transform-property-literals'),
    [
      resolve('@babel/plugin-transform-runtime'),
      {
        helpers: false,
      },
    ],
    resolve('@babel/plugin-transform-spread'),
    resolve('@babel/plugin-transform-template-literals'),
    resolve('@babel/plugin-proposal-export-default-from'),
    resolve('@babel/plugin-proposal-export-namespace-from'),
    resolve('@babel/plugin-proposal-object-rest-spread'),
    [
      resolve('@babel/plugin-proposal-decorators'),
      {
        legacy: true,
      },
    ],
    resolve('@babel/plugin-proposal-class-properties'),
    [resolve('babel-plugin-import'), { libraryName: 'antd', libraryDirectory, style: true }],
  ];
  return {
    presets: [
      resolve('@babel/preset-react'),
      [
        resolve('@babel/preset-env'),
        {
          modules,
          targets: {
            browsers: [
              'last 2 versions',
              'Firefox ESR',
              '> 1%',
              'ie >= 9',
              'iOS >= 8',
              'Android >= 4',
            ],
          },
        },
      ],
    ],
    plugins,
  };
};
