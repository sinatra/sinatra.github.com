---
title: "Sinatra: Using Extensions"
layout: default
---

Using Extensions
================

Extensions provide helper or class methods for Sinatra applications.
These methods are customarily listed and described on extensions home
pages, many of which are listed below.

Using an extension is usually as simple as installing a gem or library
and requiring a file. Consult these steps if you run into problems:

  1. Install the gem or vendor the library with your project:
     `gem install sinatra-prawn`

  2. Require the extension in your application: `require 'sinatra/prawn'`

  3. If you're application is "classic" (i.e., you `require 'sinatra'` and
     define the application in the main/top-level context), you're done.
     The extension methods should be available to your application.

  4. If you're application subclasses `Sinatra::Base`, you have to register the
     extension in your subclass: `register Sinatra::Prawn`

## Helper Extensions

These extensions add helper methods to the request context:

1. [sinatra-prawn](http://github.com/sbfaulkner/sinatra-prawn/)
   adds support for pdf rendering with Prawn templates.
1. [sinatra-markaby](http://github.com/sbfaulkner/sinatra-markaby/)
   enables rendering of html files using markaby templates.
1. [sinatra-maruku](http://github.com/wbzyl/sinatra-maruku/)
   provides Maruku templates for a Sinatra application.
1. [sinatra-rdiscount](http://github.com/wbzyl/sinatra-rdiscount/)
   provides RDiscount templates for a Sinatra application.
1. [sinatra-effigy](http://github.com/dancroak/sinatra-effigy/)
   provides Effigy templates and views for a Sinatra application.
1. [sinatra-content-for](http://github.com/foca/sinatra-content-for/)
   provides `content_for` helper similar to Rails one.
1. [sinatra-url-for](http://github.com/emk/sinatra-url-for/)
   construct absolute paths and full URLs to actions
   in a Sinatra application
1. [sinatra-static-assets](http://github.com/wbzyl/sinatra-static-assets/)
   implements `image_tag`, `stylesheet_link_tag`, `javascript_script_tag`
   and `link_tag` helpers. These helpers construct correct absolute paths
   for applications dispatched to sub URI.
1. [sinatra-mapping](http://github.com/hallison/sinatra-mapping/)
   implements `map` in the DSL syntax commands which creates dynamically
   `mapname_path` method.
1. [sinatra\_more](http://github.com/nesquena/sinatra_more) Library with agnostic generators,
   form builders, named route mappings, easy mailer support among other functionality.
1. [sinatra-authorization](http://github.com/integrity/sinatra-authorization)
   HTTP auth helpers

## DSL Extensions

These extensions add methods to Sinatra's application DSL:

1. [snap](http://github.com/bcarlso/snap/)
   provides support for named routes and helper methods for building URLs for
   use in links and redirects.

## Extensions which handle setup and configuration

1. [sinatra-mongoid](http://github.com/dancroak/sinatra-mongoid)
   sets up a MongoDB connection, provides Mongoid to your app, and
   provides options for configuration.

Add more! See [Writing Extensions](extensions.html) for more information
about creating your own.
