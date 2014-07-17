/*
 * grunt-extract-copyright
 * https://github.com/dancrumb/grunt-extract-copyright
 *
 * Copyright (c) 2014 Dan Rumney
 * Licensed under the MIT license.
 */

'use strict';

var esprima = require('esprima'),
    _ = require('lodash'),
    fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('extract_copyright', 'Grunt Plugin to extract copyright boilerplate from JavaScript files', function() {
      var done = this.async(),
          results = {};
      this.files.forEach(function(file){
          var filepath = file.src.forEach(function(filepath) {
              var fileContents = fs.readFileSync(filepath),
                  comments = esprima.tokenize(fileContents, {comment: true}).comments;

              results[filepath] = comments;
          });
          var fileContents = "";
          _.forEach(results, function(comments, file) {
              fileContents += "/* The following copyright comes from " + file + " */\n";
              _.forEach(comments, function(comment) {
                  if(/[Cc]opyright/.test(comment.value)) {
                      if(comment.type === "Line") {
                          fileContents += "// "+ comment.value;
                      } else {
                          fileContents += "/*" + comment.value + "*/";
                      }
                      fileContents += "\n";
                  }
              });
              fileContents += "\n";
          });
          grunt.file.write(file.dest, fileContents);

      });

      done();
  });

};
