# markdown-it-html5-embed
This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way

## Install

node.js, bower:

```bash
npm install markdown-it-html5-embed --save
bower install markdown-it-html5-embed --save
```

## Use

```js
var md = require('markdown-it')()
            .use(require('markdown-it-html5-embed'), {
              html5embed: {
                use_image_syntax: true, // Enables video/audio embed with ![]() syntax (default)
                use_link_syntax: true   // Enables video/audio embed with []() syntax
            }});

md.render('![](http://example.com/file.webm)'); // => '<p><video width="320" height="240" class="audioplayer" controls>
<source type="video/webm" src=http://example.com/file.webm></source>
</video></p>'
```

