require 'rake/clean'
require 'rdoc/markup/to_html'

task :default => ['_sinatra', :build]

desc "Build outdated static files and API docs"
task :build => ['build:static']

desc "Build outdated static files"
task 'build:static' => [
  '_includes/README.html',
  '_includes/README.jp.html'
]

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

%w[README.rdoc README.jp.rdoc AUTHORS].each do |fn|
  file "_sinatra/#{fn}" => ['_sinatra']
end

# Build _includes/README.html from RDoc
file '_includes/README.html' => ['_sinatra/README.rdoc', 'Rakefile'] do |f|
  html = RDoc::Markup::ToHtml.new.convert(File.read("_sinatra/README.rdoc")).
    sub("<h1>Sinatra</h1>", "")
  File.open(f.name, 'wb') { |io| io.write(html) }
end
CLEAN.include '_includes/README.html'

# Build _includes/README.jp.html from RDoc
file '_includes/README.jp.html' => ['_sinatra/README.jp.rdoc', 'Rakefile'] do |f|
  html = RDoc::Markup::ToHtml.new.convert(File.read("_sinatra/README.jp.rdoc")).
    sub("<h1>Sinatra</h1>", "")
  File.open(f.name, 'wb') { |io| io.write(html) }
end
CLEAN.include '_includes/README.jp.html'

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
