var PACKAGE_NAME = require('../package.json').name;
var path = require('path');
var escape = require('html-escape');
var gulpescape = require('../');
var should = require('should');
var path = require('path');
var assert = require('stream-assert');
var File = require('gulp-util').File;
var gulp = require('gulp');
var fs = require('fs');
require('mocha');


var indexOriginalContent = fs.readFileSync('test/files/index.html').toString();

function testfile() {
  return Array.prototype.slice.call(arguments).map(function (filename) {
    return path.join('test/files', filename);
  });
}

describe(PACKAGE_NAME, function () {
  it('should emit error on streamed file', function (done) {
    gulp.src(['./README.md'], { buffer: false })
      .pipe(gulpescape())
      .on('error', function (err) {
        err.message.should.eql('Streaming not supported');
        done();
      });
  });

  describe('file mapping', function () {
    it('should escape one file', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape())
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.contents.toString().should.match(/index\.html/); }))
        .pipe(assert.end(done));
    });
    it('should escape multiple files', function (done) {
      gulp.src(testfile('index.html', 'samba.txt.html', 'home.html'))
        .pipe(gulpescape())
        .pipe(assert.length(3))
        .pipe(assert.first(function (d) { d.contents.toString().should.match(/index\.html/); }))
        .pipe(assert.second(function (d) { d.contents.toString().should.match(/samba\.html/); }))
        .pipe(assert.end(done));
    });
  });

  describe('escape', function () {
    it('should escape html', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape())
        .pipe(assert.first(function (d) { d.contents.toString().should.eql(escape(indexOriginalContent)); }))
        .pipe(assert.end(done))
    });

    it('file arguments in prefix or suffix method', function (done) {
      gulp.src(testfile('samba.txt.html'))
        .pipe(gulpescape({
          prefix: function (file) {
            file.basename.should.eql('samba.txt');
            file.extension.should.eql('html');
            file.path.substr(__dirname.length + 1).should.eql('files');
          }
        })).pipe(assert.end(done));
    });
  });

  describe('prefix and suffix', function () {
    it('should prepend prefix as string with string in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({ prefix: '<p>no-escaped</p>' }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/^<p>no-escaped<\/p>/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend prefix as string with function in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          prefix: function (file) {
            return '<p>' + file.basename + '</p>';
          }
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/^<p>index<\/p>/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend prefix as string with number in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          prefix: 0
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/^0/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend prefix as string with boolean in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          prefix: true
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/^true/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend prefix as string with function which returns number in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          prefix: function () { return 0; }
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/^0/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend prefix as string with function which returns boolean in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          prefix: function () { return true; }
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/^true/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend suffix as string with string in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({ suffix: '<p>no-escaped</p>' }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/<p>no-escaped<\/p>$/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend suffix as string with function in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          suffix: function (file) {
            return '<p>' + file.basename + '</p>';
          }
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/<p>index<\/p>$/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend suffix as string with number in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          suffix: 0
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/0$/);
        }))
        .pipe(assert.end(done));
    });


    it('should prepend suffix as string with function which returns number in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          suffix: function () { return 0; }
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/0$/);
        }))
        .pipe(assert.end(done));
    });

    it('should prepend suffix as string with function which returns boolean in arguments', function (done) {
      gulp.src(testfile('index.html'))
        .pipe(gulpescape({
          suffix: function () { return true; }
        }))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.match(/true$/);
        }))
        .pipe(assert.end(done));
    });
  });
});