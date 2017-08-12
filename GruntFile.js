module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          expand: true
        },
        files: {
          'dist/css/style.css': 'style/style.less'
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: ['glslify']
      },
      dev: {
        src: ['viewer/viewer.js'],
        dest: 'dist/js/index.js'
      }
    },
    watch: {
      scripts: {
        files: ['viewer/*.js'],
        tasks: ['browserify'],
        options: { spawn: false }
      },
      styles: {
        files: ['style/*.less'],
        tasks: ['less'],
        options: { spawn: false }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'browserify',
    'less',
    'watch'
  ]);

};
