# encoding: utf-8
require 'rake/clean'
require 'rdoc/encoding'
require 'rdoc/markup/to_html'
require 'redcarpet'
require 'uri'

def readme(pattern = "%s", &block)
  return readme(pattern).each(&block) if block_given?
  %w[en de es fr hu jp zh ru ko pt-br pt-pt].map do |lang|
    pattern % "README#{lang == "en" ? "" : ".#{lang}"}"
  end
end

def contrib(pattern = "%s", &block)
  return contrib(pattern).each(&block) if block_given?

  %w[
    sinatra-config-file
    sinatra-multi-route
    sinatra-content-for
    sinatra-namespace
    sinatra-cookies
    sinatra-reloader
    sinatra-decompile
    sinatra-respond-with
    sinatra-extension
    sinatra-streaming
    sinatra-json
    sinatra-link-header
  ].map do |extension|
    pattern % extension
  end
end

# generates Table of Contents
def with_toc(src)
  toc = "<div class='toc'>\n"
  last_level = 1
  src = src.gsub(/<h(\d)>(.*)<\/h\d>/) do |line|
    level, heading = $1.to_i, $2.strip
    aname = URI.escape(heading)
    toc << "\t"*last_level << "<ol class='level-#{level-1}'>\n" if level > last_level
    toc << "\t"*level << "</ol>"*(last_level - level) << "\n" if level < last_level
    toc << "\t"*level << "<li><a href='##{aname}'>#{heading}</a></li>\n"
    last_level = level
    "<a name='#{aname}'></a>\n" << line
  end
  toc << "\t" << "</ol>"*(last_level-1) << "\n</div>\n"
  toc + src
end

task :default => ['_sinatra', :build]

desc "Build outdated static files and API docs"
task :build => ['build:static']

desc "Build outdated static files"
task 'build:static' => readme("_includes/%s.html") + contrib("_includes/%s.html")

desc "Build anything that's outdated and stage changes for next commit"
task :regen => [:build] do
  sh 'git add api _includes'
  puts "\nPrebuilt files regenerated and staged in your index. Commit with:"
  puts "  git commit -m 'Regen prebuilt files'"
end

desc 'Pull in the latest from the sinatra and sinatra-contrib repos'
task :pull => ['pull:sinatra', 'pull:contrib']

desc 'Pull in the latest from the sinatra repo'
task 'pull:sinatra' do
  if File.directory?("_sinatra")
    puts 'Pulling sinatra.git'
    sh "cd _sinatra && git pull &>/dev/null"
    touch '_sinatra', :verbose => false
  else
    puts 'Cloning sinatra repo'
    sh "git clone git://github.com/sinatra/sinatra.git _sinatra" 
  end
end

desc 'Convert Sinatra READMEs to HTML'
task 'convert:sinatra' do
  readme do |fn|
    file "_includes/#{fn}.html" => ["_sinatra/#{fn}", "Rakefile"] do |f|
      rndr = Redcarpet::Render::HTML.new(:safe_links_only => true)
      markdown = Redcarpet::Markdown.new(rndr, :lax_spacing => true, :fenced_code_blocks => true)
      markdown_string = File.read("_sinatra/#{fn}.md").encode('UTF-16le', :invalid => :replace, :replace => "").encode("UTF-8")
      markdown_string.sub!(/##[^#]*\[Sinatra\]((?!\n#).)+/m, '') # remove ToC
      html = markdown.render(markdown_string).sub("<h1>Sinatra</h1>", "")
      File.open(f.name, 'w') { |io| io.write with_toc(html) }
    end
    CLEAN.include "_includes/#{fn}.html"
  end
end

desc 'Pull in the latest from the sinatra-contrib repo'
task 'pull:contrib' do
  if File.directory?("_contrib")
    puts 'Pulling sinatra-contrib.git'
    sh "cd _contrib && git pull &>/dev/null"
    touch '_contrib', :verbose => false
  else
    puts 'Cloning sinatra-contrib repo'
    sh "git clone git://github.com/sinatra/sinatra-contrib.git _contrib" 
  end
  puts 'Building sinatra-contrib docs'
  sh "cd _contrib && rake doc &>/dev/null"
end

desc 'Convert contrib files from RDoc to html'
task 'convert:contrib' do
  contrib do |fn|
    file "_includes/#{fn}.html" => ["_contrib/doc/#{fn}.rdoc", "Rakefile"] do |f|
      html =
        RDoc::Markup::ToHtml.new.
        convert(File.read("_contrib/doc/#{fn}.rdoc"))
      File.open(f.name, 'wb') { |io| io.write html }
    end
    CLEAN.include "_includes/#{fn}.html"
  end
end

desc 'Rebuild site under _site with Jekyll'
task :jekyll do
  rm_rf '_site'
  sh 'jekyll --pygments'
end

desc 'Start the Jekyll server on http://localhost:4000/'
task :server do
  rm_rf '_site'
  puts 'jekyll --pygments --auto --server'
  exec 'jekyll --pygments --auto --server'
end


file('_sinatra') { Rake::Task['pull:sinatra'].invoke }
CLOBBER.include '_sinatra'

readme("_sinatra/%s") { |fn| file fn => '_sinatra' }
file 'AUTHORS' => '_sinatra'

Rake::Task['convert:sinatra'].invoke

file('_contrib') { Rake::Task['pull:contrib'].invoke }
CLOBBER.include '_contrib'

contrib("_contrib/doc/%s.rdoc") { |fn| file fn => '_contrib' }


Rake::Task['convert:contrib'].invoke

CLEAN.include '_site'
