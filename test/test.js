'use strict';

var path = require('path');
var generate = require('markdown-it-testgen');

describe('markdown-it-html5-embed', function() {
  var option = { html5embed: {
    use_image_syntax: true,
    audio_attributes: 'width="320" controls class="audioplayer"',
    video_attributes: 'width="320" height="240" class="audioplayer" controls'
  } };
  
  var md = require('markdown-it')().use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/image-syntax.txt'), md);
});

describe('markdown-it-html5-embed', function() {
  var option = { html5embed: {
    use_link_syntax: true
  } };
  
  var md = require('markdown-it')().use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/link-syntax.txt'), md);
});

