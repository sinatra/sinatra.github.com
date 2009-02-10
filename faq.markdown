---
title: "Sinatra: Frequently Asked Questions"
layout: default
---

Frequently Asked Questions
==========================

## <a id='sessions' href='#sessions'>How do I use sessions?</a>

Sessions are disabled by default. You need to enable them and then use the
`session` hash from routes and views:

    enable :sessions

    get '/foo' do
      session[:message] = 'Hello World!'
      redirect '/bar'
    end

    get '/bar' do
      session[:message]   # => 'Hello World!'
    end

## <a id='ruby19' href='#ruby19'>Can I run Sinatra under Ruby 1.9?</a>

Not yet. [Rack](http://rack.rubyforge.org/) is not yet Ruby 1.9 compatible
and Sinatra is very much dependent on Rack. We _are_ in the early stages of
testing under 1.9 and we're reviewing all new code and idioms for potential
1.9 compatibility issues. The 1.0 release (currently scheduled for mid 2009)
will run on 1.9 and chances are good that we'll support 1.9 before then.

## <a id='path_info' href='#path_info'>How do I get the "route" for the current page?</a>

The `request` object probably has what you're looking for:

    get '/hello-world' do
      request.path_info   # => '/hello-world'
      request.fullpath    # => '/hello-world?foo=bar'
      request.url         # => 'http://example.com/hello-world?foo=bar'
    end

See [Rack::Request](http://rack.rubyforge.org/doc/classes/Rack/Request.html)
for a detailed list of methods supported by the `request` object.

## <a id='helpview' href='#helpview'>How do I access helpers from within my views?</a>

Call them! Views automatically have access to all helper methods. In fact,
Sinatra evaluates routes, views, and helpers within the same exact object
context so they all have access to the same methods and instance variables.

In `hello.rb`:

    helpers do
      def em(text)
        "<em>#{text}</em>"
      end
    end

    get '/hello' do
      @subject = 'World'
      haml :hello
    end

In `views/hello.haml`:

    %p= "Hello " + em(@subject)

## <a id='partials' href='#partials'>How do I render partials?</a>

Sinatra's template system is simple enough that it can be used for page and
fragment level rendering tasks. The `erb` and `haml` methods simply return a
string. However, you need to make sure you disable layout rendering as
follows:

    <%= erb(:mypartial, :layout => false) %>

See [Chris Schneider](http://www.gittr.com/)'s
[partials.rb](http://github.com/cschneid/irclogger/blob/master/lib/partials.rb)
for a more robust partials implementation. It even supports rendering
collections.

## <a id='multiroute' href='#multiroute'>Can I have multiple URLs trigger the same route/handler?</a>

Sure:

    ["/foo", "/bar", "/baz"].each do |path|
      get path do
        "You've reached me at #{request.path_info}"
      end
    end

Seriously.

## <a id='slash' href='#slash'>How do I make the trailing slash optional?</a>

Put a question mark after it:

    get '/foo/bar/?' do
      "Hello World"
    end

The route matches `"/foo/bar"` and `"/foo/bar/"`.

## <a id='subdir' href='#subdir'>How do I render templates nested in subdirectories?</a>

Sinatra apps do not typically have a very complex file heirarchy under
`views`. First, consider whether you really need subdirectories at all.
If so, you can use the `views/foo/bar.haml` file as a template with:

    get '/' do
      haml :'foo/bar'
    end

This is basically the same as sending `#to_sym` to the filename and can also
be written as:

    get '/' do
      haml 'foo/bar'.to_sym
    end

## <a id='thindebug' href='#thindebug'>I'm running Thin and an error occurs but there's no output</a>

Try starting Thin with the `--debug` argument:

    thin --debug --rackup config.ru start

That should give you an exception and backtrace on `stderr`.

## <a id='email' href='#email'>How do I send Email from Sinatra?</a>

How about a [Pony](http://adam.blog.heroku.com/past/2008/11/2/pony_the_express_way_to_send_email_from_ruby/)
(`sudo gem install pony`):

    require 'pony'
    post '/signup' do
      Pony.mail :to => 'you@example.com',
        :from => 'me@example.com',
        :subject => 'Howdy, Partna!'
    end

You can even use templates to render the body. In `email.erb`:

    Good day <%= params[:name] %>,

    Thanks for my signing my guestbook. You're a doll.

    Frank

And in `mailerapp.rb`:

    post '/guestbook/sign' do
      Pony.mail :to => params[:email],
        :from => "me@example.com",
        :subject => "Thanks for signing my guestbook, #{params[:name]}!",
        :body => erb(:email)
    end

## <a id='deploy' href='#deploy'>What are my deployment options?</a>

See the [book](book.html#deployment).

## <a id='escape_html' href='#escape_html'>How do I escape html?</a>

Include [Rack::Utils](http://rack.rubyforge.org/doc/classes/Rack/Utils.html)
in your helpers and create an `h` alias as follows:

    helpers do
      include Rack::Utils
      alias_method :h, :escape_html
    end

Now you can escape html in your templates like this:

    <%= h scary_output %>

Thanks to [Chris Schneider](http://www.gittr.com/index.php/archive/using-rackutils-in-sinatra-escape_html-h-in-rails/)
for the tip!

<!--

### <a id='queue' href='#queue'>How do I process jobs in the background?</a>
### <a id='auth' href='#auth'>How do I use HTTP authorization?</a>
### <a id='auth' href='#auth'>How do I process file uploads?</a>

-->
