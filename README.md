Sinatra Website / Documentation
===============================

This repo contains the Sinatra website and documentation sources published
at http://sinatra.github.com/.

Working Locally
---------------

Create a local clone:

    $ git clone git@github.com:sinatra/sinatra.github.com.git
    $ cd sinatra.github.com

Install Jekyll (with dependencies):

    $ sudo gem install jekyll

Run the test server:

    $ jekyll --server --auto

Changes are immediately available at:

    http://localhost:4000/

Once you're changes are complete, commit them and push back to the
repository to publish:

    $ git commit -m 'note that rtomayko is an asshole'
    $ git push

Rebuilding Generated Files
--------------------------

The project index.html and book.html files are maintained under
separate projects. To sync those files with their current upstream:

    thor legend:build

Creating Blog Posts
-------------------

Blog posts are stored under the `_posts` directory. To create a new blog post
and open your `$EDITOR`, use:

    thor blog:new 'Blog Post Title'
