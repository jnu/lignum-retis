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
            build: {
                files: {
                    'build/css/app.css': 'app/sass/app.scss'
                }
            }
        },

        // jshint: {
        //     all: ['build/**/*.js', '!build/js/lib/**/*.js']
        // },

        clean: {
            build: ['build/']
        },

        copy: {
            build: {
                src: 'app/js/lib/react.js',
                dest: 'build/js/lib/react.js'
            }
        },

        shell: {
            jsx: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'jsx app/js build/js'
            }
        },

        watch: {
            js: {
                files: ['**/*.js', '!build/**/*.js', '!node_modules/**/*.js'],
                tasks: ['shell:jsx', 'copy:build'],
                options: {
                    interrupt: true
                }
            },

            sass: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        },


    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // define custom tasks
    grunt.registerTask('build', ['clean:build', 'shell:jsx', 'copy:build', 'sass:build']);
    grunt.registerTask('default', ['build']);
};
