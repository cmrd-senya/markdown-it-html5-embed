begin
  require "bundler/setup"
rescue LoadError
  puts "You must `gem install bundler` and `bundle install` to run rake tasks"
end


desc "Build gem into the pkg directory"
task :build do
  FileUtils.cp("dist/markdown-it-html5-embed.js", "lib/assets/javascripts")

  FileUtils.rm_rf("pkg")
  Dir["*.gemspec"].each do |gemspec|
    system "gem build #{gemspec}"
  end
  FileUtils.mkdir_p("pkg")
  FileUtils.mv(Dir["*.gem"], "pkg")
end
