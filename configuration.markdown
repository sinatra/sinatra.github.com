---
title: 'Sinatra: Options and Configuration'
layout: default
id: configuration
---

Options and Configuration
=========================

Sinatra includes a number of built-in options that control whether certain
features are enabled. Options are application-level variables that are
modified using one of the `set`, `enable`, or `disable` methods and are
available within the request context via the `options` object. Applications
are free to set custom options as well as the default, built-in options
provided by the framework.

Using `set`, `enable`, and `disable`
------------------------------------

In its simplest form, the `set` method takes an option name and value and
creates an attribute on the application. Options can be accessed within
requests via the `options` object:

{% highlight ruby %}
set :foo, 'bar'

get '/foo' do
  "foo is set to " + options.foo
end
{% endhighlight %}

### Deferring option evaluation

When the option value is a `Proc`, evaluation is performed when the option
is read so that other options may be used to calculate the option value:

{% highlight ruby %}
set :foo, 'bar'
set :baz, Proc.new { "Hello " + foo }

get '/baz' do
  "baz is set to " + options.baz
end
{% endhighlight %}

The `/baz` response should come as "baz is set to Hello bar" unless the
`foo` option is modified.

### Setting multiple options

Multiple options can be set by passing a Hash to `set`. The previous example
could be rewritten with:

{% highlight ruby %}
set :foo => 'bar', :baz => Proc.new { "Hello " + foo }
{% endhighlight %}

### Setting multiple boolean options with `enable` and `disable`

The `enable` and `disable` methods are sugar for setting a list of options
to `true` or `false`, respectively. The following two code examples are
equivalent:

{% highlight ruby %}
enable  :sessions, :clean_trace
disable :logging, :dump_errors, :some_custom_option
{% endhighlight %}

Using `set`:

{% highlight ruby %}
set :sessions, true
set :clean_trace, true
set :logging, false
set :dump_errors, false
set :some_custom_option, false
{% endhighlight %}

Built-in Options
----------------

### `:environment` - configuration/deployment environment

A symbol specifying the deployment environment; typically set to one of
`:development`, `:test`, or `:production`. The `:environment` defaults to
the value of the `RACK_ENV` environment variable (`ENV['RACK_ENV']`), or
`:development` when no `RACK_ENV` environment variable is set.

The environment can be set explicitly:

    set :environment, :production

### `:sessions` - enable/disable cookie based sessions

Support for encrypted, cookie-based sessions are included with Sinatra but
are disabled by default. Enable them with:

    set :sessions, true

Sessions are implemented by inserting the [`Rack::Session::Cookie`][c]
component into the application's middleware pipeline.

[c]: http://rack.rubyforge.org/doc/classes/Rack/Session/Cookie.html

### `:logging` - log requests to `STDERR`

Writes a single line to `STDERR` in Apache common log format when enabled.
This option is enabled by default in classic style apps and disabled by
default in `Sinatra::Base` subclasses.

Internally, the [`Rack::CommonLogger`][cl] component is used to generate
log messages.

[cl]: http://rack.rubyforge.org/doc/classes/Rack/CommonLogger.html

### `:method_override` - enable/disable the POST `_method` hack

Boolean specifying whether the HTTP POST `_method` parameter hack should be
enabled. When `true`, the actual HTTP request method is overridden by the
value of the `_method` parameter included in the POST body. The `_method`
hack is used to make POST requests look like other request methods (e.g.,
`PUT`, `DELETE`) and is typically only needed in shitty environments -- like
HTML form submission -- that do not support the full range of HTTP methods.

The POST `_method` hack is implemented by inserting the
[`Rack::MethodOverride`][mo] component into the middleware pipeline.

[mo]: http://rack.rubyforge.org/doc/classes/Rack/MethodOverride.html

### `:root` - The application's root directory

The directory used as a base for the application. By default, this is
assumed to be the directory containing the main application file
(`:app_file` option). The root directory is used to construct the default
`:public` and `:views` options. A common idiom is to set the `:root` option
explicitly in the main application file as follows:

    set :root, File.dirname(__FILE__)

### `:static` - enable/disable static file routes

