/*! markdown-it-html5-embed https://github.com/cmrd-senya/markdown-it-html5-embed @license MIT */
// This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way.

'use strict';

var Mimoza = require('mimoza');

function clearTokens(tokens, idx) {
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

function parseToken(tokens, idx) {
  var parsed = {};
  var token = tokens[idx];

  var aIndex = token.attrIndex('src');
  parsed.isLink = aIndex < 0;
  if(parsed.isLink) {
    aIndex = token.attrIndex('href');
    parsed.title = tokens[idx+1].content;
  } else {
    parsed.title = token.content;
  }

  parsed.url = token.attrs[aIndex][1];
  parsed.mimeType = Mimoza.getMimeType(parsed.url);
  var RE = /^(audio|video)\/.*/gi;
  var mimetype_matches = RE.exec(parsed.mimeType);
  if(mimetype_matches === null) {
    parsed.mediaType = null;
  } else {
    parsed.mediaType = mimetype_matches[1];

    if(!parsed.title) {
      parsed.title = "untitled " + parsed.mediaType;
    }
  }
  return parsed;
}

function isAllowedMimeType(parsed, options) {
  return parsed.mediaType !== null &&
    (!options.isAllowedMimeType || options.isAllowedMimeType([parsed.mimeType, parsed.mediaType]));
}

function renderMediaEmbed(parsed, options) {
  var attributes = options.attributes[parsed.mediaType];
  var useHandlebars = false;

  if(options.templateName) {
    if (typeof HandlebarsTemplates === "undefined") {
      console.log("handlebars_assets is not on the assets pipeline; fall back to the usual mode");
    } else {
      useHandlebars = true;
    }
  }

  if(useHandlebars) {
    return HandlebarsTemplates[options.templateName]({
      media_type: parsed.mediaType,
      attributes: attributes,
      mimetype: parsed.mimeType,
      source_url: parsed.url,
      title: parsed.title,
      needs_cover: parsed.mediaType==="video"
    });
  } else {
    return ['<' + parsed.mediaType + ' ' + attributes + '>',
      '<source type="' + parsed.mimeType + '" src="' + parsed.url + '"></source>',
      parsed.title,
      '</' + parsed.mediaType + '>'
    ].join('\n');
  }
}

function html5EmbedRenderer(tokens, idx, options, env, renderer, defaultRender) {
  var parsed = parseToken(tokens, idx);

  if(!isAllowedMimeType(parsed, options.html5embed)) {
    return defaultRender(tokens, idx, options, env, renderer);
  }

  if(parsed.isLink) {
    clearTokens(tokens, idx+1);
  }

  return renderMediaEmbed(parsed, options.html5embed);
}

function forEachLinkOpen(state, action) {
  state.tokens.forEach(function(token, _idx, _tokens) {
    if(token.type === "inline") {
      token.children.forEach(function(token, idx, tokens) {
        if(token.type === "link_open") {
          action(tokens, idx);
        }
      });
    }
  });
}

function findDirective(state, startLine, _endLine, silent, regexp, build_token) {
  var pos = state.bMarks[startLine] + state.tShift[startLine];
  var max = state.eMarks[startLine];

  // Detect directive markdown
  var currentLine = state.src.substring(pos, max);
  var match = regexp.exec(currentLine);
  if (match === null || match.length < 1) {
    return false;
  }

  if (silent) {
    return true;
  }

  state.line = startLine + 1;

  // Build content
  var token = build_token();
  token.map = [ startLine, state.line];
  token.markup = currentLine;

  return true;
}

module.exports = function html5_embed_plugin(md, options) {
  var gstate;
  var defaults = {
    attributes: {
      audio: 'controls preload="metadata"',
      video: 'controls preload="metadata"'
    },
    useImageSyntax: true,
    inline: true,
    autoAppend: false,
    embedPlaceDirectiveRegexp: /^\[\[html5media\]\]/im
  };
  var options = md.utils.assign({}, defaults, options.html5embed);

  if(!options.inline) {
    md.block.ruler.before("paragraph", "html5embed", function(state, startLine, endLine, silent) {
      return findDirective(state, startLine, endLine, silent, options.embedPlaceDirectiveRegexp, function() {
        return state.push("html5media", "html5media", 0);
      });
    });

    md.renderer.rules.html5media = function(tokens, index) {
      var result = "";
      forEachLinkOpen(gstate, function(tokens, idx) {
        var parsed = parseToken(tokens, idx);

        if(!isAllowedMimeType(parsed, options)) {
          return;
        }

        result += renderMediaEmbed(parsed, options);
      });
      if(result.length) {
        result += "\n";
      }
      return result;
    };

    // Catch all the tokens for iteration later
    md.core.ruler.push("grab_state", function(state) {
      gstate = state;

      if(options.autoAppend) {
        var token = new state.Token("html5media", "", 0);
        state.tokens.push(token);
      }
    });
  }

  if(typeof options.isAllowedMimeType === "undefined") {
    options.isAllowedMimeType = options.is_allowed_mime_type;
  }

  if(options.inline && options.useImageSyntax) {
    var defaultRender = md.renderer.rules.image;
    md.renderer.rules.image = function(tokens, idx, opt, env, self) {
      opt.html5embed = options;
      return html5EmbedRenderer(tokens, idx, opt, env, self, defaultRender);
    }
  }

  if(options.inline && options.useLinkSyntax) {
    var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
    md.renderer.rules.link_open = function(tokens, idx, opt, env, self) {
      opt.html5embed = options;
      return html5EmbedRenderer(tokens, idx, opt, env, self, defaultRender);
    };
  }
};
