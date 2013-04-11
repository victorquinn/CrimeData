module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    docco: {
      debug: {
        src: ['app.js', 'routes/*.js', '/models/*.js'],
        options: {
          output: 'docs/'
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
      all: ['Gruntfile.js', 'app.js', 'models/*.js']
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
    watch: {
      files: ['*.js', 'routes/*.js', 'test/*.js'],
      tasks: ['simplemocha', 'jshint', 'docco']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('default', ['watch']);
};