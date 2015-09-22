/*! markdown-it-html5-embed https://github.com/cmrd-senya/markdown-it-html5-embed @license MIT */!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.markdownitHTML5Embed=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way with ![](url) syntax.
// The code is originally taken from http://talk.commonmark.org/t/embedded-audio-and-video/441/16

'use strict';

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
  var audioRE = /^.*\.(ogg|mp3|m4a|wav|ogg|oga|spx|flac|amr|3ga)$/gi;
  var videoRE = /^.*\.(mp4|m4v|webm|3gp|3g2|ogv|ogm|avi)$/gi;
  var token = tokens[idx];
  var isLink;
  var aIndex = token.attrIndex('src');
  if(aIndex < 0) {
    aIndex = token.attrIndex('href');
    isLink = true;
  }
//  console.log('aindex of idx' + idx);
//  console.log(aIndex);
  var matches_audio = audioRE.exec(token.attrs[aIndex][1]);
  var matches_video = videoRE.exec(token.attrs[aIndex][1]);
//  console.log(token.attrs[aIndex][1]);
  if (matches_audio !== null) {
//    console.log('matches audio')
    if(isLink) {
      clear_tokens(tokens, idx+1);
    }
    if(typeof options.html5embed.audio_attributes === "undefined") {
      options.html5embed.audio_attributes = 'controls preload="metadata"'
    }
    return ['<audio ' + options.html5embed.audio_attributes + '>',
      '<source type="audio/' + matches_audio[1] + '" src=' + matches_audio[0] + '></source>',
      '</audio>'
    ].join('\n');
  } else if (matches_video !== null) {
//    console.log('matches video')
    if(isLink) {
      clear_tokens(tokens, idx+1);
    }
    if(typeof options.html5embed.video_attributes === "undefined") {
      options.html5embed.video_attributes = 'controls preload="metadata"'
    }
    return ['<video ' + options.html5embed.video_attributes + '>',
  '<source type="video/' + matches_video[1] + '" src=' + matches_video[0] + '></source>',
  '</video>'
].join('\n');
  }else {
//    console.log('matches img')
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

},{}]},{},[1])(1)
});

