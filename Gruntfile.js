var fs = require('fs');
var path = require('path');
var sweet = require('sweet.js');

module.exports = function(grunt) {
    grunt.initConfig({
        sweet_js: {
            options: {
                modules: ['es6-macros'],
                sourceMap: true,
                nodeSourceMapSupport: true
            },
            all: {
                files: [{
                  expand: true,
                  cwd: 'src/',
                  src: ['**/*.js'],
                  dest: 'build/'
                }]
            }
        },
        watch: {
            options: {
                nospawn: true
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['sweet_js:changed']
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        // TODO: removing, renaming, etc
        if(action == 'changed' && target == 'js') {
            var dest = filepath.replace(/^src/, 'build');

            grunt.config.set('sweet_js.changed.src', [filepath]);
            grunt.config.set('sweet_js.changed.dest', dest);
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sweet.js');

    grunt.registerTask('default', ['sweet_js']);
};
