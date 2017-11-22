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

//конвертирование файла sass в css файл
gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
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

//перезагрузка страницы в браузере
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
    gulp.watch('app/fonts/**/*.*', browserSync.reload);   // Наблюдение за шрифтами в папке fonts
    gulp.watch('app/css/**/*.css', browserSync.reload);   // Наблюдение за css файлами в папке css
    gulp.watch('app/image/**/*.*', browserSync.reload);   // Наблюдение за изображениями в папке images
});

gulp.task('del', ['finish'], function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('finish', function() {
    return del.sync('finish'); // Удаляем папку finish перед сборкой
});

//сжатие картинок в папке image
gulp.task('img', function() {
    return gulp.src('app/image/**/*.*') // Берем все изображения из app/image
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/image')); // Выгружаем на продакшен
});

//проставляем префиксы к css3 свойствам
gulp.task('prefix', function(){
			gulp.src('app/css/style.css')
			.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
			.pipe(gulp.dest('app/css/'));
});

// Очистка файлов сайта
'use strict';
var path = {
    build: {},
    src: {},
    watch: {},
    clean: 'app/**/*.*'
};
gulp.task('app', function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

//очистка кеша и архивирование
gulp.task('end', ['zip'], function () {
    return cache.clearAll();
});

//сборка на продакшен,(все готово)
gulp.task('build', ['prefix', 'img'], function() {

    var buildCss = gulp.src('app/css/**/*') // Переносим CSS стили в продакшен
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

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
