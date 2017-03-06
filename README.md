Sinatra Website / Documentation
===============================

This repo contains the Sinatra website and documentation sources published
at [http://www.sinatrarb.com/](http://www.sinatrarb.com/).

Working Locally
---------------

Grab the sources from GitHub:

    $ git clone git://github.com/sinatra/sinatra.github.com.git
    $ cd sinatra.github.com

Make sure you have the `bundler` gem installed on your machine:

    $ gem install bundler

Install dependencies:

    $ bundle install

Run the test server:

    $ rake server

Changes are immediately available at:

    http://localhost:4000/sinatra.github.com/
    

    
Sass / CSS / Gulp
--------------

It would be appreciated if you could introduce your changes using the indented Sass syntax (.sass) in one of the existing Sass partials or if needed via new ones of your own. Not a friend of curlies and stuff.

Gulp was [set up](https://github.com/sinatra/sinatra.github.com/blob/master/gulpfile.js) to streamline your build process. Simply run:

    $ gulp watch

`gulp watch` triggers a couple of processes:
- After changes have been introduced in the `_sass` directory, it first builds uncompressed `.css` files from the corresponding `.sass` files and puts them into `/css/development`.
- Gulp also watches any changes made in the `/css/development` directory.
- In turn, any changes in `/css/development` will get compressed, prefixed and purified of any obsolete style declarations before being placed in their final destination at `/css`.
- Your site is reloaded automatically using Browsersync which watches any changes to `.css` files in `/css`. No need to install any additional gimmicks.

That means Gulp is configured so that you can either work on `.sass` files in the `/_sass` directory or on `.css` files directly in the `/css/development` directory. If you want to introduce changes in `/css/development`, you need to create new filenames to avoid being overwritten when new versions of Sass files get built.

Contributing
------------

See GitHub's ["Fork A Repo"](https://help.github.com/articles/fork-a-repo "Forking a project") for more information.

Creating Blog Posts
-------------------

Blog posts are stored under the `_posts` directory. To create a new blog post
and open your `$EDITOR`, use:

    thor blog:new 'Blog Post Title'

This requires Thor:

    $ gem install thor

Prebuilt Files
--------------

You will need thor, rdoc, haml and mislav's hanna gem to rebuild static files
and the API docs:

    $ gem install thor
    $ gem install rdoc -v 2.3.0
    $ gem install haml -v 2.0.4
    $ gem install mislav-hanna --source=http://gems.github.com/

The prebuilt file sources are maintained under the [sinatra](https://github.com/sinatra/sinatra) and
[sinatra-book](https://github.com/sinatra/sinatra-book) projects. To pull in the latest versions and build them:

    rake pull build

The generated files under the "_includes" and "api" directories need to be
committed after building. To regenerate and add those files to your index
for the next commit:

    rake regen
