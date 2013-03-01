---
title: "Sinatra: Frequently Asked Questions"
layout: default
---

Frequently Asked Questions
==========================

* this will become the toc
{:toc}

How do I make my Sinatra app reload on changes? {#reloading}
-----------------------------------------------

First off, in-process code reloading in Ruby [is hard](http://rkh.im/code-reloading)
and having a solution that works for every scenario is technically impossible.

Which is why we recommend you to do out-of-process reloading.

First you need to install [rerun](https://github.com/alexch/rerun) if you haven't already:

    $ gem install rerun

Now if you start your Sinatra app like this:

    $ ruby app.rb

All you have to do for reloading is instead do this:

    $ rerun 'ruby app.rb'

If you are for instance using `rackup`, instead do the following:

    $ rerun 'rackup'

You get the idea.

If you still want in-process reloading, check out [Sinatra::Reloader](/contrib/reloader).

What are my deployment options? {#deploy}
-------------------------------

See the [book](book.html#deployment).

How do I use sessions? {#sessions}
----------------------

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

If you need to set additional parameters for sessions, like expiration date, use [`Rack::Session::Cookie`](http://rack.rubyforge.org/doc/classes/Rack/Session/Cookie.html) directly instead of `enable :sessions` (example from _Rack_ documentation):

    use Rack::Session::Cookie, :key => 'rack.session',
                               :domain => 'foo.com',
                               :path => '/',
                               :expire_after => 2592000, # In seconds
                               :secret => 'change_me'

How do I use session-based flash? {#flash}
--------------------------------

Use [Rack::Flash](https://github.com/treeder/rack-flash).

Can I run Sinatra under Ruby 1.9? {#ruby19}
---------------------------------

Yes. As of Sinatra 0.9.2, Sinatra is fully Ruby 1.9 and Rack 1.0 compatible.
Since 1.1 you do not have to deal with encodings on your own, unless you want to.

How do I get the "route" for the current page? {#path_info}
----------------------------------------------

The `request` object probably has what you're looking for:

    get '/hello-world' do
      request.path_info   # => '/hello-world'
      request.fullpath    # => '/hello-world?foo=bar'
      request.url         # => 'http://example.com/hello-world?foo=bar'
    end

See [Rack::Request](http://rack.rubyforge.org/doc/classes/Rack/Request.html)
for a detailed list of methods supported by the `request` object.

How do I access helpers from within my views? {#helpview}
---------------------------------------------

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

How do I render partials? {#partials}
-------------------------

Sinatra's template system is simple enough that it can be used for page and
fragment level rendering tasks. The `erb` and `haml` methods simply return a
string.

Since Sinatra 1.1, you can use the same calls for partials you use in the routes:

    <%= erb :mypartial %>

In versions prior to 1.1, you need to make sure you disable layout rendering as
follows:

    <%= erb :mypartial, :layout => false %>

See [Sam Elliott](http://www.lenary.co.uk/) and [Iain Barnett](http://iainbarnett.me.uk/)'s
[Sinatra-Partial extension](https://github.com/yb66/Sinatra-Partial)
for a more robust partials implementation. It also supports rendering
collections and partials in subdirectories.

The code used to live in a [gist](https://gist.github.com/119874),
but we have put it in a gem so we can maintain it properly and
provide an easier way for developers to include its behaviour.
It was adapted from [Chris Schneider](http://www.gittr.com/)'s
original [partials.rb](https://github.com/cschneid/irclogger/blob/master/lib/partials.rb)
implementation.

Use it as follows to render the `mypartial.haml`(1) or the `admin/mypartial.haml`(2)
partials, or with a collection (3) & (4):

    <%= partial(:mypartial) %> <!--(1)-->
    <%= partial(:'admin/mypartial') %> <!--(2)-->
    <%= partial(:object, :collection => @objects) %> <!--(3)-->
    <%= partial(:'admin/object', :collection => @objects) %> <!--(4)-->

In (1) & (2), the partial will be rendered plain from their files, with no
local variables (specify them with a hash passed into `:locals`).
In (3) & (4), the partials will be rendered, populating the local
variable `object` with each of the objects from the collection.

It is also possible to enable using underscores, a la Rails, and
to choose a different rendering engine from haml.


Can I have multiple URLs trigger the same route/handler? {#multiroute}
--------------------------------------------------------

Sure:

    ["/foo", "/bar", "/baz"].each do |path|
      get path do
        "You've reached me at #{request.path_info}"
      end
    end

Seriously.

How do I make the trailing slash optional? {#slash}
------------------------------------------

Put a question mark after it:

    get '/foo/bar/?' do
      "Hello World"
    end

The route matches `"/foo/bar"` and `"/foo/bar/"`.

How do I render templates nested in subdirectories? {#subdir}
---------------------------------------------------

Sinatra apps do not typically have a very complex file hierarchy under
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

I'm running Thin and an error occurs but there's no output {#thindebug}
----------------------------------------------------------

Try starting Thin with the `--debug` argument:

    thin --debug --rackup config.ru start

That should give you an exception and backtrace on `stderr`.

How do I send email from Sinatra? {#email}
---------------------------------

How about a [Pony](http://adam.heroku.com/past/2008/11/2/pony_the_express_way_to_send_email_from_ruby/)
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

How do I escape HTML? {#escape_html}
---------------------

Use [Rack::Utils](http://rack.rubyforge.org/doc/classes/Rack/Utils.html)
in your helpers as follows:

    helpers do
      def h(text)
        Rack::Utils.escape_html(text)
      end
    end

Now you can escape HTML in your templates like this:

    <%= h scary_output %>

Thanks to [Chris Schneider](http://www.gittr.com/index.php/archive/using-rackutils-in-sinatra-escape_html-h-in-rails/)
for the tip!

How do I automatically escape HTML? {#auto_escape_html}
---------------------

Require [Erubis](http://rubygems.org/gems/erubis) and set `escape_html` to `true`:

    require 'erubis'
    set :erubis, :escape_html => true

Then, any templates rendered with Erubis will be automatically escaped:

    get '/' do
      erubis :index
    end

Read more on the [Tilt Google Group](https://groups.google.com/forum/#!topic/tiltrb/PPm-sMz6Swc) and see [this example app](http://flowcoder.com/177) for details.

How do I use ActiveRecord migrations? {#ar-migrations}
-------------------------------------

From [Adam Wiggins's blog](http://adam.blog.heroku.com/past/2009/2/28/activerecord_migrations_outside_rails/):

> To use ActiveRecord’s migrations with Sinatra (or other non-Rails project),
> add the following to your Rakefile:
>
>     namespace :db do
>       desc "Migrate the database"
>       task(:migrate => :environment) do
>         ActiveRecord::Base.logger = Logger.new(STDOUT)
>         ActiveRecord::Migration.verbose = true
>         ActiveRecord::Migrator.migrate("db/migrate")
>       end
>     end
>
> This assumes you have a task called `:environment` which loads your app’s
> environment (requires the right files, sets up the database connection, etc).
>
> Now you can create a directory called `db/migrate` and fill in your
> migrations. I usually call the first one `001_init.rb`.
> (I prefer the old sequential method for numbering migrations vs. the
> datetime method used since Rails 2.1, but either will work.)


How do I use HTTP authentication? {#auth}
---------------------------------

You have at least two options for implementing basic access authentication (Basic HTTP Auth) in your application.

I. When you want to protect all requests in the application, simply put Rack::Auth::Basic middleware in the request processing chain by the `use` directive:

    require 'rubygems'
    require 'sinatra'

    use Rack::Auth::Basic, "Restricted Area" do |username, password|
      [username, password] == ['admin', 'admin']
    end

    get '/' do
      "You're welcome"
    end

    get '/foo' do
      "You're also welcome"
    end

II. When you want to protect only certain URLs in the application, or want the authorization to be more complex, you may use something like this:

    require 'rubygems'
    require 'sinatra'

    helpers do

      def protected!
        unless authorized?
          response['WWW-Authenticate'] = %(Basic realm="Restricted Area")
          throw(:halt, [401, "Not authorized\n"])
        end
      end

      def authorized?
        @auth ||=  Rack::Auth::Basic::Request.new(request.env)
        @auth.provided? && @auth.basic? && @auth.credentials && @auth.credentials == ['admin', 'admin']
      end

    end

    get '/' do
      "Everybody can see this page"
    end

    get '/protected' do
      protected!
      "Welcome, authenticated client"
    end


How do I test HTTP authentication? {#test_http_auth}
----------------------------------

Assuming you have this simple implementation of HTTP authentication in your `application.rb`:

    require 'rubygems'
    require 'sinatra'

    use Rack::Auth::Basic do |username, password|
      [username, password] == ['admin', 'admin']
    end

    get '/protected' do
      "You're welcome"
    end

You can test it like this with [_Rack::Test_](https://github.com/brynary/rack-test):

    ENV['RACK_ENV'] = 'test'

    require 'rubygems'
    require 'test/unit'
    require 'rack/test'

    require 'application'

    class ApplicationTest < Test::Unit::TestCase
      include Rack::Test::Methods

      def app
        Sinatra::Application
      end

      def test_without_authentication
        get '/protected'
        assert_equal 401, last_response.status
      end

      def test_with_bad_credentials
        authorize 'bad', 'boy'
        get '/protected'
        assert_equal 401, last_response.status
      end

      def test_with_proper_credentials
        authorize 'admin', 'admin'
        get '/protected'
        assert_equal 200, last_response.status
        assert_equal "You're welcome", last_response.body
      end
    end



How can I internationalise my application? {#i18n}
------------------------------------------

We will rely on the `i18n` gem to handle internationalisation
of string and object, and to manage fallbacks on available locales

    require 'i18n'
    require 'i18n/backend/fallbacks'

A little configuration need to be done on I18n module so that:

* it can fallbacks on others locales if the requested one is not
  available (ie: translation as not been done).
* all the transalations are read from YAML files located in the
  `locales` directory

    configure
        I18n::Backend::Simple.send(:include, I18n::Backend::Fallbacks)
        I18n.load_path, Dir[File.join(settings.root, 'locales', '*.yml')]
        I18n.backend.load_translations
    end

Now we need to choose the locale that the user want. There are severals
solutions (and some can even be mixed together): browser preference,
spefic URL, dedicated subdomain, cookies or session management. 
Only the first three will be shown below:

* Browser preference

    # Requires: rack-contrib
    use Rack::Locale

* Specific URL

    before '/:locale/*' do
        I18n.locale       =       params[:locale]
        request.path_info = '/' + params[:splat ][0]
    end

* Dedicated subdomain

    before do
        if (locale = request.host.split('.')[0]) != 'www'
            I18n.locale = locale
        end
    end    


We have all the necessary information to deliver to the user
texts/pages in its native language. And for that we will need to
select string and templates according to the locale.

Selection of localised string/object is easy as it only requires
use of standard methods from the `i18n` module

    I18n.t(:token)
    I18n.l(Time.now)

For rendering the templates matching the desired locale, 
we will need to extend the `find_template` method. 
Indeed it will to select the first template matching
one of the prefered locale, template being suffixed by
the name of the locale

    helpers do
        def find_template(views, name, engine, &block)
            I18n.fallbacks[I18n.locale].each { |locale|
              super(views, "#{name}.#{locale}", engine, &block) }
            super(views, name, engine, &block)
        end
    end


<!--

### <a id='queue' href='#queue'>How do I process jobs in the background?</a>
### <a id='auth' href='#auth'>How do I process file uploads?</a>

-->
