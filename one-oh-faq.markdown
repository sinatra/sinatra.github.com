---
title: "Sinatra 1.0 FAQ"
layout: default
---

Sinatra 1.0 Frequently Asked Questions
======================================

Sinatra is going 1.0. Here are some things you should know:

## Is Sinatra 1.0 a rewrite / major conceptual overhaul?

No. Sinatra 1.0 is very much the same codebase as the current stable
0.9.x release. The largest changes are internal - we're dropping the
backward compatibility module and test suite that's been maintained
since the 0.3 release. The majority of obsoleted features are simple
class/method name changes that have been documented for some time. Very
few features have been removed in their entirety.

Some new features will be introduced.

## Will my existing Sinatra app work with 1.0? How can I check?

If you've kept up with deprecations and use officially documented
features, your app should be fine under Sinatra 1.0.

The latest Sinatra 0.9.x release includes comprehensive deprecation
warnings for all incompatibilities introduced in Sinatra 1.0. Run your
test suite and app under 0.9.x and watch for warnings on standard error.
When no more deprecation warnings remain, upgrade your staging
environment to Sinatra 1.0 and verify that stuff works.

## Can I install and run under Sinatra 1.0 today?

Sinatra 1.0 has not been officially released yet but you can run off
of the `master` branch:

    git clone git://github.com/sinatra/sinatra.git
    RUBYLIB="$(pwd)/sinatra/lib"

We expect to make pre-release gems available some time before the
official 1.0 release.

## What incompatibilities are being introduced in Sinatra 1.0?

The following is a comprehensive list of features obsoleted in the
1.0 release. All of these have been deprecated for some time:

 * The `sinatra/test` library is obsolete. This includes the
   `Sinatra::Test` module, the `Sinatra::TestHarness` class,
   and the `get_it`, `post_it`, `put_it`, `delete_it`, and `head_it`
   helper methods.  The
   [`Rack::Test` library](http://gitrdoc.com/brynary/rack-test) should
   be used instead.

 * Test framework specific libraries (`sinatra/test/spec`,
   `sinatra/test/bacon`,`sinatra/test/rspec`, etc.) are obsolete.
   See http://www.sinatrarb.com/testing.html for instructions on
   setting up a testing environment under each of these frameworks.

 * Auto-requiring template libraries in the `erb`, `builder`, `haml`,
   and `sass` methods is obsolete due to thread-safety issues. You must
   require the template libraries explicitly in your app.

 * The `:views_directory` option to rendering methods is obsolete; use
   `:views` instead.

 * The `:haml` and `:sass` options to rendering methods are obsolete.
   Template engine options should be passed in the second Hash argument
   instead.

 * The `media_type` helper method is obsolete. Use `mime_type` instead.

 * The request-level `send_data` method is no longer supported.

 * The `Sinatra::Event` and `Sinatra::EventContext` classes are no longer
   supported. This may effect extensions written for versions prior to 0.9.2.
   See [Writing Sinatra Extensions](http://www.sinatrarb.com/extensions.html)
   for the officially supported extensions API.

 * The `set_option` and `set_options` methods are obsolete; use `set`
   instead.

 * The `:env` setting (`settings.env`) is obsolete; use `:environment`
   instead.

 * The request level `stop` method is obsolete; use `halt` instead.

 * The request level `entity_tag` method is obsolete; use `etag`
   instead.

 * The request level `headers` method (HTTP response headers) is obsolete;
   use `response['Header-Name']` instead.

 * `Sinatra.application` is obsolete; use `Sinatra::Application` instead.

 * Using `Sinatra.application = nil` to reset an application is obsolete.
   This should no longer be necessary.

 * Using `Sinatra.default_options` to set base configuration items is
   obsolete; use `Sinatra::Base.set(key, value)` instead.

 * The `Sinatra::ServerError` exception is obsolete. All exceptions raised
   within a request are now treated as internal server errors and result in
   a 500 response status.

## How will versions be handled in the 1.x series?

All 1.x releases will be backward compatible with the initial
1.0 release.

This is one of the reasons we've waited so long to do an official 1.0
release. We're required not to break anything shipped in 1.0 for a very
long time, so interfaces we don't like require considerable scrutiny.

## Will the 0.9.x series continue to be maintained?

Yes. There will be additional Sinatra 0.9.x releases for security
issues or major defects. No new features will be added to the 0.9.x
series.

## How can I pin my app to 0.9.x to avoid upgrading to 1.0?

You shouldn't have to do anything if you bundle/vendor sinatra with your
app. Just make sure you're pulling from the `0.9.x` branch or vendoring an
`0.9.x` gem.

If you use Rubygems, there's a very real possibility that Sinatra will
be upgraded to 1.0 on your system. You can force your apps to use an 0.9.x
version with:

    gem 'sinatra', '< 1.0'
