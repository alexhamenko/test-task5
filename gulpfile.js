//Подключение модуля Gulp
const gulp = require('gulp');
const concat = require('gulp-concat'); //Плагин для объединения файлов
const autoprefixer = require('gulp-autoprefixer'); //Плагин для автоматического добавления вендорных префиксов в CSS
const cleanCSS = require('gulp-clean-css'); //Плагин для минификации CSS
const uglify = require('gulp-uglify'); //Плагин для минификации JS
const del = require('del'); //Плагин для удаления файлов/папок
const browserSync = require('browser-sync').create();

//Порядок в массиве определяет порядок добавления файлов в один общий. 
const cssFiles = [
    './src/css/normalize.css',
    './src/css/main.css',
    // './src/css/media.css'
]

// const jsFiles = [
//     './src/js/lib.js',
//     './src/js/main.js'
// ]

//Таск на стили CSS
function styles() {
    //шаблон для поиска файлов CSS
    //Все файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)    //   ; - не ставится

        //Объединение файлов в один
        .pipe(concat('style.css'))

        //Добавить префиксы
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        
        //Минифицировать CSS
        .pipe(cleanCSS({
            level: 2
        }))

        //Выходная папка для стилей
        .pipe(gulp.dest('./build/css/'))

        //При изменении CSS запустить синхронизацию
        .pipe(browserSync.stream());
}

//Таск на JS скрипты
function scripts() {
    //шаблон для поиска файлов JS
    //Все файлы по шаблону './src/css/**/*.js'
    return gulp.src(jsFiles)
        //Объединение файлов в один
        .pipe(concat('script.js'))

        //Минификация JS
        .pipe(uglify({
            toplevel: true //true - для сокращения названий функций итп
        }))

        //Выходная папка для скриптов
        .pipe(gulp.dest('./build/js/'))

        //При изменении JS запустить синхронизацию
        .pipe(browserSync.stream());
}

//Удаление всего в указанной папке
function clean () {
    return del(['build/*'])
}

//Просматривать файлы
function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/css/**/*.css', styles) //Следить за CSS файлами
    gulp.watch('./src/js/**/*.js', scripts) //Следить за JS файлами
    gulp.watch("./*.html").on('change', browserSync.reload); //При изменении HTML запустить синхронизацию
}

//Вызов функции styles
gulp.task('styles', styles); //('styles', styles) -> ('произвольное название', имя выполняемой функции)
//Вызов функции scripts
gulp.task('scripts', scripts);
//Очистка папки build
gulp.task('del', clean);
//Отслеживание изменений 
gulp.task('watch', watch);
//Удаление файлов в папке build и парелельный запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
//Запуск тасков build и watch последовательно
gulp.task('dev', gulp.series('build', 'watch'));