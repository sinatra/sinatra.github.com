require 'rake/clean'
require 'rdoc/markup/to_html'

task :default => ['_sinatra', '_book', :build]

desc "Build outdated static files and API docs"
task :build => ['build:static', 'build:api']

desc "Build outdated static files"
task 'build:static' => [
  '_includes/README.html',
  '_includes/README.jp.html',
  '_includes/CHANGES.txt',
  '_includes/book.html'
]

desc "Build outdated the API docs"
task 'build:api' => ['api/index.html']

desc "Build anything that's outdated and stage changes for next commit"
task :regen => [:build] do
  sh 'git add api _includes'
  puts "\nPrebuilt files regenerated and staged in your index. Commit with:"
  puts "  git commit -m 'Regen prebuilt files'"
end

desc 'Pull in the latest from the sinatra and sinatra-book repos'
task :pull => ['pull:sinatra', 'pull:book']

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

desc 'Pull in the latest from the book repo'
task 'pull:book' do
  if File.directory?("_book")
    puts 'Pulling sinatra-book.git'
    sh "cd _book && git pull &>/dev/null"
    touch '_book', :verbose => false
  else
    puts 'Cloning sinatra-book repo'
    sh "git clone git://github.com/sinatra/sinatra-book.git _book"
  end
  sh "cd _book && git pull &>/dev/null && thor book:build"
end
file('_book') { Rake::Task['pull:book'].invoke }
CLOBBER.include '_book'

%w[README.rdoc README.jp.rdoc CHANGES AUTHORS].each do |fn|
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

# Build _includes/CHANGES.txt from CHANGES file
file '_includes/CHANGES.txt' => ['_sinatra/CHANGES', 'Rakefile'] do |f|
  puts "Building _includes/CHANGES.txt"
  cp '_sinatra/CHANGES', '_includes/CHANGES.txt'
end
CLEAN.include '_includes/CHANGES.txt'

# Build _includes/book.html from the book project
file '_includes/book.html' => (['_book', 'Rakefile'] + FileList['_book/**']) do |f|
  puts "Building _includes/book.html"
  sh "cd _book && thor book:build"
  html = File.read("_book/output/sinatra-book.html")[/<body>(.*?)<\/body>/m, 1].
    sub(/.*Table of Contents<\/h1>/, "")
  File.open(f.name, 'wb') { |io| io.write(html) }
end
CLEAN.include '_includes/book.html'

# Build the API docs
file 'api/index.html' => FileList['_sinatra', '_sinatra/**', 'Rakefile'] do |f|
  puts 'Building API docs'
  rm_rf 'api'
  Dir.chdir "_sinatra" do
    sh <<-SH
      hanna --charset utf8 --fmt html --inline-source --line-numbers \
        --main README.rdoc --op ../api --title 'Sinatra API Documentation' \
        lib/**/*.rb README.rdoc CHANGES AUTHORS
    SH
  end
end
CLEAN.include 'api'

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
