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
        src: ['src/index.js'],
        dest: 'dist/js/index.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  
  grunt.registerTask('default', [
    'browserify',
    'less'
  ]);
  
};