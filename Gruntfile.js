module.exports = function (grunt) {
	
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt, {
		sprite: "grunt-spritesmith",
		cmq: "grunt-combine-media-queries"
	});
	
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
				files: [ "src/*.html" ],
				tasks: [ "newer:zetzer:devel", "newer:htmlhint:watchPages", "beeponfail", "newer:copy:watchPages" ]
			},
			pages2: {
				files: [ "src/html/components/*.html", "src/html/templates/*.html" ],
				tasks: [ "zetzer:devel", "htmlhint:watchPages", "beeponfail", "copy:watchPages" ]
			},
			images: {
				files: [ "src/img/**/*.{png,jpg,jpeg,gif,svg}" ],
				tasks: [ "newer:copy:watchImages" ]
			},
			scripts: {
				//optimize: separate plugins, other and ready
				files: [ "src/js/**/*.js" ],
				tasks: [ "concat:jsPlugins", "concat:jsOther", "concat:jsReady", "jshint:watchScripts", "beeponfail", "concat:devel", "copy:watchScripts" ]
			},
			fonts: {
				files: [ "src/font/*" ],
				tasks: [ "newer:copy:watchFonts" ]
			},
			favicon: {
				files: [ "src/favicon/*" ],
				tasks: [ "newer:copy:watchFavicon" ]
			}
		},
		
		sass: {
			
			devel: {
				files: [
					{
						".tmp/css/style.css": [
                            "src/sass/core/import.scss", //import imports
							"src/sass/plugins/reset.scss", //import reset
							"src/sass/plugins/*.scss", "!src/less/plugins/_*.scss", //import enabled styles for plugins
							"src/sass/style.scss" //import core page styles
						],
						".tmp/css/print.css": [
							"src/sass/print.scss"
						]
					}
				]
			},
			production: {
				files: [
					{
						".tmp/css/style.min.css": [
                            "src/sass/core/import.scss", //import imports
							"src/sass/plugins/reset.scss", //import reset
							"src/sass/plugins/*.scss", "!src/less/plugins/_*.scss", //import enabled styles for plugins
							"src/sass/style.scss" //import core page styles
						],
						".tmp/css/print.min.css": [
							"src/sass/print.scss"
						]
					}
				]
			}
		},
		
		autoprefixer: {
			devel: {
				options: {
					browsers: ["last 2 versions", "ie 8", "ie 9", "ie 10", "ie 11"]
				},
				files: [
					{
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: ".tmp/css"
					}
				]
			},
			production: {
				options: {
					browsers: ["last 10 versions", "ie 8", "ie 9", "ie 10", "ie 11"]
				},
				files: [
					{
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: ".tmp/css"
					}
				]
			}
		},
		
		cmq: {
			options: {
				log: false
			},
			production: {
				files: {
					".tmp/css/": ".tmp/css/*.css"
				}
			}
		},
		
		cssmin: {
			options: {
				advanced: false,
				keepSpecialComments: 0,
				mediaMerging: false,
				processImport: false,
				roundingPrecision: 3,
				shorthandCompacting: false
			},
			production: {
				files: [
					{
						expand: true,
						cwd: '.tmp/css',
						src: ['*.css', '!*.min.css'],
						dest: '.tmp/css',
						ext: '.min.css'
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
					env: {
						devel: true,
						robots: false,
						lang: "<%= pkg.lang %>",
						responsive: "<%= pkg.responsive %>",
						projectName: "<%= pkg.name %>"
					},
					dot_template_settings: {
						strip: false
					}
				},
				files: [
					{
						expand: true,
						cwd: "src/",
						src: [ "*.html" ],
						dest: ".tmp/html"
					}
				]
			},
			preview: {
				options: {
					env: {
						devel: false,
						robots: false,
						lang: "<%= pkg.lang %>",
						responsive: "<%= pkg.responsive %>",
						projectName: "<%= pkg.name %>"
					},
					dot_template_settings: {
						strip: false
					}
				},
				files: [
					{
						expand: true,
						cwd: "src/",
						src: [ "*.html" ],
						dest: ".tmp/html"
					}
				]
			},
			production: {
				options: {
					env: {
						devel: false,
						robots: true,
						lang: "<%= pkg.lang %>",
						responsive: "<%= pkg.responsive %>",
						projectName: "<%= pkg.name %>"
					},
					dot_template_settings: {
						strip: false
					}
				},
				files: [
					{
						expand: true,
						cwd: "src/",
						src: [ "*.html" ],
						dest: ".tmp/html"
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
					banner: "(function() {\n \"use strict\";\n\n",
					footer: "\n\n}());",
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
				options: {
					separator: "\n\n"
				},
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
					{ //styles
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: "devel/css"
					},
					{ //scripts
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
						src: [ "**/*.{gif,jpg,jpeg,png,svg}", "!**/_empty.*" ],
						dest: "devel/img"
					},
					{ //KPtoolbar
						expand: true,
						cwd: "src/kptoolbar",
						src: [ "**/*" ],
						dest: "devel/kptoolbar"
					},
					{ //fonts
						expand: true,
						cwd: "src/font",
						src: [ "*", "!_empty" ],
						dest: "devel/css/fonts"
					},
					{ //favicon
						expand: true,
						cwd: "src/favicon",
						src: [ "*", "!_empty" ],
						dest: "devel"
					}
				]
			},
			dist: {
				files: [
					{ //styles
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: "dist/css"
					},
					{ //scripts
						"dist/js/script.js": ".tmp/js/script.noplugins.js",
						"dist/js/script.min.js": ".tmp/js/script.min.js"
					},
					{ //js plugins
						expand: true,
						cwd: "src/js/plugins",
						src: [ "*.js", "!_*.js" ],
						dest: "dist/js/libs"
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
					{ //svg
						expand: true,
						cwd: "src/img",
						src: [ "**/*.svg", "!**/_empty.*", "!sprites/**" ],
						dest: "dist/img"
					},
					{ //fonts
						expand: true,
						cwd: "src/font",
						src: [ "*", "!_empty" ],
						dest: "dist/css/fonts"
					},
					{ //favicon
						expand: true,
						cwd: "src/favicon",
						src: [ "*", "!_empty" ],
						dest: "dist"
					}
				]
			},
			exportPreview: {
				files: [
					{ //styles
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: "export/preview/css"
					},
					{ //scripts
						"export/preview/js/script.js": ".tmp/js/script.min.js"
					},
					{ //templates
						expand: true,
						cwd: ".tmp/html",
						src: [ "*.html", "<%= pkg.indexerOutput %>" ],
						dest: "export/preview",
						ext: ".html",
						flatten: true
					},
					{ //images
						expand: true,
						cwd: ".tmp/img",
						src: [ "**/*.{gif,jpg,jpeg,png}", "!**/_empty.*" ],
						dest: "export/preview/img"
					},
					{ //svg
						expand: true,
						cwd: "src/img",
						src: [ "**/*.svg", "!**/_empty.*", "!sprites/**" ],
						dest: "export/preview/img"
					},
					{ //fonts
						expand: true,
						cwd: "src/font",
						src: [ "*", "!_empty" ],
						dest: "export/preview/css/fonts"
					},
					{ //robots
						"export/preview/robots.txt": "help/robots.txt"
					},
					{ //favicon
						expand: true,
						cwd: "src/favicon",
						src: [ "*", "!_empty" ],
						dest: "export/preview"
					}
				]
			},
			exportWork: {
				files: [
					{ //styles
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: "export/work/css"
					},
					{ //scripts
						"export/work/js/script.js": ".tmp/js/script.js"
					},
					{ //templates
						expand: true,
						cwd: ".tmp/html",
						src: [ "*.html", "!*.min.html" ],
						dest: "export/work",
						ext: ".html",
						flatten: true
					},
					{ //images
						expand: true,
						cwd: ".tmp/img",
						src: [ "**/*.{gif,jpg,jpeg,png}", "!**/_empty.*" ],
						dest: "export/work/img"
					},
					{ //svg
						expand: true,
						cwd: "src/img",
						src: [ "**/*.svg", "!**/_empty.*", "!sprites/**" ],
						dest: "export/work/img"
					},
					{ //KPtoolbar
						expand: true,
						cwd: "src/kptoolbar",
						src: [ "**/*" ],
						dest: "export/work/kptoolbar"
					},
					{ //fonts
						expand: true,
						cwd: "src/font",
						src: [ "*", "!_empty" ],
						dest: "export/work/css/fonts"
					},
					{ //robots
						"export/work/robots.txt": "help/robots.txt"
					},
					{ //favicon
						expand: true,
						cwd: "src/favicon",
						src: [ "*", "!_empty" ],
						dest: "export/work"
					}
				]
			},
			exportFinal: {
				files: [
					{ //styles
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: "export/final/css"
					},
					{ //scripts
						"export/final/src/js/main.js": ".tmp/js/script.noplugins.js",
						"export/final/src/js/script.js": ".tmp/js/script.js",
						"export/final/js/script.js": ".tmp/js/script.min.js"
					},
					{ //js plugins
						expand: true,
						cwd: "src/js/plugins",
						src: [ "*.js", "!_*.js" ],
						dest: "export/final/src/js/libs"
					},
					{ //templates
						expand: true,
						cwd: ".tmp/html",
						src: [ "*.html" ],
						dest: "export/final"
					},
					{ //images
						expand: true,
						cwd: ".tmp/img",
						src: [ "**/*.{gif,jpg,jpeg,png}", "!**/_empty.*" ],
						dest: "export/final/img"
					},
					{ //svg
						expand: true,
						cwd: "src/img",
						src: [ "**/*.svg", "!**/_empty.*", "!sprites/**" ],
						dest: "export/final/img"
					},
					{ //sass
						expand: true,
						cwd: "src/sass",
						src: [ "**/*.scss" ],
						dest: "export/final/src/sass"
					},
					{ //fonts
						expand: true,
						cwd: "src/font",
						src: [ "*", "!_empty" ],
						dest: "export/final/css/fonts"
					},
					{ //favicon
						expand: true,
						cwd: "src/favicon",
						src: [ "*", "!_empty" ],
						dest: "export/final"
					}
				]
			},
			exportDevel: {
				files: [
					{
						"export/devel/package.json": "help/package.client.json",
						"export/devel/Gruntfile.js": "help/Gruntfile.client.js",
						"export/devel/.gitignore": ".gitignore"
					},
					{
						expand: true,
						cwd: "src",
						src: [ "**/*" ],
						dest: "export/devel/src"
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
						expand: true,
						cwd: ".tmp/css",
						src: [ "*.css" ],
						dest: "devel/css"
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
						src: [ "**/*.{gif,jpg,jpeg,png,svg}", "!**/_empty.*" ],
						dest: "devel/img"
					}
				]
			},
			watchFonts: {
				files: [
					{
						expand: true,
						cwd: "src/font",
						src: [ "*", "!_empty" ],
						dest: "devel/css/fonts"
					}
				]
			},
			watchFavicon: {
				files: [
					{
						expand: true,
						cwd: "src/favicon",
						src: [ "*", "!_empty" ],
						dest: "devel"
					}
				]
			}
		},
		
		clean: {
			temp: ".tmp/**/*",
			devel: "devel/**/*",
			dist: "dist/**/*",
			export: "export/**/*",
			exportPreview: [ "export/preview", "export/preview.zip" ],
			exportWork: [ "export/work" ],
			exportFinal: [ "export/final", "export/final.zip" ],
			exportDevel: [ "export/devel", "export/devel.zip" ],
			all: [ ".tmp", "export", "devel", "dist" ]
		},
		
		compress: {
			exportPreview: {
				options: {
					archive: "export/preview.zip"
				},
				files: [
					{
						expand: true,
						cwd: "export/preview",
						src: "**/*",
						dest: "./"
					}
				]
			},
			exportFinal: {
				options: {
					archive: "export/final.zip"
				},
				files: [
					{
						expand: true,
						cwd: "export/final",
						src: "**/*",
						dest: "./"
					}
				]
			},
			exportDevel: {
				options: {
					archive: "export/devel.zip"
				},
				files: [
					{
						expand: true,
						cwd: "export/devel",
						src: "**/*",
						dest: "./"
					}
				]
			}
		},
		
		imagemin: {
			production: {
				files: [
					{
						expand: true,
						cwd: "src/img",
						src: [ "**/*.{gif,jpg,jpeg,png}" ],
						dest: ".tmp/img"
					}
				]
			}
		},
		
		'ftp-deploy': {
			clientPreview: {
				auth: {
					host: 'ftp.web-pilot.cz',
					port: 21,
					authKey: 'previewupload'
				},
				src: 'export/preview',
				dest: '/<%= pkg.urlname %>.preview'
			}/*,
			workPreview: {
				auth: {
					host: 'ftp.web-pilot.cz',
					port: 21,
					authKey: 'workupload'
				},
				src: 'export/work',
				dest: '/<%= pkg.urlname %>'
			}*/
		},
		
		indexer: {
			index: {
				options: {
					title: "<%= pkg.name %>",
					template: "help/template.html",
					item: "<li><a href=\"<%= url %>\"><%= name %></a></li>"
				},
				files: [
					{
						".tmp/html/<%= pkg.indexerOutput %>": [
							".tmp/html/*.html"
						]
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
				"jquery": true,
				"devel": true,
				"globals": {
					google: true
				}
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
	
	/*
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-zetzer");
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	//grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-htmlhint');
	grunt.loadNpmTasks('grunt-beep');
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	*/
	
	//default task builds devel and runs watch task
	grunt.registerTask("default", [ "devel", "watch" ]);
	
	//build devel version
	grunt.registerTask("devel", [
		"clean:temp",
		"clean:devel",
		"sass:devel",
		"autoprefixer:devel",
		"cmq:production",
		"zetzer:devel",
		"htmlhint:pages",
		"indexer",
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
		"autoprefixer:production",
		"cmq:production",
		"cssmin:production",
		"zetzer:production",
		"indexer",
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
	
	//build preview version for client
	grunt.registerTask("exportPreview", [
		"clean:temp",
		"clean:exportPreview",
		"sass:production",
		"autoprefixer:production",
		"cmq:production",
		"cssmin:production",
		"zetzer:preview",
		"indexer",
		"concat:jsPlugins",
		"concat:jsOther",
		"concat:jsReady",
		"uglify:production",
		"concat:production",
		"imagemin:production",
		"copy:exportPreview",
		"beep"
	]);
	
	//build work version for internal review purposes
	grunt.registerTask("exportWork", [
		"clean:temp",
		"clean:exportWork",
		"sass:devel",
		"autoprefixer:devel",
		"cmq:production",
		"zetzer:devel",
		"indexer",
		"concat:jsPlugins",
		"concat:jsOther",
		"concat:jsReady",
		"concat:devel",
		"imagemin:production",
		"copy:exportWork",
		"beep"
	]);
	
	//build so-called final version for distribution
	//contains source files as well as compiled and minified ones but no grunt
	grunt.registerTask("exportFinal", [
		"clean:temp",
		"clean:exportFinal",
		"sass:production",
		"autoprefixer:production",
		"cmq:production",
		"cssmin:production",
		"zetzer:production",
		"indexer",
		"concat:jsPlugins",
		"concat:jsOther",
		"concat:jsReady",
		"uglify:production",
		"concat:production",
		"concat:devel",
		"concat:noplugins",
		"imagemin:production",
		"copy:exportFinal",
		"compress:exportFinal",
		"beep"
	]);
	
	//build so-called devel version for distribution
	//contains only source files and grunt config files
	grunt.registerTask("exportDevel", [
		"clean:exportDevel",
		"copy:exportDevel",
		"compress:exportDevel",
		"beep"
	]);
	
	//build all exports
	//probably useless task
	grunt.registerTask("export", [
		"exportPreview",
		"exportWork",
		"exportFinal",
		"exportDevel",
		"clean:temp",
		"beep:2"
	]);
	
	//clear all builds and retain only sources
	grunt.registerTask("clear", [
		"clean:all"
	]);
	
	
	
	//custom task to generate index file
	grunt.registerMultiTask("indexer", "Creates index file with links to HTML templates.", function() {
		var options = this.data.options,
			target = this.target;
		
		this.files.forEach(function (file) {
			var template = grunt.file.read(options.template),
				items = [ ],
				files = [ ];
			
			file.src
				.filter(function(filepath) {
					//remove nonexistent files and exclude dest file
					return grunt.file.exists(filepath) && filepath !== file.dest;
				})
				.map(function(filepath) {
					var url = filepath.match(/([^/]+)$/)[1].replace(".min", "");
					//if this file already handled
					if (files.indexOf(url) !== -1) {
						return;
					}
					
					//process item template and add it to items array
					items.push(
						grunt.template.process(
							grunt.config.getRaw("indexer." + target + ".options.item"),
							{
								data: {
									url: url, //strip pathf and .min extension
									name: filepath.match(/([^/]*?)(\.min)?\.[a-zA-Z0-9]+$/)[1] //get only filename without extension
								}
							}
						)
					);
					
					//remember handled file
					files.push(url);
				});
			
			grunt.file.write(file.dest, grunt.template.process(template, {
				data: {
					list: items.join(grunt.util.linefeed),
					title: options.title
				}
			}));
		});
		
		grunt.log.writeln("Index succesfully created.");
	});
	
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