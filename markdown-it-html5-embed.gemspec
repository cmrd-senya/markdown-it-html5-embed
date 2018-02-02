Gem::Specification.new do |spec|
  spec.name          = "markdown-it-html5-embed"
  spec.version       = "1.0.0"
  spec.authors       = ["cmrd Senya"]
  spec.email         = ["senya@riseup.net"]

  spec.summary       = "This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way"
  spec.description   = " This is a plugin for markdown-it which adds support for embedding audio/video in the HTML5 way "
  spec.homepage      = "https://github.com/cmrd-senya/markdown-it-html5-embed"

  spec.files         = ["lib/markdown-it-html5-embed.rb", "lib/assets/javascripts/markdown-it-html5-embed.js"]
  spec.require_paths = ["lib"]
  spec.license       = "MPL-2.0"

  spec.add_development_dependency "bundler", "~> 1.16"
  spec.add_development_dependency "rake", "~> 12"
end
