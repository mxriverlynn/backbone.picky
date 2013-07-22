/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      version: '<%= pkg.version %>',
      banner: '// Backbone.Picky, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/derickbailey/backbone.picky\n' +
        '\n'
    },

    preprocess: {
      // Currently works as a copy
      build: {
        files: {
          'lib/backbone.picky.js' : 'src/backbone.picky.js'
        }
      },
      amd: {
        files: {
          'lib/amd/backbone.picky.js' : 'src/amd.js'
        }
      }
    },

    concat: {
      options: {
        banner: "<%= meta.banner %>"
      },
      build: {
        src: 'lib/backbone.picky.js',
        dest: 'lib/backbone.picky.js'
      },
      amd_banner: {
        src: 'lib/amd/backbone.picky.js',
        dest: 'lib/amd/backbone.picky.js'
      }
    },

    uglify : {
      options: {
        banner: "<%= meta.banner %>"
      },
      amd : {
        src : 'lib/amd/backbone.picky.js',
        dest : 'lib/amd/backbone.picky.min.js',
      },
      core : {
        src : 'lib/backbone.picky.js',
        dest : 'lib/backbone.picky.min.js',
        options : {
          sourceMap : 'lib/backbone.picky.map',
          sourceMappingURL : 'backbone.picky.map',
          sourceMapPrefix : 1
        }
      }
    },

    jasmine : {
      options : {
        helpers : 'spec/javascripts/helpers/*.js',
        specs : 'spec/javascripts/**/*.spec.js',
        vendor : [
          'public/javascripts/underscore.js',
          'public/javascripts/backbone.js'
        ],
      },
      coverage : {
        src : 'src/backbone.picky.js',
        options : {
          template : require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'reports/coverage.json',
            report: 'reports/coverage'
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      picky : 'src/backbone.picky.js'
    },

    plato: {
      picky : {
        src : 'src/*.js',
        dest : 'reports',
        options : {
          jshint : grunt.file.readJSON('.jshintrc')
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine', 'preprocess', 'concat', 'uglify']);

};
