var gulp      = require('gulp'), // Подключаем Gulp
    sass        = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'); // Подключаем Browser Sync
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
    del         = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
    cache       = require('gulp-cache'); // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления 
    csso = require('gulp-csso');  //подключаем библиотаку для минификации css
    sourcemaps = require('gulp-sourcemaps');
    emailBuilder = require('gulp-email-builder'); //переменная инструмента при верстке писем
    clean = require('gulp-clean');//переменная очистки рабочих файлов
    zip = require('gulp-zip');//переменная архивирования проекта
    iconfont = require('gulp-iconfont');//переменная формирования шрифтов
    runTimestamp = Math.round(Date.now()/1000);
	htmlmin = require('gulp-htmlmin');
    stylus = require('gulp-stylus');
    nib = require('nib'); //подключаем библиотеку nib
    csscomb = require('gulp-csscomb');


//таск для библиотеки nib
/*gulp.task('nib', function () {
  gulp.src('app/stylus/style.styl')
    .pipe(plumber())
    .pipe(stylus({use:[nib()]}))
    .pipe(prefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('app/css/style.css'));
});*/

//облагородить структуру css
gulp.task('css-styles', function() {
  return gulp.src('app/css/*.css')
    .pipe(csscomb())
    .pipe(gulp.dest('app/css'));
});

//конвертирование файла .styl в css файл
gulp.task('styl', function () {
  return gulp.src('app/stylus/*.styl') // Берем источник
    .pipe(sourcemaps.init())
    .pipe(stylus({use:[nib()]}))
    .pipe(stylus()) // Преобразуем .styl в CSS
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});

//конвертирование файла sass в css файл
gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//сжимаем css файлы в папке app/css
gulp.task('css-min', function() {
    return gulp.src('app/css/*.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

//сжимаем css файлы в папке app/css и добавляем суфикс
gulp.task('css-min-s', function() {
    return gulp.src('app/css/*.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

//относится к перезагрузке страници
gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

//тоже минификация стилей
gulp.task('css', function() {
    return gulp.src('app/css/*.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

//сжатие файла JS
gulp.task('jQuery-min', function() {
    return gulp.src([ 
        'app/js/*.js', // Берем JS файл
        ])
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

//сжатие файла JS и добавляем суффикс
gulp.task('jQuery-min-s', function() {
    return gulp.src([ 
        'app/js/*.js', // Берем JS файл
        ])
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

//создание библиотеки jQuery
gulp.task('js', function() {
    return gulp.src([ // Берем все необходимые файлы
        'bower_components/jquery/dist/jquery.min.js' // Берем jQuery
        ])
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/libs')); // Выгружаем в папку app/libs
});

//сборка и сжатие библиотек bower
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'bower_components/jquery.min.js', // Берем jQuery
        'bower_components/jquery.js' // Берем Magnific Popup
        ])
        .pipe(concat('jquery.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

//перезагрузка страницы в браузере
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
        gulp.watch('app/stylus/*.styl', ['styl']); // Наблюдение за sass файлами в папке stylus
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
    gulp.watch('app/fonts/**/*.*', browserSync.reload);   // Наблюдение за шрифтами в папке fonts
    gulp.watch('app/css/**/*.css', browserSync.reload);   // Наблюдение за css файлами в папке css
    gulp.watch('app/img/**/*.*', browserSync.reload);   // Наблюдение за изображениями в папке images
});

//удаляем папку dist
gulp.task('dist', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

//удаляем папку app
gulp.task('app', function() {
    return del.sync('app'); // Удаляем папку app перед сборкой
});

//удаляем папку finish
gulp.task('finish', function() {
    return del.sync('finish'); // Удаляем папку finish перед сборкой
});

//удаляем все папки проекта
gulp.task('clean', ['finish', 'app'], function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});
//сжатие картинок в папке image
gulp.task('img', function() {
    return gulp.src('app/img/**/*.*') // Берем все изображения из app/image
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('app/image')); // Выгружаем на продакшен
});

//проставляем префиксы к css3 свойствам
gulp.task('prefix', function(){
			gulp.src('app/css/*.css')
			.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
			.pipe(gulp.dest('app/css/'));
});

//минификация html файлов
gulp.task('html-min', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app'));
});

//минификация html файлов с добавлением суфикса
gulp.task('html-min-s', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
    .pipe(gulp.dest('app'));
});

/* Очистка файлов сайта
'use strict';
var path = {
    build: {},
    src: {},
    watch: {},
    clean: 'app/css/*.*'
};
gulp.task('app', function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});
*/

//очистка кеша и архивирование
gulp.task('end', ['zip'], function () {
    return cache.clearAll();
});

//сборка на продакшен,(все готово)
gulp.task('build', ['prefix', 'img', 'js'], function() {

    var buildCss = gulp.src('app/css/**/*') // Переносим CSS стили в продакшен
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/img/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/img'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildLLibs = gulp.src('app/libs/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/libs'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);

//минифицируем css файлы и сохраняем туда же и с тем же названием
gulp.task('min-css', function () {
    return gulp.src('app/css/*.css')
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('app/css/'));
});

//таск архивирования проекта
gulp.task('zip', function() {
    gulp.src('dist/**/*')
        .pipe(zip('verstka.zip'))
        .pipe(gulp.dest('finish'))
});