Boolean that determines whether static files should be served from the
application's public directory (see the `:public` option). When `:static` is
truthy, Sinatra will check if a static file exists and serve it before
checking for a matching route.

The `:static` option is enabled by default in classic style apps and
disabled by default in `Sinatra::Base` subclasses.

### `:public` - static files directory

A string specifying the directory where static files should be served from.
By default, this is assumed to be a directory named "public" within the root
directory (see the `:root` option). You can set the public directory
explicitly with:

    set :public, '/var/www'

The best way to specify an alternative directory name within the root of the
application is to use a deferred value that references the `:root` option:

    set :public, Proc.new { File.join(root, "static") }

### `:views` - view template directory

A string specifying the directory where view templates are located.  By
default, this is assumed to be a directory named "views" within the
application's root directory (see the `:root` option). The best way to
specify an alternative directory name within the root of the application is
to use a deferred value that references the `:root` option:

    set :views, Proc.new { File.join(root, "templates") }

### `:run` - enable/disable the built-in web server

Boolean specifying whether the built-in web server is started after the app
is fully loaded. By default, this option is enabled only when the
`:app_file` matches `$0`.  i.e., when running a Sinatra app file directly
with `ruby myapp.rb`. To disable the built-in web server:

    set :run, false

### `:server` - handler used for built-in web server

String or Array of Rack server handler names. When the `:run` option is
enabled, Sinatra will run through the list and start a server with the
first available handler. The `:server` option is set as follows by default:

    set :server, %w[thin mongrel webrick]

### `:host` - server hostname or IP address

String specifying the hostname or IP address of the interface to listen on
when the `:run` option is enabled. The default value -- `'0.0.0.0'` -- causes
the server to listen on all available interfaces. To listen on the
loopback interface only, use:

    set :host, 'localhost'

### `:port` - server port

The port that should be used when starting the built-in web server when the
`:run` option is enabled. The default port is `4567`. To set the port
explicitly:

    set :port, 9494

### `:app_file` - main application file

The `:app_file` option is used to calculate the default `:root`,
`:public`, and `:views` option values. A common idiom is to override the
default detection heuristic by setting the `:app_file` explicitly from
within the main application file:

    set :app_file, __FILE__

It's also used to detect whether Sinatra should boot a web server when
using [classic-style](http://www.sinatrarb.com/extensions.html#background)
applications.

### `:dump_errors` - log exception backtraces to `STDERR`

Boolean specifying whether backtraces are written to `STDERR` when an
exception is raised from a route or filter. This option is enabled by
default in classic style apps. Disable with:

    set :dump_errors, false

### `:clean_trace` - scrub library entries from backtraces

When the `:clean_trace` option is enabled, library/framework entries are
removed from exception backtraces before being written to `STDERR`
(see `:dump_errors` option) or being displayed on the development mode
error page.

The `:clean_trace` option is enabled by default in all environments. Disable
it to get full exception backtraces:

    set :clean_trace, false

### `:raise_errors` - allow exceptions to propagate outside of the app

Boolean specifying whether exceptions raised from routes and filters should
escape the application. When disabled, exceptions are rescued and mapped to
error handlers which typically set a 5xx status code and render a custom
error page. Enabling the `:raise_errors` option causes exceptions to be
raised outside of the application where it may be handled by the server
handler or Rack middleware, such as [`Rack::ShowExceptions`][se] or
[`Rack::MailExceptions`][me].

[se]: http://rack.rubyforge.org/doc/classes/Rack/ShowExceptions.html
[me]: http://github.com/rack/rack-contrib/blob/master/lib/rack/contrib/mailexceptions.rb

The `:raise_errors` option is disabled by default for classic style apps
and enabled by default for `Sinatra::Base` subclasses.

### `:lock` - ensure single request concurrency with a mutex lock

Sinatra can be used in threaded environments where more than a single
request is processed at a time. However, not all applications and libraries
are thread-safe and may cause intermittent errors or general weirdness.
Enabling the `:lock` option causes all requests to synchronize on a mutex
lock, ensuring that only a single request is processed at a time.

The `:lock` option is disabled by default.
