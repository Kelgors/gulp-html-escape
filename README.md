## Information

<table>
  <tr>
    <td>Package</td><td>gulp-html-escape</td>
  </tr>
  <tr>
    <td>Description</td><td>escape html files</td>
  </tr>
  <tr>
    <td>Node version</td><td>>= 0.10</td>
  </tr>
</table>

This plugin is designed to use the [html-replace](https://github.com/parshap/html-escape) package with [gulp](https://github.com/gulpjs/gulp).
I used it in a project for a customer and now i need it in another project so, i pushed it to npm.

## Usage

```js
var escape = require('gulp-html-escape');
var options = {
  templates: {
    source: 'src/templates/*.html',
    destination: 'dist/templates'
  }
};

gulp.task('templates:compile', function () {
  return gulp.src(options.templates.source)
    .pipe(escape({
      prefix: function (fileDescription) {
        return '<div id="' + file.basename + '-template">';
      },
      suffix: '</div>'
    })
    .pipe(gulp.dest(options.templates.destination));
});

```

this task will escape all html files in your `src/templates` folder and put in `dist/templates` folder. All files are escaped in the order that they are passed in arguments of `gulp.src` method.

## Options

- `prefix`
	Pass a string or a function that returns a string to prefix the escaped html

- `suffix`
	Pass a string or a function that returns a string to prefix the escaped html

Each method for suffix and prefix option have one argument which is a filename description, for instance with 'src/templates/index.html':

- `basename` : index
- `extension` : html
- `path` : (your path to your project folder)/src/templates

## LICENSE

(MIT License)

Copyright (c) 2015 Matthieu BOHEAS

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.