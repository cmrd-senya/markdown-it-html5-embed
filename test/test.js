'use strict';

var path = require('path');
var generate = require('markdown-it-testgen');

describe('markdown-it-html5-embed', function() {
  var option = { html5embed: {
    use_image_syntax: true,
    attributes: {
      'audio': 'width="320" controls class="audioplayer"',
      'video': 'width="320" height="240" class="audioplayer" controls'
    }
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

describe('markdown-it-html5-embed', function() {
  var option = { html5embed: {
    useLinkSyntax: true,
    isAllowedMimeType: function(mimetype) {
      return (mimetype[0] == 'audio/mpeg') || (mimetype[0] == 'video/ogg');
    }
  } };

  var md = require('markdown-it')().use(require('../lib'), option);
  generate(path.join(__dirname, 'fixtures/mime-filter.txt'), md);
});

describe('markdown-it-html5-embed with handlebars', function() {
  before(function (){
    var Handlebars = require("handlebars");
    global.HandlebarsTemplates = {"template": Handlebars.compile(  "<h1>{{title}}</h1><div class=\"body\"><{{media_type}} {{attributes}}><source type=\"{{mimetype}}\" src=\"{{source_url}}\"/></{{media_type}}></div>")};
  });

  var option = { html5embed: {
    useLinkSyntax: true,
    templateName: "template",
    attributes: ""
  } };

  var md = require('markdown-it')().use(require('../lib'), option);

  generate(path.join(__dirname, 'fixtures/with-handlebars.txt'), md);
});

