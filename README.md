Sinatra Website / Documentation
===============================

This repo contains the Sinatra website and documentation sources published
at [http://sinatra.github.com/](http://sinatra.github.com/).

Working Locally
---------------

Grab the sources from GitHub:

    $ git clone git://github.com/sinatra/sinatra.github.com.git
    $ cd sinatra.github.com

Install dependencies:

    $ gem install jekyll
    $ gem install rdoc -v 2.3.0

Run the test server:

    $ jekyll serve --watch

Changes are immediately available at:

    http://localhost:4000

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
