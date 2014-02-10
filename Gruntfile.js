/*global module:false*/
module.exports = function(grunt) {
    var sources = [
        'js/globals.js',
        'js/l10n.js',
        'js/map.js',
        'js/gamemaster.js',
        'js/game.js',
        'js/resources.js',
        'js/scenes/splash.js',
        'js/scenes/menu_hud.js',
        'js/scenes/menu.js',
        'js/scenes/play_hud.js',
        'js/scenes/play.js',
        'js/entities/gfx.js',
        'js/entities/board.js',
        'js/entities/wizards.js',
        'vendor/plugins/holwerAudio.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /**
         * Combine all sources into one big js chunk
         */
        concat: {
            dist: {
                src: sources,
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'VERSION',
                            replacement: '<%= pkg.version %>',
                            expression: false  // simple variable lookup
                        }
                    ]
                },                
                files: [
                    {expand: true, flatten: true, src: ['build/index.html'], dest: 'build/'}
                ]
            }
        },

        /**
         * Rules of how to minify & obfuscate game sources
         */
        uglify: {
            options: {
                report: 'min',
                preserveComments: false
            },
            dist: {
                files:{
                    'build/<%= pkg.name %>-<%= pkg.version %>-min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        /**
         * Specifies targets that prep. a release build
         */
        copy: {
            main: {
                files: [
                    {expand: true, src: ['assets/**'], dest: 'build/'},
                    {expand: true, src: ['css/*'], dest: 'build/'},
                    {expand: true, src: ['vendor/*'], dest: 'build/'},
                    {expand: true, src: ['favicon.ico'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['index.php'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['index.html'], dest: 'build/',  filter: 'isFile'},
                    {expand: true, src: ['package.json'], dest: 'build/',  filter: 'isFile'}
                ]
            }
        },
        /**
         * Clean-up of built/copied resources
         */
        clean: {
            dist: [
                'build/*'
            ],
            concat: [
                '<%= concat.dist.dest %>'
            ]
        },
        /**
         * JSHint config
         */
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            beforeConcat: {
                files: {
                    src: sources
                }
            }
        }
    });

    // Load JSHint task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');    

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify', 'copy', 'replace', 'clean:concat']);
    grunt.registerTask('lint', ['jshint:beforeConcat']);
};