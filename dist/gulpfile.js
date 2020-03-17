const rimraf = require('rimraf');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const merge2 = require('merge2');
const through2 = require('through2');
const { cssInjection } = require('./config/styleUtil');
const transformLess = require('./config/transformLess');
const getBabelCommonConfig = require('./config/getBabelCommonConfig');
const tsConfig = require('./config/getTSCommonConfig')();
const tsDefaultReporter = ts.reporter.defaultReporter();

const libDir = 'lib';
const esDir = 'es';

const compile = modules => {
  rimraf.sync(modules !== false ? libDir : esDir);

  const less = gulp
    .src(['src/**/*.less'])
    .pipe(
      through2.obj(function(file, encoding, next) {
        // 将 less 文件转成 css 文件
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.less$/)) {
          transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir));

  const source = ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.d.ts'];
  if (tsConfig.allowJs) {
    source.unshift('src/**/*.jsx', 'src/**/*.js','!src/**/*.test.js');
  }
  let error = 0;
  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }

  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    })
  );
  tsResult.on('finish', check);
  tsResult.on('end', check);

  const js = tsResult.js
    .pipe(babel({ babelrc: false, ...getBabelCommonConfig(modules) }))
    .pipe(
      // 将 style 下的 index.js 文件转成 css.js
      through2.obj(function z(file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding);
          if (content.indexOf("'react-native'") !== -1) {
            // actually in antd-mobile@2.0, this case will never run,
            // since we both split style/index.mative.js style/index.js
            // but let us keep this check at here
            // in case some of our developer made a file name mistake ==
            next();
            return;
          }

          file.contents = Buffer.from(cssInjection(content));
          file.path = file.path.replace(/index\.js/, 'css.js');
          this.push(file);
          next();
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir));

  return merge2([less, js]);
};

gulp.task('compile-with-es', done => {
  console.log('[Parallel] Compile to es...');
  compile(false).on('finish', done);
});

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

gulp.task('watch', function() {
  // 实时监听
  gulp.watch('src/**/*.*', gulp.series('compile-with-es', 'compile-with-lib'));
});

gulp.task('default', gulp.series('compile-with-es', 'compile-with-lib'));
