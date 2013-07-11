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
        '// http://github.com/derickbailey/backbone.picky\n'
    },

    rig: {
      build: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          'lib/backbone.picky.js': ['src/backbone.picky.js']
        }
      },
      amd: {
        options: {
          banner: "<%= meta.banner %>"
        },
        files: {
          'lib/amd/backbone.picky.js': ['src/amd.js']
        }
      }
    },

    uglify: {
      options: {
        banner: "<%= meta.banner %>"
      },
      standard: {
        src: 'lib/backbone.picky.js',
        dest: 'lib/backbone.picky.min.js'
      },
      amd: {
        src: 'lib/amd/backbone.picky.js',
        dest: 'lib/amd/backbone.picky.min.js'
      }
    },

    jshint: {
      files: ['src/backbone.picky.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          "Backbone": true,
          "_": true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-rigger');

  // Default task.
  grunt.registerTask('default', ['jshint',  'rig', 'uglify']);

};
