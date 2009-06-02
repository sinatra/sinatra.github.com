---
title: "Sinatra: Extensions in the Wild"
layout: default
---

Extensions in the Wild
======================

Extensions provide helper or class methods for Sinatra applications.
These methods are customarily listed and described on extensions home
pages.

Before we use a method provided by the particular an extension, the
gem which implements it has to be installed. For
example, to install the *sinatra-prawn* gem available from the
*github.com*, type and run the following command:

    gem install sbfaulkner-sinatra-prawn -s http://gems.github.com

where `sbfaulkner` is the login of the extension author.

To use the above extension in a Sinatra application, the following
lines needs to be inserted into the application code:

    gem 'sbfaulkner-sinatra-prawn'
    require 'sinatra/prawn'

We can take advantage of
[RubyGems](http://www.rubygems.org/read/chapter/4) ability to use
versioned libraries at runtime:

    gem 'sbfaulkner-sinatra-prawn', '~>0.9.0'

We request the latest installed version of *sinatra-prawn* gem
in the 0.9.x series. If no such gem is installed, an exception is thrown.

If the most current version is not appropriate we can ask for specific
one we need:

    gem 'sbfaulkner-sinatra-prawn', '=0.9.1'

Note, that we require *sinatra/prawn* rather than *sbfaulkner-sinatra-prawn*.

## Extensions which provide helper methods

1. [sinatra-prawn](http://github.com/sbfaulkner/sinatra-prawn/)
   adds support for pdf rendering with Prawn templates.
1. [sinatra-markaby](http://github.com/sbfaulkner/sinatra-markaby/)
   enables rendering of html files using markaby templates.
1. [sinatra-maruku](http://github.com/wbzyl/sinatra-maruku/)
   provides Maruku templates for a Sinatra application.
1. [sinatra-rdiscount](http://github.com/wbzyl/sinatra-rdiscount/)
   provides RDiscount templates for a Sinatra application.
1. [sinatra-content-for](http://github.com/foca/sinatra-content-for/)
   provides `content_for` helper similar to Rails one.
1. [sinatra-url-for](http://github.com/emk/sinatra-url-for/)
   construct absolute paths and full URLs to actions
   in a Sinatra application
1. [sinatra-static-assets](http://github.com/wbzyl/sinatra-static-assets/)
   implements `image_tag`, `stylesheet_link_tag`, `javascript_script_tag`
   and `link_tag` helpers. These helpers construct correct absolute paths
   for applications dispatched to sub URI.

## Extensions which provide class methods

There are none available at the moment, except examples described
in [Writing Extensions](extensions.html).
