---
title: "Sinatra: Contribute"
layout: default
---

# Contribute

Want to show Sinatra some love? Help out by contributing!

## Find a bug?

Log it in our [issue tracker][ghi] or send a note to
the [mailing list][ml]. Be sure to include all relevant information, like
the versions of Sinatra and Ruby you're using. A [gist](http://gist.github.com/)
of the code that caused the issue as well as any error messages are also very
helpful.

## Need help?

The [Sinatra mailing list][ml] has over 800 subscribers, many of which are happy
to help out newbies or talk about potential feature additions. You can also drop
by the [#sinatra](irc://chat.freenode.net/#sinatra) channel on
[irc.freenode.net](http://freenode.net).

## Have a patch?

Bugs and feature requests that include patches are much more likely to
get attention. Here are some guidelines that will help ensure your patch
can be applied as quickly as possible:

1. **Use [Git](http://git-scm.com) and [GitHub](http://github.com):**
   The easiest way to get setup is to fork the
   [sinatra/sinatra repo](http://github.com/sinatra/sinatra/).
   Or, the [sinatra.github.com repo](http://github.com/sinatra/sinatra.github.com/),
   if the patch is doc related.

2. **Write unit tests:** If you add or modify functionality, it must
   include unit tests. If you don't write tests, we have to, and this
   can hold up acceptance of the patch.

3. **Mind the `README`:** If the patch adds or modifies a major feature,
   modify the `README.rdoc` file to reflect that. Again, if you don't
   update the `README`, we have to, and this holds up acceptance.

4. **Push it:** Once you're ready, push your changes to a topic branch
   and add a note to the ticket with the URL to your branch. Or, say
   something like, "you can find the patch on johndoe/foobranch". We also
   gladly accept Github [pull requests](http://help.github.com/pull-requests/).

__NOTE:__ _we will take whatever we can get._ If you prefer to
attach diffs in emails to the mailing list, that's fine; but do know
that _someone_ will need to take the diff through the process described
above and this can hold things up considerably.

## Want to write docs?

The process for contributing to Sinatra's website, documentation or the book
is the same as contributing code. We use git for versions control and
GitHub to track patch requests.

* [The sinatra.github.com repo](http://github.com/sinatra/sinatra.github.com/)
  is where the website sources are managed. There are almost always people in
  `#sinatra` that are happy to discuss, apply, and publish website patches.

* [The Book](book.html) has its own [git repository](http://github.com/sinatra/sinatra-book/)
  and build process but is managed the same as the website and project
  codebase.

* [The Introduction](intro.html) is generated from Sinatra's
  [README file](http://github.com/sinatra/sinatra/blob/master/README.rdoc).

* If you want help translating the documentation, there already are a
  [Japanese](http://github.com/sinatra/sinatra/blob/master/README.jp.rdoc)
  and a [German](http://github.com/sinatra/sinatra/blob/master/README.de.rdoc)
  version of the README, which regularly tend to fall behind the English
  version.

## Looking for something to do?

If you'd like to help out but aren't sure how, pick something that looks
interesting from the [issues][ghi] list and hack on. Make sure to leave a
comment on the ticket noting that you're investigating (a simple "Taking..."
is fine).

[hp]: http://sinatra.lighthouseapp.com/projects/9779-sinatra/tickets/bins/13046
[ghi]: http://github.com/sinatra/sinatra/issues
[ml]: http://groups.google.com/group/sinatrarb/topics "Sinatra Mailing List"
