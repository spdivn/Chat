const configs               = require('./gulpconfigs.js');
const gulp                  = require('gulp');
const fs                    = require('fs');
const path                  = require('path');
const chalk                 = require('chalk');

const stylesTask            = require('./tasks/styles');

gulp.task('styles',
    stylesTask.compileScss
);

let tasksRunning = false;

gulp.task('default', () => {

    console.log('\x1Bc');
    console.log(chalk.bold('Watching files in ' + configs.paths.dev.base + ' folder'));

    let tasks = [];
    let tasksDebounce = null;

    gulp.watch('dev/**', { ignoreInitial: true }).on('all', (event, location) => {
        if (event === 'addDir' || path.basename(location) === '.DS_Store') return;

        tasksRunning = true;
        const ext =  path.extname(location);

        if (['.scss'].indexOf(ext.toLowerCase()) > -1 && tasks.indexOf('sass') === -1) {
            tasks.push('styles')
        }

        if (tasksDebounce) {
            clearTimeout(tasksDebounce);
            tasksDebounce = null;
        }

        if (tasks.length) {
            console.log('\x1Bc');
            tasksDebounce = setTimeout(() => {
                gulp.task('run', gulp.series(...tasks, () => {
                    console.log(chalk.bold('\n--- \n'));
                    console.log(chalk.bold('Watching files in ' + configs.paths.dev.base + ' folder'));
                    tasks = [];
                    images = [];
                    tasksRunning = false;
                }));

                gulp.task('run')(error => {
                    console.log(chalk.red('❗️ There was an error while running the queued tasks'), error);
                    tasksRunning = false;
                });
            }, 500);
        }
    });
});
