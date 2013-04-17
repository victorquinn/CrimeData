module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    docco: {
      debug: {
        src: ['app.js', 'routes/*.js', 'models/*.js', 'api/*.js', 'public/javascripts/crimedata/*.js', 'public/javascripts/crimedata/app/*.js'],
        options: {
          output: 'public/docs/'
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      uses_defaults: ['*.js'],
      all: ['Gruntfile.js', 'app.js', 'models/*.js', 'api/*.js', 'routes/*.js', 'public/javascripts/crimedata/*.js', 'public/javascripts/crimedata/app/*.js']
    },
    pkg: grunt.file.readJSON('package.json'),
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {src: 'test/*.js'}
    },
    requirejs: {
      compile: {
        options: {
          name: 'crimedata',
          out: 'public/javascripts/crimedata.js',
          baseUrl: 'assets/js',
          include: 'requireLib',
          paths: {
            'requireLib': '../../node_modules/requirejs/require',
            'jquery': 'lib/jquery-1.9.1.min',
            'backbone': 'lib/backbone-min',
            'underscore': 'lib/underscore-min',
            'd3': 'lib/d3.v3.min'
          },
          generateSourceMaps: true,
          optimize: 'uglify2',
          preserveLicenseComments: false
        }
      }
    },
    watch: {
      files: ['*.js', 'routes/*.js', 'test/*.js', 'models/*.js', 'api/*.js', 'public/javascripts/crimedata/*.js', 'public/javascripts/crimedata/app/*.js'],
      tasks: ['simplemocha', 'jshint', 'docco']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('default', ['watch']);
};