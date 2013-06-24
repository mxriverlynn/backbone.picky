/*global module:false*/
module.exports = function(grunt) {

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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

    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      picky : [ 'src/backbone.picky.js' ]
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
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'preprocess', 'concat', 'uglify']);

};
