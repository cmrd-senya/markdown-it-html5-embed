# markdown-it-html5-embed
This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way, by using <video>/<audio> tags.

## Install

node.js, bower:

```bash
npm install markdown-it-html5-embed --save
bower install markdown-it-html5-embed --save
```

## Use

### With Node

```js
var md = require('markdown-it')()
            .use(require('markdown-it-html5-embed'), {
              html5embed: {
                useImageSyntax: true, // Enables video/audio embed with ![]() syntax (default)
                useLinkSyntax: true   // Enables video/audio embed with []() syntax
            }});

md.render('![](http://example.com/file.webm)'); // => '<p><video width="320" height="240" class="audioplayer" controls>
                                                // <source type="video/webm" src=https://example.com/file.webm></source>
                                                // Fallback text (see below)
                                                // </video></p>'
```

### With Bower

```js
var md = window.markdownit({});

var html5medialPlugin = window.markdownitHTML5Embed;
md.use(html5medialPlugin, { html5embed: { useLinkSyntax: true } });
md.render(text);
```

## Features

### Embed in-place with "link syntax"

Options:
```js
useLinkSyntax: true
```

In this mode every link to media files will be replaced with HTML5 embed:

Markdown:

```markdown
[test link](https://example.com/file.webm)
```
Rendered:
```html
<p><video controls preload="metadata">
<source type="video/webm" src="https://example.com/file.webm"></source>
Your browser does not support playing HTML5 video. You can
<a href="https://example.com/file.webm" download>download a copy of the video
file</a> instead.
Here is a description of the content: test link
</video></p>
```

### Embed in-place with the "image syntax"

Options:
```js
useImageSyntax: true
```

In this mode every media file referenced with MD image syntax will be replaced with HTML5 embed:

Markdown:

```markdown
![](https://example.com/file.webm)
```
Rendered:
```html
<p><video width="320" height="240" class="audioplayer" controls>
<source type="video/webm" src="https://example.com/file.webm"></source>
Your browser does not support playing HTML5 video. You can
<a href="https://example.com/file.webm" download>download a copy of the video
file</a> instead.
</video></p>
```

Can be used along with the "link syntax".

### Embed at particular place referenced by a MD directive

Options:
```js
inline: false
```

In this mode the plugin pick every link to media files in the text and embeds them at the place pointed by specific Markdown directive.
Default value for the directive is `[[html5media]]`, but it can be adjusted by `embedPlaceDirectiveRegexp` option.

This mode always uses link syntax.

Markdown:

```markdown
[test link](https://example.com/file.webm)

[[html5media]]
```

Rendered:
```html
<p><a href="https://example.com/file.webm">test link</a></p>
<video controls preload="metadata">
<source type="video/webm" src="https://example.com/file.webm"></source>
Your browser does not support playing HTML5 video. You can
<a href="https://example.com/file.webm" download>download a copy of the video
file</a> instead.
Here is a description of the content: test link
</video>
```

### Automatic append

Options:
```js
inline: false,
autoAppend: true
```

In this mode media files are embedded at the end of the rendered text without any specific directives.

This mode always uses link syntax.

Markdown:

```markdown
[test link](https://example.com/file.webm)
```

Rendered:
```html
<p><a href="https://example.com/file.webm">test link</a></p>
<video controls preload="metadata">
<source type="video/webm" src="https://example.com/file.webm"></source>
Your browser does not support playing HTML5 video. You can
<a href="https://example.com/file.webm" download>download a copy of the video
file</a> instead.
Here is a description of the content: test link
</video>
```

### Handlebars templates

Options:
```js
templateName: "media-embed_tpl"
```

If you want to render media embed using Handlebars template, you can set `templateName` option and the plugin will try to find
the template using global `HandlebarsTemplates` array and render using this template.    

You can access the descriptive content (e.g., "test link" above) via the
`{{title}}` variable. It will be set to "Untitled video" or "Untitled audio"
if no title was set. You can access the fallback text ("Your browser does not
support ...")  via the `{{fallback}}` variable. See below for how to
customize/translate the text.

## Options reference

#### attributes

Hash. HTML attributes to pass to audio/video tags. Example:

```js
    attributes: {
      'audio': 'width="320" controls class="audioplayer"',
      'video': 'width="320" height="240" class="audioplayer" controls'
    }
```

Default:

```js
    attributes: {
      audio: 'controls preload="metadata"',
      video: 'controls preload="metadata"'
    },
```

#### autoAppend

Boolean. In inline mode, whether to append media embeds automatically or not.

If true, linked media files are embedded at the end of the post.

Default: `false`.

#### embedPlaceDirectiveRegexp

Regexp. Regular expression for the directive which is used to set the place for media embeds in case of non-inline embedding.

Default: ```/^\[\[html5media\]\]/im```

#### inline

Boolean. Embed media in-place if true, or at some specified place if false.

Default: `true`.

#### isAllowedMimeType

Function. If specified, allows to decided basing on the MIME type, wheter to embed element or not. If not, all audio/video content is embedded. In a web browser you can use following code to embed only supported media type:
```
      is_allowed_mime_type: function(mimetype) {
        var v = document.createElement(mimetype[1]);
        return v.canPlayType && v.canPlayType(mimetype[0]) !== '';
      }
```
This way, all unsupported media will be rendered with defualt renderer (e.g., as a link, if ```use_link_syntax``` is true).

The argument is a result of regexp match, and has a structure similar to that one:
```
[ 'audio/mpeg',
  'audio',
  index: 0,
  input: 'audio/mpeg' ]
```

Default: `undefined`, allow everything.

#### templateName

String. If the plugin is used in a Rails asset pipeline along with the handlebars_assets gem, then you can use a Handlebars template to control the output of the plugin. This option specifies the name of the template to use, which will be picked from the HandlebarsTemplates array.

If HandlebarsTemplates is undefined, this option is ignored.

Default: `undefined`, don't use Handlebars.

#### useImageSyntax

Boolean. Enables video/audio embed with ```![]()``` syntax.

Default: `true`.

#### useLinkSyntax

Boolean. Enables video/audio embed with ```[]()``` syntax.

Default: `false`.

#### messages

Object. Override the built-in default fallback text. You can add translations as
well, and load the translation by invoking `md.render` with a language
environment variable, like so: `md.render('some text', { language: 'code' })`

See `lib/index.js` for the default text in English.

#### translateFn

Object. Override the built-in translation function. The function has to process
an object like this as its only argument, and return a string:

````javascript
{
  messageKey: 'video not supported',
  messageParam: 'somevideo.webm',
  language: 'en'
}
````

The keys you need to support are defined in `lib/index.js`. You can access the
default messages, or the messages you passed via `options.messages`, through
the `this` keyword within your translation function.

## Credits

Originally based on [the code](http://talk.commonmark.org/t/embedded-audio-and-video/441/16) written by [v3ss0n](https://github.com/v3ss0n).
