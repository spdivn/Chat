const dev = './dev/';
const app = './app/';
const build = './build/';
const pkg = './node_modules/';

const dest = (process.env.NODE_ENV == 'prod') ? build : app;

module.exports = {
    paths: {
        dev: {
            base: dev,
            scss: [
                dev + 'scss/*.scss'
            ]
        },
        dest: {
            base: dest,
            styles: dest + 'css/'
        }
    }
}
