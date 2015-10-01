/*! markdown-it-html5-embed https://github.com/cmrd-senya/markdown-it-html5-embed @license MIT */
// This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way with ![](url) syntax.
// The code is originally taken from http://talk.commonmark.org/t/embedded-audio-and-video/441/16

'use strict';

var Mimoza = require('mimoza');

function clear_tokens(tokens, idx) {
  for(var i = idx; i < tokens.length; i++) {
    switch(tokens[i].type) {
      case 'link_close':
        tokens[i].hidden = true;
        break;
      case 'text':
        tokens[i].content = '';
        break;
      default:
        throw "Unexpected token: " + tokens[i].type;
    }
  }
}

function html5_embed_renderer(tokens, idx, options, env, renderer, defaultRender) {
  var token = tokens[idx];
  var isLink;
  var title;
  var aIndex = token.attrIndex('src');
  if(aIndex < 0) {
    aIndex = token.attrIndex('href');
    isLink = true;
    title = tokens[idx+1].content;
  } else {
    title = token.attrs[token.attrIndex('alt')][1];
  }
//  console.log('aindex of idx' + idx);
//  console.log(aIndex);
  if(typeof Mimoza === "undefined") {
    Mimoza = require('mimoza');
  }
  var mimetype = Mimoza.getMimeType(token.attrs[aIndex][1]);
  var RE = /^(audio|video)\/.*/gi;
  var mimetype_matches = RE.exec(mimetype);

  if(mimetype_matches !== null &&
      (!options.html5embed.is_allowed_mime_type || options.html5embed.is_allowed_mime_type(mimetype_matches))) {
    var media_type = mimetype_matches[1];
    if(isLink) {
      clear_tokens(tokens, idx+1);
    }
    if(!title) {
      title = "untitled " + media_type;
    }
    if(typeof options.html5embed.attributes === "undefined"){
      options.html5embed.attributes = {};
    }
    if(typeof options.html5embed.attributes[media_type] === "undefined") {
      options.html5embed.attributes[media_type] = 'controls preload="metadata"';
    }
    if(options.html5embed.templateName) {
      if(typeof HandlebarsTemplates === "undefined") {
        console.log("handlebars_assets is not on the assets pipeline; fall back to the usual mode");
      } else {
        return HandlebarsTemplates[options.html5embed.templateName]({
          media_type: media_type,
          attributes: options.html5embed.attributes[media_type],
          mimetype: mimetype,
          source_url: token.attrs[aIndex][1],
          title: title,
          needs_cover: media_type==="video"
        });
      }
    }
    return ['<' + media_type +' ' + options.html5embed.attributes[media_type] + '>',
      '<source type="' + mimetype + '" src=' + token.attrs[aIndex][1] + '></source>',
      title,
      '</' + media_type + '>'
    ].join('\n');
  }else {
    return defaultRender(tokens, idx, options, env, renderer);
  }
}


module.exports = function html5_embed_plugin(md, options) {
  if(!options) {
    options = { html5embed: {
      use_image_syntax: true
    } };
  }

  if(options.html5embed.use_image_syntax) {
    var defaultRender = md.renderer.rules.image;
    md.renderer.rules.image = function(tokens, idx, opt, env, self) {
      opt.html5embed = options.html5embed;
      return html5_embed_renderer(tokens, idx, opt, env, self, defaultRender);
    }
  }

  if(options.html5embed.use_link_syntax) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
    md.renderer.rules.link_open = function(tokens, idx, opt, env, self) {
      opt.html5embed = options.html5embed;
      return html5_embed_renderer(tokens, idx, opt, env, self, defaultRender);
    };
  }
};

