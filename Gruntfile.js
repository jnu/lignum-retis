/**
 * Grunt tasks and helpers
 *
 * Copright 2014 Joe Nudell. All rights reserved.
 */

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        vars: {
            host: '54.214.244.77'
        },

        // dev tasks
        sass: {
            dist: {
                files: {
                    'src/style/css/app.css': 'src/style/sass/app.scss'
                }
            }
        },

        jshint: {
            all: ['**/*.js', '!src/js/lib/**/*.js', '!node_modules/**/*.js']
        },

        watch: {
            js: {
                files: ['**/*.js', '!src/js/lib/**/*.js', '!node_modules/**/*.js'],
                tasks: ['jshint'],
                options: {
                    interrupt: true
                }
            },

            sass: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // define custom tasks
    grunt.registerTask('default', ['sass', 'jshint']);
};
