require "rubygems"
require "haml"
require "rdoc/markup/to_html"
require "fileutils"

class Legend < Thor
  include FileUtils

  desc "build", "Update static files and API docs"
  def build
    static
    api
  end

  desc "static", "Update static files"
  def static
    copy_static
    build_intro
    build_book
  end

  desc "api", "Build Sinatra API docs"
  def api
    build_api
  end

  private
    def build_intro
      puts "building intro.html"
      write_file "intro.html", "Sinatra: Getting Started", readme
    end

    def build_book
      puts "building book.html"
      write_file "book.html", "Sinatra: The Book", book
    end

    def copy_static
      puts "copying text files to _includes"
      fetch_sinatra
      cp '_sinatra/AUTHORS', '_includes/AUTHORS.markdown', :preserve => true
    end

    def readme
      fetch_sinatra

      RDoc::Markup::ToHtml.new.convert(File.read("_sinatra/README.rdoc")).
        sub("<h1>Sinatra</h1>", "<h1>Introduction</h1>")
    end

    def book
      system "git clone git://github.com/sinatra/sinatra-book.git _book" unless File.directory?("_book")
      system "cd _book && git pull &>/dev/null && thor book:build"

      content = File.read("_book/output/sinatra-book.html")[/<body>(.*?)<\/body>/m, 1]
      content.gsub(/Table of Contents<\/h1>/, "The Book</h1>")
    end

    def build_api
      fetch_sinatra

      Dir.chdir "_sinatra" do
        system(<<-EOF)
          hanna --charset utf8 \
            --fmt html \
            --inline-source \
            --line-numbers \
            --main README.rdoc \
            --op ../api \
            --title 'Sinatra API Documentation' \
            lib/**/*.rb README.rdoc
        EOF
      end
    end

    def fetch_sinatra
      system "git clone git://github.com/sinatra/sinatra.git _sinatra" unless File.directory?("_sinatra")
      system "cd _sinatra && git pull &>/dev/null"
    end

    def write_file(file_name, title, content)
      File.open(file_name, "w") do |f|
        f.write "---\ntitle: \"#{title}\"\nlayout: default\n---\n"
        f << content
      end
    end
end

class Blog < Thor
  TEMPLATE = (<<-TEXT).gsub(/^ +/, '')
    ---
    layout: post
    title: TITLE
    author: YOUR NAME
    author_url: http://sinatra.github.com/
    publish_date: #{Time.now.strftime('%A, %B %d, %Y')}
    ---

    POST CONTENT HERE
  TEXT

  desc "new", "Create a new blog post and open in EDITOR"
  def new(title=nil)
    require 'pp'
    if title.nil?
      puts "usage: thor blog:new 'Post Title'"
      exit 1
    end

    post = TEMPLATE.sub('TITLE', title)
    date = Time.now.strftime('%Y-%m-%d')
    file = "_posts/#{date}-#{title.downcase.gsub(/[!.,;:+=-]/, '').gsub(/\W+/, '-')}.markdown"
    File.open(file, 'wb') { |f| f.write(post) }
    system "$EDITOR #{file}"
  end

end



# vim: ft=ruby
