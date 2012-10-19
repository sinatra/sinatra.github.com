require "fileutils"
require "shellwords"

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
    abort("usage: thor blog:new 'Post Title'") if title.nil?

    post = TEMPLATE.sub('TITLE', title)
    date = Time.now.strftime('%Y-%m-%d')
    file = "_posts/#{date}-#{title.downcase.gsub(/[!.,;:+=-]/, '').gsub(/\W+/, '-')}.markdown"
    File.open(file, 'wb') { |f| f.write(post) }
    editor = ENV['VISUAL'] || ENV['EDITOR']
    if !editor
      abort("Either set $VISUAL or $EDITOR")
    else
      commands = Shellwords.shellwords(editor)
      commands << file
      success = system(*commands)
      if !success
        abort("Could not run '#{editor} #{file}', exit code: #{$?.exitstatus}")
      end
    end
  end
end

# vim: ft=ruby
