---
title: Testing Sinatra
layout: default
---

## Testing

The Sinatra::Test module includes a variety of helper methods for testing
your Sinatra app. Sinatra includes support for Test::Unit, test-spec,
RSpec, and Bacon through separate source files.

### Test::Unit
    require 'sinatra'
    require 'sinatra/test/unit'
    require 'my_sinatra_app'

    class MyAppTest < Test::Unit::TestCase
      def test_my_default
        get '/'
        assert_equal 'My Default Page!', @response.body
      end

      def test_with_agent
        get '/', :env => { :agent => 'Songbird' }
        assert_equal 'You're in Songbird!', @response.body
      end

      ...

    end

### Test::Spec

Install the test-spec gem and require <tt>'sinatra/test/spec'</tt> before
your app:

    require 'sinatra'
    require 'sinatra/test/spec'
    require 'my_sinatra_app'

    describe 'My app' do
      it 'should show a default page' do
        get '/'
        should.be.ok
        body.should.equal 'My Default Page!'
      end

      ...

    end

### RSpec

Install the rspec gem and require <tt>'sinatra/test/rspec'</tt> before your
app:

    require 'sinatra'
    require 'sinatra/test/rspec'
    require 'my_sinatra_app'

    describe 'My app' do
      it 'should show a default page' do
        get '/'
        @response.should be_ok
        @response.body.should == 'My Default Page!'
      end

      ...

    end

### Bacon

    require 'sinatra'
    require 'sinatra/test/bacon'
    require 'my_sinatra_app'

    describe 'My app' do
      it 'should be ok' do
        get '/'
        should.be.ok
        body.should == 'Im OK'
      end
    end

See Sinatra::Test for more information on <tt>get</tt>, <tt>post</tt>, <tt>put</tt> and friends.

