/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-jasmine-runner');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '// Backbone.Picky, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' + 
        '// Distributed under MIT license\n' + 
        '// http://github.com/derickbailey/backbone.picky'
    },

    lint: {
      files: ['src/backbone.picky.js']
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/backbone.picky.js'],
        dest: 'lib/backbone.picky.js'
      },
      amd: {
        src: ['<banner:meta.banner>', 'src/amd.js'],
        dest: 'lib/amd/backbone.picky.js'
      }
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:rig.build.dest>'],
        dest: 'lib/backbone.picky.min.js'
      },
      amd: {
        src: ['<banner:meta.banner>', '<config:rig.amd.dest>'],
        dest: 'lib/amd/backbone.picky.min.js'
      }
    },

    jasmine: {
      src: [
        'public/javascripts/underscore.js',
        'public/javascripts/backbone.js',
        'src/backbone.picky.js'
      ],
      helpers: 'spec/javascripts/helpers/*.js',
      specs: 'spec/javascripts/**/*.spec.js'
    },

    'jasmine-server': {
      browser: false
    },

    jshint: {
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
        browser: true
      },
      globals: {
        jQuery: true,
        Backbone: true,
        _: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint rig min');

};
