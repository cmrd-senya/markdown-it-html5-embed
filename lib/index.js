// The code is originally taken from http://talk.commonmark.org/t/embedded-audio-and-video/441/16

function html5_embed_renderer(tokens, idx, options, env, self, defaultRender) {
  var audioRE = /^.*\.(ogg|mp3)$/gi;
  var videoRE = /^.*\.(mp4|webm)$/gi;
  var token = tokens[idx];
  var aIndex = token.attrIndex('src');
//  console.log('aindex of idx' + idx);
//  console.log(aIndex);
  var matches_audio = audioRE.exec(token.attrs[aIndex][1]);
  var matches_video = videoRE.exec(token.attrs[aIndex][1]);
//  console.log(token.attrs[aIndex][1]);
  if (matches_audio !== null) {
//    console.log('matches audio')        
    return ['<p><audio width="320" controls class="audioplayer"',
      '<source type="audio/' + matches_audio[1] + '" src=' + matches_audio[0] + '></source>',
      '</audio></p>'
    ].join('\n');
  } else if (matches_video !== null) {
//    console.log('matches video')
    return ['<p><video width="320" height="240" class="audioplayer" controls>',
  '<source type="video/' + matches_video[1] + '" src=' + matches_video[0] + '></source>',
  '</video></p>'
].join('\n');
  }else {
//    console.log('matches img')
    return defaultRender(tokens, idx, options, env, self);
  }
}


module.exports = function html5_embed_plugin(md, options) {
  var defaultRender = md.renderer.rules.image;
  md.renderer.rules.image = function(tokens, idx, opt, env, self) {
    return html5_embed_renderer(tokens, idx, opt, env, self, defaultRender);
  };
};
