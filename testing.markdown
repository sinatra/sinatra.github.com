---
title: Testing with Sinatra
layout: default
---

Testing with Sinatra
====================

The `Sinatra::Test` module includes a variety of helper methods
to test your app.

As of version `0.9.1`, Sinatra does not provides any testing
framework-specific helpers anymore. Those found in `sinatra/test/*.rb`
are deprecated and will be removed in Sinatra `1.0`.

However, this document explains how to install Sinatra's test helpers
intro a variety of testing frameworks.

Install it
----------

### [Test::Unit][] and [Test::Spec][]

    require 'test/unit' # or test/spec
    require 'sinatra/test'

    Sinatra::Default.set :environment, :test
    require 'app'

    class Test::Unit::TestCase
      include Sinatra::Test
    end


### [RSpec][]

Only the stuff that needs to be required change:

    require 'spec'
    require 'spec/interop/test'
    require 'sinatra/test'

    ...

### [Bacon][]

    require 'bacon'
    require 'sinatra/test'

    Sinatra::Default.set :environment, :test
    require 'app'

    class Bacon::Context
      include Sinatra::Test
    end

<!-- TODO: Webrat -->

Use it
------

To be as general as possible, these examples assume `Test::Unit` is being used.

*NOTE:* There are plenty of apps [in the wild][wild] that are using other
testing frameworks.

## app.rb

    require 'sinatra'

    get '/' do
      "Hello #{params[:name]}"
    end

## test/test\_helpers.rb

    require 'test/unit'
    require 'sinatra/test'

    Sinatra::Default.set :environment, :test
    require 'app'

    class Test::Unit::TestCase
      include Sinatra::Test
    end

## test/app\_test.rb

    require File.dirname(__FILE__) + '/test_helper'

    class MyAppTest < Test::Unit::TestCase
      get test_it_says_hello
        get '/', :name => 'Ryan "Middleware" Tomayko'
        assert body.include?("Middleware")
      end
    end

<!-- TODO: document usage of get, post etc -->

See [Sinatra::Test][] and the [accompagning tests][test] for more information
on `get`, `post`, `delete` and friends.

[Test::Unit]: http://www.ruby-doc.org/stdlib/libdoc/test/unit/rdoc/classes/Test/Unit.html
[RSpec]: http://rspec.info
[Bacon]: http://github.com/chneukirchen/bacon
[Test::Spec]: http://rubyforge.org/projects/test-spec/
[Sinatra::Test]: http://github.com/sinatra/sinatra/blob/HEAD/lib/sinatra/test.rb
[test]: http://github.com/sinatra/sinatra/blob/HEAD/test/test_test.rb
[wild]: /wild.html
