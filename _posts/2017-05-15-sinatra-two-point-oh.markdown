---
layout: post
title: Sinatra Two Point Oh!
author: zzak
author_url: https://twitter.com/_zzak
publish_date: Monday, May 15, 2017
---

Today, I'm pleased to **FINALLY** announce that Sinatra 2.0 was **released**!

If you [haven't been following along](http://zzak.io/log/2016-04-18-the-road-to-sinatra-2.0.html), the major version bump includes a lot of changes significant to the future of the project.

In this post, you will see the full details including what's new, what's gone, and everything packed into the two point oh release.

Before we begin, I have to thank everyone who contributed, helped test pre-releases, and continues to use and support the project.

## Releases

Sinatra 2.0 includes the release of the following gems, and associated verions:

* `sinatra`: v2.0.0
* `sinatra-contrib`: v2.0.0
* `mustermann`: v1.0.0
* `mustermann-contrib`: v1.0.0
* `rack-protection`: v2.0.0

You can download all of these gems from [rubygems.org](https://rubygems.org).

## Major features

* Rack 2.0 support, Rack 1.x is no longer supported
* Ruby 2.2+ support, Ruby < 2.2 is no longer supported
* Sinatra router replaced with Mustermann
* Compatible with Rails 5! :trollface:

## Sinatra core

Many of you have been waiting since before the [Rails 5 release](http://weblog.rubyonrails.org/2016/6/30/Rails-5-0-final/), for a Sinatra 2.0 pre-release.

Before we get into the changes, I want to address something.

### Why 2.0 was delayed

First, there [was](https://github.com/sinatra/sinatra/issues/1135) a [ridiculous](https://github.com/sinatra/sinatra/issues/1123) number of [tickets](https://github.com/sinatra/sinatra/issues/1124) asking [for a release](https://github.com/sinatra/sinatra/issues/1115), so [many](https://github.com/sinatra/sinatra/issues/1117) that I [actually](https://github.com/sinatra/sinatra/issues/1071) lost [count](https://github.com/sinatra/sinatra/issues/1152) to be [honest](https://github.com/sinatra/sinatra/issues/1133).

Let me just say, thank you everyone for your patience and I hope that this release is worth the wait!

_To put it short._

When I took on the challenge of releasing Sinatra 2.0, my goal was to not only bump minimum dependency requirements -- but also make sure Sinatra is well maintained and provide the level of **class** people have come to expect from the project and it's [previous maintainer](https://github.com/rkh).


With that said, I hope the following features and changes that went into the release can live up to (not only mine) but everyone's expectations.

### Features

* Use Mustermann for patterns [PR](https://github.com/sinatra/sinatra/pull/1086) by [Konstantin Haase](https://github.com/rkh)
* Server now provides `-q` flag for quiet mode, which disables start/stop messages [PR](https://github.com/sinatra/sinatra/pull/1153) by [Vasiliy](https://github.com/304)
* Session middleware can now be specified with `:session_store` setting [PR](https://github.com/sinatra/sinatra/pull/1161) by [Jordan Owens](https://github.com/jkowens)
* `APP_ENV` is now preferred and recommended over `RACK_ENV` for setting environment [PR](https://github.com/sinatra/sinatra/pull/984) by [Damien Mathieu](https://github.com/dmathieu)
* Reel support [PR](https://github.com/sinatra/sinatra/pull/793) by [Patricio Mac Adden](https://github.com/patriciomacadden)


### Changes

The following notable changes are also included in this release.

* Make route params available during error handling [PR](https://github.com/sinatra/sinatra/pull/895) by [Jeremy Evans](https://github.com/jeremyevans)
* Unify `not_found` and `error` 404 behavior [PR](https://github.com/sinatra/sinatra/pull/896) by [Jeremy Evans](https://github.com/jeremyevans)
* Enable Ruby 2.3 `frozen_string_literal` feature [PR](https://github.com/sinatra/sinatra/pull/1076) by [Vladimir Kochnev](https://github.com/marshall-lee)
* Add Sinatra::ShowExceptions::TEMPLATE and patched Rack::ShowExceptions to prefer Sinatra template [commit](https://github.com/sinatra/sinatra/commit/57c2ebb854379fd28def61340ad0b35a8edea792) by [Zachary Scott](https://github.com/zzak)
* Sinatra::Runner is used internally for integration tests [PR](https://github.com/sinatra/sinatra/pull/840) by [Nick Sutterer](https://github.com/apotonick)
* Fix case-sensitivity issue in `uri` method [PR](https://github.com/sinatra/sinatra/pull/889) by [rennex](https://github.com/rennex)
* Use `Rack::Utils.status_code` to allow `status` helper to use symbol as well as numeric codes [PR](https://github.com/sinatra/sinatra/pull/968) by [Tobias H. Michaelsen](https://github.com/tobiashm)
* Improved error handling for invalid params through Rack [PR](https://github.com/sinatra/sinatra/pull/1070) by [Jordan Owens](https://github.com/jkowens)
* Ensure template is cached only once [PR](https://github.com/sinatra/sinatra/pull/1021) by [Patrik Rak](https://github.com/raxoft)
* Use same `session_secret` for classic and modular apps in development [PR](https://github.com/sinatra/sinatra/pull/1245) by [Marcus Stollsteimer](https://github.com/stomar)
* Improve Session Secret documentation to encourage better security practices [PR](https://github.com/sinatra/sinatra/pull/1218) by [Glenn Rempe](https://github.com/grempe)
* Exposed global and per-route options for Mustermann route parsing [PR](https://github.com/sinatra/sinatra/pull/1233) by [Mike Pastore](https://github.com/mwpastore)
* Capture exception messages of raised NotFound and BadRequest [PR](https://github.com/sinatra/sinatra/pull/1210) by [Mike Pastore](https://github.com/mwpastore)
* Add `:strict_paths` option for managing trailing slashes [PR](https://github.com/sinatra/sinatra/pull/1273) by [namusyaka](https://github.com/namusyaka)
* Add full IndifferentHash implementation to params [PR](https://github.com/sinatra/sinatra/pull/1279) by [Mike Pastore](https://github.com/mwpastore) and [PR](https://github.com/sinatra/sinatra/pull/1262) by [John Hope](https://github.com/JonMidhir)

Now let's take a look at the peripheral work that went into the release of Sinatra 2.0.


## Sinatra::Contrib

This gem provides a bunch of helpful extensions for common patterns that can be applied to your Sinatra application. Take a look at the [documentation](http://www.sinatrarb.com/contrib/) for a list of what you get.

The biggest change to the `sinatra-contrib` gem is that it is now bundled in the Sinatra source tree. [Ticket](https://github.com/sinatra/sinatra/issues/1145) by [Zachary Scott](https://github.com/zzak).

Since the release, if you install the gem though you shouldn't notice any difference. Alternitively you can install the gem from source, like so:

```
# Gemfile
github 'sinatra/sinatra' do
  gem 'sinatra-contrib'
end
```

This will fetch the [sinatra git source](https://github.com/sinatra/sinatra) and install the gem from the tree.

Also, we've consolidated the bug trackers, and you can now find `sinatra-contrib` related issues [under this label](https://github.com/sinatra/sinatra/labels/sinatra-contrib).

### Features

Here are the new features in `Sinatra::Contrib`.

* Sinatra::Contrib is now bundled in the Sinatra source tree [PR](https)
* Sinatra::ContentFor added `clear_content_for` method [PR](https://github.com/sinatra/sinatra-contrib/pull/152) by [Ben Darlow](https://github.com/kapowaz)
* Sinatra::Namespace support for Mustermann
    [PR](https://github.com/sinatra/sinatra-contrib/pull/207) by [Vasiliy](https://github.com/304)
    and [Jordan Owens](https://github.com/jkowens) [(PR)](https://github.com/sinatra/sinatra-contrib/pull/208)
* Sinatra::RequiredParams for permitting required query parameters [PR](https://github.com/sinatra/sinatra-contrib/pull/131) by [Daisuke Taniwaki](https://github.com/dtaniwaki)
* Sinatra::Runner [PR](https://github.com/sinatra/sinatra-contrib/pull/122) by [Nick Sutterer](https://github.com/apotonick)
* Sinatra::WebDAV [PR](https://github.com/sinatra/sinatra-contrib/pull/143) by [Yegor Timoshenko](https://github.com/yegortimoshenko)
  Originally submitted by [Mark Bates](https://github.com/markbates)
* Sinatra::Reloader added `after_reload` hook which allows manual reload changes when triggered
  [PR](https://github.com/sinatra/sinatra/pull/1150) by [Jhimy Fernandes Villar](https://github.com/stjhimy)


### Changes

And the following notable changes that went into the release.

* Migrate specs to RSpec 3.4 [PR](https://github.com/sinatra/sinatra-contrib/pull/203) by [Jhimy Fernandes Villar](https://github.com/stjhimy)
* Sinatra::ConfigFile allow ERB syntax in YML files [PR](https://github.com/sinatra/sinatra-contrib/pull/199) by [Jhimy Fernandes Villar](https://github.com/stjhimy)
* Sinatra::ContentFor renders given block if specified key is not found
  [PR](https://github.com/sinatra/sinatra-contrib/pull/121) by [Micah Redding](https://github.com/micahredding)
* Sinatra::ContentFor can yield an immediate value, similar to ActionView [PR](https://github.com/sinatra/sinatra-contrib/pull/170) by [Ryo Nakamura](https://github.com/r7kamura)
* Sinatra::LinkHeader to use ",\n" (comma, new-line) as delimiter [PR](https://github.com/sinatra/sinatra-contrib/pull/193) by [petedmarsh](https://github.com/petedmarsh)
* Sinatra::Namespace allow using `redirect_to` in a namespace [PR](https://github.com/sinatra/sinatra-contrib/pull/180) by [Jhimy Fernandes Villar](https://github.com/stjhimy)
* Sinatra::RespondWith swallow exception from `Tilt` on `LoadError` for missing template [PR](https://github.com/sinatra/sinatra-contrib/pull/175) by [Matt Austin](https://github.com/maafy6)
* Sinatra::RespondWith now raises a 500 error if formatting fails [commit](https://github.com/sinatra/sinatra-contrib/commit/fe860ecbbfdb38da39d01b2b3ffc081e20e4eb8f)
* Make Rack::Test a development dependency [PR](https://github.com/sinatra/sinatra/pull/1232) by [Mike Pastore](https://github.com/mwpastore)
* Add explicit set method to contrib/cookies to override cookie settings [PR](https://github.com/sinatra/sinatra/pull/1240) by [Andrew Allen](https://github.com/allenan)
* Avoid executing filters even if prefix matches with other namespace [PR](https://github.com/sinatra/sinatra/pull/1253) by [namusyaka](https://github.com/namusyaka)

### Removals

* Sinatra::Decompile is no longer necessary after added Mustermann support [commit](https://github.com/sinatra/sinatra/commit/3c96ef05ea7a9487eabc5d4da466919bc411aa1b) by [Zachary Scott](https://github.com/zzak)

For full details, [compare the pre-merged diff](https://github.com/sinatra/sinatra-contrib/compare/v1.4.7...fe860ec) and [milestone](https://github.com/sinatra/sinatra-contrib/milestone/3).


## Rack::Protection

This gem is designed to provide several middleware for protecting your applications against common web attacks. Take a look at the [documentation](http://www.sinatrarb.com/rack-protection/) for more information.

The biggest change to the `rack-protection` gem is that it is now bundled in the Sinatra source tree. [PR](https://github.com/sinatra/sinatra/pull/1167) by [Zachary Scott](https://github.com/zzak).

Although I must admit, [this](https://github.com/sinatra/sinatra/issues/1149) change [wasn't](https://github.com/sinatra/sinatra/issues/1110) without [pitfalls](https://github.com/sinatra/sinatra/issues/1163), I apologize to everyone affected during the transition time.

Since the release, if you install the gem though you shouldn't notice. Alternitively you can install the gem from source, like so:

```
# Gemfile
github 'sinatra/sinatra' do
  gem 'rack-protection'
end
```

This will fetch the [sinatra git source](https://github.com/sinatra/sinatra) and install the gem from the tree.

Also, we've consolidated the bug trackers, and you can now find `rack-protection` related issues [under this label](https://github.com/sinatra/sinatra/labels/rack-protection).

### Features

Here are the new features in `Rack::Protection`

* Rack::Protection::ContentSecurityPolicy [PR](https://github.com/sinatra/rack-protection/pull/75) by [Christian Meier](https://github.com/mkristian) with Level 2 and 3 Directives in [PR](https://github.com/sinatra/sinatra/pull/1202) by [Glenn Rempe](https://github.com/grempe)
* Rack::Protection::HttpOrigin and AuthenticityToken added `:allow_if` option to specify allowable urls [PR](https://github.com/sinatra/rack-protection/pull/108) by [Nathan Stitt](https://github.com/nathanstitt)
* Rack::Protection::CookieTossing [PR](https://github.com/sinatra/rack-protection/pull/113) by [Jordan Owens](https://github.com/jkowens)
* Rack::Protection::AuthenticityToken prevent BREACH attack [PR](https://github.com/sinatra/sinatra/pull/1171) by [Jordan Owens](https://github.com/jkowens)
* Added `:without_session` option to initializer to easily skip session-based protections [commit](https://github.com/sinatra/sinatra/commit/46b1d85aee1461dff5d9893e61553020729bbf92) by [Zachary Scott](https://github.com/zzak)

### Changes

Along with the following notable changes that went into the release.

* Migrate spaces to RSpec 3 [PR](https://github.com/sinatra/rack-protection/pull/87) by [Maurizio De Santis](https://github.com/mdesantis)
* Rack::Protection::StrictTransport [PR](https://github.com/sinatra/rack-protection/pull/105) by [Maciej Moleda](https://github.com/maciekm)
* Rack::Protection::JsonCsrf closes body on prevented attack [PR](https://github.com/sinatra/rack-protection/pull/78) by [Konstantin Haase](https://github.com/rkh)
* Use Rack::Utils.secure_compare when checking CSRF tokens [commit](https://github.com/sinatra/rack-protection/commit/d8068e872b0f19ef9de25265552cb1b835270901) by [Andreas Karlsson](https://github.com/jeltz)
* Rack::Protection::EscapedParams ensures Tempfile is untouched [PR](https://github.com/sinatra/rack-protection/pull/99) by [Albert Engelbrecht](https://github.com/droppedoncaprica)
* Adds preload option to Rack:Protection:StrictTransport [PR](https://github.com/sinatra/sinatra/pull/1209) by [Ed Robinson](https://github.com/errm)
* Add `allow_if` option to bypass json csrf protection [PR](https://github.com/sinatra/sinatra/pull/1265) by [Jordan Owens](https://github.com/jkowens)

For full details, [compare the pre-merged diff](https://github.com/sinatra/rack-protection/compare/v1.5.3...7e723a7).


## Mustermann

Mustermann is a powerful library with many features and compatible `params` parsing interface. It will replace the existing router in Sinatra for version 2.0.

Take a look at the [documentation](http://www.sinatrarb.com/mustermann/) for more information.

Apart from the features and changes to the core of `Mustermann`, which I will list below, the biggest change in the first stable release is organizational.

* `mustermann-everything` gem is deprecated
* `mustermann-contrib` has replaced it, including all non-core extensions

Please check the [PR](https://github.com/sinatra/mustermann/pull/53) for the full list of included plugins, but I hope this change will make maintaining and releasing Mustermann much simpler from now on.

### Features

Here are the latest features in `Mustermann` version 1.0.

* Rails patterns: Add Rails 5.0 compatibility mode, make it default. [commit](https://github.com/sinatra/mustermann/commit/50ae34b84a6ee5ce8936e908e0076782d4a45c86) by [Konstantin Haase](https://github.com/rkh)
* Add concatenation support (`Mustermann::Pattern#+`). [commit](https://github.com/sinatra/mustermann/commit/500a603fffe0594ab842d72addcc449eedd6d5be) by [Konstantin Haase](https://github.com/rkh)
* Mustermann::Grape [PR](https://github.com/sinatra/mustermann/pull/46) by [namusyaka](https://github.com/namusyaka)
* Implement shorthand for ({foo}|{bar}) pattern [PR](https://github.com/sinatra/mustermann/pull/43) by [namusyaka](https://github.com/namusyaka)
* Sinatra patterns: Allow `|` outside of parens [commit](https://github.com/sinatra/mustermann/commit/fb2026197b013828e90a53169c0379bb1d30a66d) by [Konstantin Haase](https://github.com/rkh)
* `Mustermann::Sinatra#|` may now generate a Sinatra pattern instead of a real composite [commit](https://github.com/sinatra/mustermann/commit/1962330cb73d334258e0088debcef406747cf5af) by [Konstantin Haase](https://github.com/rkh)

### Changes

Along with the following notable changes that went into the release.

* Moved non-core extensions to meta `mustermann-contrib` gem [PR](https://github.com/sinatra/mustermann/pull/53) by [Zachary Scott](https://github.com/zzak)
* Move Tool::EqualityMap from `tool` gem to Mustermann::EqualityMap [PR](https://github.com/sinatra/mustermann/pull/49) by [Michael Stock](https://github.com/mikeastock)
* Remove routers (they were out of scope for the main gem). [commit](https://github.com/sinatra/mustermann/commit/387b1f8a6a76594a0025421e85f4f2c957e28b66) by [Konstantin Haase](https://github.com/rkh)

For the full details, [compare the diff](https://github.com/sinatra/mustermann/compare/v0.4.0...0d25e09).


## Wrapping up

In the end, there's still more work to be done on the project and a bright future ahead.

At the time of writing this, there are almost [30 open issues](https://github.com/sinatra/sinatra/issues) and about [10 pull requests](https://github.com/sinatra/sinatra/pulls).

There are a number of places where Sinatra could improve, and although I've added a number of tickets for features, I'd like to end this by briefly listing some of these areas specifically.

### Logging

Currently, Sinatra uses `Rack::Logger` middleware under the hood with a little bit extra.

This logger is [barebones](https://github.com/rack/rack/blob/master/lib/rack/logger.rb), and I'm sure we could build a much nicer logging API by ourselves that would prove more useful for dealing with production services.


### Streaming

There have been a [number](https://github.com/sinatra/sinatra/issues/1035) of [discussions](https://github.com/sinatra/sinatra/pull/1114) on streaming, but I feel this is something that could definitely be improved.

While, there are some [missing features](https://github.com/sinatra/sinatra/issues/1140) mentioned, when this API was originally implemented Rack's hijack api was [still unfinished](https://github.com/sinatra/sinatra/issues/604).

I don't exactly know the best route for this, but probably start with something in the Rack layer -- like is [already being discussed](https://github.com/rack/rack/issues/1093). Then we can provide an API on top of that inside Sinatra's DSL. For added bonus, we could wrap something like [Sinatra::Streaming](http://www.sinatrarb.com/contrib/streaming.html) to make it really nice.


### Exception Handling

The current implementation for error handling comes down to ["handle\_exception!"](https://github.com/sinatra/sinatra/blob/8c2504c/lib/sinatra/base.rb#L1123-L1155).

This method to me looks like it's begging for a refactor, and just the cause of a bad API design (sorry).

What I mean is, it could definitely be improved, and maybe it's "bad design" but hey it works! Right!

Also take a look at ["error\_block!"](https://github.com/sinatra/sinatra/blob/8c2504c/lib/sinatra/base.rb#L1157-L1171) and ["dump\_errors!"](https://github.com/sinatra/sinatra/blob/8c2504c/lib/sinatra/base.rb#L1173-L1176).. **what!**

All of this along with a middleware, called ["ShowExceptions"](https://github.com/sinatra/sinatra/blob/master/lib/sinatra/show_exceptions.rb), for displaying errors both/either in plain-text and/or html.


### Wait there's more!

Without going into too much detail, route dispatch (including before/after filters) needs work. As well, [@rkh](https://github.com/rkh) has mentioned wanting to improve the [Template](https://github.com/sinatra/sinatra/blob/8c2504c/lib/sinatra/base.rb#L650-L889) API.

There is also stuff like an implementation of ["indifferent\_params" and "indifferent\_hash"](https://github.com/sinatra/sinatra/blob/8c2504c/lib/sinatra/base.rb#L1069-L1085), that could be upstreamed in Ruby.

At any rate, there's more than a few things here as well as [**a number of great ideas from @rkh himself**](https://gist.github.com/rkh/468571242a544df5eeb5) that should keep us busy for a while.


### Briefly about deprecations

One thing I want to say before I end this post, _please please please pleeeease_:

**Do not send PRs to remove deprecations or unfactored code without good reason.**

I won't consider any changes like this until we start thinking about `version 2.1`.


### Thank you

At any rate, I hope that Sinatra 2.0 is everything you hoped for and more, and apologize if your patch or bug wasn't included in the release.

Thank you everyone who has contributed over the years to this project, and continues to ensure it lives on.

In the words of the great Nat King Cole, [you're unforgettable](https://www.youtube.com/watch?v=Fy_JRGjc1To).



