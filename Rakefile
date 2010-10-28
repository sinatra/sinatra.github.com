require 'rake/clean'
require 'rdoc/markup/to_html'

def readme(pattern = "%s", &block)
  return readme(pattern).each(&block) if block_given?
  %w[en de es fr hu jp zh ru].map do |lang|
    pattern % "README#{lang == "en" ? "" : ".#{lang}"}"
  end
end

task :default => ['_sinatra', :build]

desc "Build outdated static files and API docs"
task :build => ['build:static']

desc "Build outdated static files"
task 'build:static' => readme("_includes/%s.html")

desc "Build anything that's outdated and stage changes for next commit"
task :regen => [:build] do
  sh 'git add api _includes'
  puts "\nPrebuilt files regenerated and staged in your index. Commit with:"
  puts "  git commit -m 'Regen prebuilt files'"
end

desc 'Pull in the latest from the sinatra and sinatra-book repos'
task :pull => ['pull:sinatra']

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
file('_sinatra') { Rake::Task['pull:sinatra'].invoke }
CLOBBER.include '_sinatra'

readme("_sinatra/%s.rdoc") { |fn| file fn => '_sinatra' }
file 'AUTHORS' => '_sinatra'

readme do |fn|
  file "_includes/#{fn}.html" => ["_sinatra/#{fn}.rdoc", "Rakefile"] do |f|
    html =
      RDoc::Markup::ToHtml.new.
      convert(File.read("_sinatra/#{fn}.rdoc")).
      sub("<h1>Sinatra</h1>", "")
    File.open(f.name, 'wb') { |io| io.write(html) }
  end
  CLEAN.include "_includes/#{fn}.html"
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
CLEAN.include '_site'
