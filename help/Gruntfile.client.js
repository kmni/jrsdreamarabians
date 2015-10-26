module.exports = function (grunt) {
	
	require('time-grunt')(grunt);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		
		watch: {
			options: {
				spawn: false
			},
			styles: {
				//optimize: separate plugins and page styles
				files: [ "src/sass/**/*.scss" ],
				tasks: [ "sass:devel", "autoprefixer:devel", "copy:watchStyles" ]
			},
			pages: {
				files: [ "src/html/*.html" ],
				tasks: [ "newer:zetzer:devel", "newer:htmlhint:watchPages", "beeponfail", "newer:copy:watchPages" ]
			},
			pages2: {
				files: [ "src/html/components/*.html", "src/html/templates/*.html" ],
				tasks: [ "zetzer:devel", "htmlhint:watchPages", "beeponfail", "copy:watchPages" ]
			},
			images: {
				files: [ "src/img/**/*.{png,jpg,jpeg,gif}" ],
				tasks: [ "newer:copy:watchImages" ]
			},
			scripts: {
				//optimize: separate plugins, other and ready
				files: [ "src/js/**/*.js" ],
				tasks: [ "concat:jsPlugins", "concat:jsOther", "concat:jsReady", "jshint:watchScripts", "beeponfail", "concat:devel", "copy:watchScripts" ]
			}
		},
		
		sass: {
			devel: {
				files: [
					{
						".tmp/css/style.css": [
							"src/sass/plugins/reset.scss", //import reset
							"src/sass/plugins/*.scss", "!src/sass/plugins/_*.scss", //import enabled styles for plugins
							"src/sass/style.scss" //import core page styles
						]
					}
				]
			},
			production: {
				options: {
					compress: true
				},
				files: [
					{
						".tmp/css/style.min.css": [
							"src/sass/plugins/reset.scss", //import reset
							"src/sass/plugins/*.scss", "!src/sass/plugins/_*.scss", //import enabled styles for plugins
							"src/sass/style.scss" //import core page styles
						]
					}
				]
			}
		},
		
		autoprefixer: {
			devel: {
				options: {
					browsers: ["last 2 versions", "ie 8", "ie 9", "ie 10"]
				},
				files: [
					{
						".tmp/css/style.css": ".tmp/css/style.css"
					}
				]
			},
			production: {
				options: {
					browsers: ["last 2 versions", "ie 8", "ie 9", "ie 10"]
				},
				files: [
					{
						".tmp/css/style.min.css": ".tmp/css/style.min.css"
					}
				]
			}
		},
		
		zetzer: {
			options: {
				templates: "src/html/templates",
				partials: "src/html/components"
			},
			devel: {
				options: {
					dot_template_settings: {
						strip: false
					}
				},
				files: [
					{
						expand: true,
						cwd: "src/html/",
						src: [ "*.html" ],
						dest: ".tmp/html",
						//ext: ".html",
						flatten: true
					}
				]
			},
			production: {
				files: [
					{
						expand: true,
						cwd: "src/html/",
						src: [ "*.html" ],
						dest: ".tmp/html",
						ext: ".min.html",
						flatten: true
					}
				]
			}
		},
		
		concat: {
			jsPlugins: {
				files: [
					{
						".tmp/js/plugins.js": [
							"src/js/plugins/jquery.js", //jquery first
							"src/js/plugins/*.js", "!src/js/plugins/_*.js" //concate enabled script plugins
						]
					}
				]
			},
			jsOther: {
				options: {
					separator: "\n\n"
				},
				files: [
					{
						".tmp/js/other.js": [
							"src/js/other/*.js", "!src/js/other/_*.js" //concate enabled scripts
						]
					}
				]
			},
			jsReady: {
				options: {
					banner: "$(function() {\n \"use strict\";\n\n",
					footer: "\n\n});",
					separator: "\n\n"
				},
				files: [
					{
						".tmp/js/ready.js": [
							"src/js/ready/*.js", "!src/js/ready/_*.js" //concate enabled scripts
						]
					}
				]
			},
			devel: {
				files: [
					{
						".tmp/js/script.js": [
							".tmp/js/plugins.js",
							".tmp/js/other.js",
							".tmp/js/ready.js"
						]
					}
				]
			},
			production: {
				files: [
					{
						".tmp/js/script.min.js": [
							".tmp/js/plugins.js",
							".tmp/js/other.min.js",
							".tmp/js/ready.min.js"
						]
					}
				]
			},
			noplugins: {
				files: [
					{
						".tmp/js/script.noplugins.js": [
							".tmp/js/other.js",
							".tmp/js/ready.js"
						]
					}
				]
			}
		},
		
		uglify: {
			production: {
				options: {
					compress: {
						drop_console: true
					}
				},
				files: [
					{
						".tmp/js/other.min.js": [
							"src/js/other/*.js", "!src/js/other/_*.js" //uglify enabled scripts
						],
						".tmp/js/ready.min.js": [
							"src/js/ready/*.js", "!src/js/ready/_*.js" //uglify enabled scripts
						]
					}
				]
			}
		},
		
		copy: {
			devel: {
				files: [
					{ //styles and scripts
						"devel/css/style.css": ".tmp/css/style.css",
						"devel/js/script.js": ".tmp/js/script.js"
					},
					{ //templates
						expand: true,
						cwd: ".tmp/html",
						src: [ "*.html" ],
						dest: "devel",
						flatten: true
					},
					{ //images
						expand: true,
						cwd: "src/img",
						src: [ "**/*.{gif,jpg,jpeg,png}", "!**/_empty.*" ],
						dest: "devel/img",
						flatten: true
					}
				]
			},
			dist: {
				files: [
					{ //styles and scripts
						"dist/css/style.css": ".tmp/css/style.css",
						"dist/css/style.min.css": ".tmp/css/style.min.css",
						"dist/js/script.js": ".tmp/js/script.noplugins.js",
						"dist/js/script.min.js": ".tmp/js/script.min.js"
					},
					{ //templates
						expand: true,
						cwd: ".tmp/html",
						src: [ "*.html" ],
						dest: "dist",
						flatten: true
					},
					{ //images
						expand: true,
						cwd: ".tmp/img",
						src: [ "**/*.{gif,jpg,jpeg,png}", "!**/_empty.*" ],
						dest: "dist/img",
						flatten: true
					},
					{ //js plugins
						expand: true,
						cwd: "src/js/plugins",
						src: [ "*.js", "!_*.js" ],
						dest: "dist/js/libs"
					}
				]
			},
			watchPages: {
				files: [
					{
						expand: true,
						cwd: ".tmp/html",
						src: [ "*.html" ],
						dest: "devel",
						flatten: true
					}
				]
			},
			watchStyles: {
				files: [
					{
						"devel/css/style.css": ".tmp/css/style.css"
					}
				]
			},
			watchScripts: {
				files: [
					{
						"devel/js/script.js": ".tmp/js/script.js"
					}
				]
			},
			watchImages: {
				files: [
					{
						expand: true,
						cwd: "src/img",
						src: [ "**/*.{gif,jpg,jpeg,png}", "!**/_empty.*" ],
						dest: "devel/img"
					}
				]
			}
		},
		
		clean: {
			temp: ".tmp/**/*",
			devel: "devel/**/*",
			dist: "dist/**/*",
			export: "export/**/*",
			all: [ ".tmp", "export", "devel", "dist" ]
		},
		
		imagemin: {
			production: {
				files: [
					{
						expand: true,
						cwd: "src/img",
						src: [ "*.{gif,jpg,jpeg,png}" ],
						dest: ".tmp/img"
					}
				]
			}
		},
		
		jshint: {
			options: {
				//"node": true,
				"browser": true,
				//"esnext": true,
				"bitwise": true,
				//"camelcase": false,
				"camelcase": true,
				"curly": true,
				"eqeqeq": true,
				"immed": true,
				"indent": 4,
				"latedef": true,
				"newcap": true,
				"noarg": true,
				"undef": true,
				"unused": true,
				"strict": true,
				//"smarttabs": true,
				"jquery": true
			},
			scripts: {
				options: {
					//reporter: require('jshint-stylish')
				},
				files: {
					src: [
						".tmp/js/ready.js",
						".tmp/js/other.js"
					]
				}
			},
			watchScripts: {
				options: {
					//reporter: require('jshint-stylish'),
					force: true
				},
				files: {
					src: [
						".tmp/js/ready.js",
						".tmp/js/other.js"
					]
				}
			}
		},
		
		htmlhint: {
			options: {
				"tag-pair": true,
				"tagname-lowercase": true,
				"attr-lowercase": true,
				"attr-value-double-quotes": true,
				"attr-no-duplication": true,
				"doctype-first": true,
				"spec-char-escape": true,
				"id-unique": true,
				"src-not-empty": true,
				"tag-self-close": true,
				"img-alt-require": true,
				"space-tab-mixed-disabled": true
				//"head-script-disabled": true,
				//"style-disabled": true
			},
			pages: {
				files: {
					src: [
						".tmp/html/*.html"
					]
				}
			},
			watchPages: {
				options: {
					force: true
				},
				files: {
					src: [
						".tmp/html/*.html"
					]
				}
			}
		}
		
	});
	
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-zetzer");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	//grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-htmlhint');
	grunt.loadNpmTasks('grunt-beep');
	
	//default task builds devel and runs watch task
	grunt.registerTask("default", [ "devel", "watch" ]);
	
	//build devel version
	grunt.registerTask("devel", [
		"clean:temp",
		"clean:devel",
		"sass:devel",
		"autoprefixer:devel",
		"zetzer:devel",
		"htmlhint:pages",
		"concat:jsPlugins",
		"concat:jsOther",
		"concat:jsReady",
		"jshint:scripts",
		"concat:devel",
		"copy:devel",
		"beep"
	]);
	
	//build dist version
	grunt.registerTask("dist", [
		"clean:temp",
		"clean:dist",
		"sass:production",
		"sass:devel",
		"autoprefixer:production",
		"autoprefixer:devel",
		"zetzer:production",
		"zetzer:devel",
		"concat:jsPlugins",
		"concat:jsOther",
		"concat:jsReady",
		"uglify:production",
		"concat:production",
		"concat:devel",
		"concat:noplugins",
		"imagemin:production",
		"copy:dist",
		"beep"
	]);
	
	//clear all builds and retain only sources
	grunt.registerTask("clear", [
		"clean:all"
	]);
	
	
	
	//task for beep when linting found error
	//https://github.com/gruntjs/grunt-contrib-watch/issues/131
	grunt.registerTask("beeponfail", function () {
		if (grunt.fail.errorcount > 0) {
			grunt.fail.errorcount = 0; //reset the counter
			grunt.log.write("\x07"); //beep
			return false; //stops the task run
		}
		//otherwise continue the task run as normal
	});
	
};