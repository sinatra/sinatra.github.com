---
title: 'Sinatra: Writing Extensions'
layout: default
id: extensions
---

Writing Extensions
==================

Sinatra includes an API for extension authors to help ensure that
consistent behavior is provided for application developers.

Background
----------

Some knowledge of Sinatra's internal design is required to write good
extensions. This section provides a high level overview of the classes and
idioms at the core of Sinatra's design.

Sinatra has two distinct modes of use:

 1. The "Classic" style, where applications are defined on main / the
    top-level. Most of the examples and documentation target this usage.
    Classic applications are often single-file, standalone apps that are run
    directly from the command line or with a minimal rackup file.

 2. The "Modular" style, where `Sinatra::Base` is subclassed explicitly and
    the application is defined within the subclass's scope. These
    applications are often bundled as libraries and used as components
    within a larger Rack-based system.

Most extensions are relevant to both styles. However, care must be taken to
ensure that extensions do the right thing under each style. The extension
API is provided to help extension authors with this task.

### `Sinatra::Base`

The `Sinatra::Base` class provides the context for all evaluation in a
Sinatra application. Applications are _defined_ within the class scope of a
`Sinatra::Base` class. The "DSL" (e.g., `get`, `post`, `before`,
`configure`, `set`, etc.) is simply a set of class methods defined on
`Sinatra::Base`. Extending the DSL is achieved by adding class methods to
`Sinatra::Base`.

Requests are evaluated within a new Sinatra::Base instance -- routes, before
filters, views, helpers, and error pages all share this same context. The
default set of request-level helper methods (e.g, `erb`, `haml`, `halt`,
`content_type`, etc.) are simple instance methods defined on `Sinatra::Base`
or within modules that are included in `Sinatra::Base`. Providing new
functionality at the request level is achieved by adding instance methods to
`Sinatra::Base`.

### `Sinatra::Default` and `Sinatra::Application`

The `Sinatra::Default` class provides the default execution context for
_classic style applications_. It is a simple subclass of `Sinatra::Base`
that provides default option values and other behavior tailored for
top-level apps. Extensions are free to modify this class directly when they
are loaded.

When a classic style application is run, a new `Sinatra::Default` subclass
is created at `Sinatra::Application` and the public class methods are
exported to the top-level.

Rules for Extensions
--------------------

 1. Never modify `Sinatra::Base` directly. You should not include or extend,
    change option values, or modify its behavior elsewise. Modular style
    applications will include your extension in their subclass explicitly.

 2. _Do_ modify `Sinatra::Default` when your extension is loaded. If the
    extension was required, it's safe to assume that the functionality it
    provides should be made available to classic style applications without
    any additional action on the part of the user.

 3. Never `require 'sinatra'` in your extension. You should only ever need
    to `require 'sinatra/base'`. (The reason for this is that `require
    'sinatra'` is what triggers the classic style and extensions should
    never trigger the classic style.)

 4. Use the APIs described below where possible. You should not need to
    include or extend modules directly or define methods directly on a core
    Sinatra class. The specialized methods below handle all of that for you.

Extending The Request Context with `Sinatra.helpers`
----------------------------------------------------

The most common type of extension is one that adds methods for
use in routes, views, and helper methods.

For example, suppose you wanted to write an extension that added
an `h` method that escaped reserved HTML characters (such as
those found in other popular Ruby web frameworks).

    require 'sinatra/base'

    module Sinatra
      module HTMLEscapeExtension
        def h(text)
          Rake::Utils.escape_html(text)
        end
      end

      helpers HTMLEscapeExtension
    end

The call to `Sinatra.helpers` includes the module in
`Sinatra::Default`, making all methods defined in the module
available to classic style applications. Using this extension in
classic style apps is a simple as requiring the extension and
using the new method:

    require 'sinatra'
    require 'sinatra/htmlescape'

    get "/hello" do
      h "1 < 2"     # => "1 &lt; 2"
    end

`Sinatra::Base` subclasses must include the module explicitly:

    require 'sinatra/base'
    require 'sinatra/htmlescape'

    class HelloApp < Sinatra::Base
      helpers Sinatra::HTMLEscapeExtension

      get "/hello" do
        h "1 < 2"
      end
    end

Extending The DSL (class) Context with `Sinatra.register`
---------------------------------------------------------

Extensions can also extend Sinatra's class level DSL.

    require 'sinatra/base'

    module Sinatra
      module DiggBlocker
        def block_digg
          before {
            halt 403, "Go Away!" if request.referer == 'digg.com'
          }
        end
      end

      register DiggBlocker
    end

The `Sinatra.register` method adds all public methods in the module
specified as class methods on `Sinatra::Default`. It also handles exporting
public methods to the top-level when classic style apps are executed.

A classic style application might use this extension as follows:

    require 'sinatra'
    require 'sinatra/diggblocker'

    block_digg

    get '/' do
      "Hello World"
    end

Modular style applications must register the extension explicitly in their
`Sinatra::Base` subclasses:

    require 'sinatra/base'
    require 'sinatra/diggblocker'

    class Hello < Sinatra::Base
      register Sinatra::DiggBlocker

      block_digg

      get '/' do
        "Hello World"
      end
    end

Building and Packaging Extensions
---------------------------------

Sinatra extensions should be built as separate libraries
packaged as gems or as single files that can included within an
application's `lib` directory. The ideal process for using an
extensions is installing a gem and requiring a single file.

The following is an example file layout for a typical extension
packaged as a gem:

    sinatra-fu
    |-- README
    |-- LICENSE
    |-- Rakefile
    |-- lib
    |   `-- sinatra
    |       `-- fu.rb
    |-- test
    |   `-- spec_sinatra_fu.rb
    `-- sinatra-fu.gemspec


