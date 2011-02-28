---
title: "Sinatra: Documentation"
layout: default
---

Documentation
=============

### [README](intro.html)

A whirlwind tour of Sinatra's most interesting features.

### [Configuring Settings](configuration.html)

Detailed documentation on all of Sinatra's built-in settings and using `set`,
`enable`, and `disable` to configure them.

### [Testing Sinatra with Rack::Test](testing.html)

Guide to testing Sinatra apps.

### [Using Extensions](/extensions-wild.html)

How to use Sinatra extensions in your application and links to
extensions in the wild.

### [Writing Extensions](extensions.html)

How to add new functionality to Sinatra using the extension APIs.

Project Information
-------------------

### [Sinatra 1.0 FAQ](./one-oh-faq)

Sinatra reached 1.0, breaking backward compatibility for the first
time in two years. The 1.0 FAQ includes information and best practices
for upgrading.

### [Frequently Asked Questions](faq.html)

Answers to those questions most frequently asked on the mailing list and
in `#sinatra`.

### Release Notes

See the `CHANGES` file included for release notes about each release:

 * [1.1.3](http://github.com/sinatra/sinatra/blob/1.1.3/CHANGES)
   February 20, 2011
 * [1.1.2](http://github.com/sinatra/sinatra/blob/1.1.2/CHANGES)
   December 25, 2010
 * [1.1.0](http://github.com/sinatra/sinatra/blob/1.1.0/CHANGES)
   October 24, 2010
 * [1.0.0](http://github.com/sinatra/sinatra/blob/1.0/CHANGES)
   March 23, 2010
 * [0.9.6](http://github.com/sinatra/sinatra/blob/0.9.6/CHANGES)
   March 07, 2010
 * [0.9.5](http://github.com/sinatra/sinatra/blob/0.9.5/CHANGES)
   March 05, 2010
 * [0.9.4](http://github.com/sinatra/sinatra/blob/0.9.4/CHANGES)
   July 26, 2009
 * [0.9.3](http://github.com/sinatra/sinatra/blob/0.9.3/CHANGES)
   June 08, 2009
 * [0.9.2](http://github.com/sinatra/sinatra/blob/0.9.2/CHANGES)
   March 18, 2009
 * [0.9.1](http://github.com/sinatra/sinatra/blob/0.9.1/CHANGES)
   March 02, 2009
 * [0.9.0](http://github.com/sinatra/sinatra/blob/0.9.0/CHANGES)
   January 18, 2009
 * [0.3.3](https://github.com/sinatra/sinatra/blob/0.3.3/ChangeLog)
   November 2, 2008
 * [0.3.2](https://github.com/sinatra/sinatra/blob/0.3.2/ChangeLog)
   November 2, 2008
 * [0.3.1](https://github.com/sinatra/sinatra/blob/0.3.1/ChangeLog)
   September 8, 2008
 * [0.3.0](https://github.com/sinatra/sinatra/blob/0.3.0/ChangeLog)
   August 31, 2008
 * [0.2.2](http://github.com/sinatra/sinatra/blob/0.2.2/CHANGELOG)
   April 15, 2008
 * [0.2.1](http://github.com/sinatra/sinatra/blob/0.2.1/CHANGELOG)
   April 15, 2008
 * [0.2.0](http://github.com/sinatra/sinatra/blob/0.2.0/CHANGELOG)
   April 11, 2008
 * [0.1.7](http://github.com/sinatra/sinatra/blob/0.1.6/CHANGELOG)
   October 23, 2007
 * [0.1.6](http://github.com/sinatra/sinatra/blob/0.1.6/CHANGELOG)
   October 15, 2007
 * [0.1.5](http://github.com/sinatra/sinatra/blob/0.1.5/CHANGELOG)
   October 7, 2007
 * [0.1.0](http://github.com/sinatra/sinatra/blob/0.1.0/CHANGELOG)
   October 4, 2007
 * [0.0.1](https://github.com/sinatra/sinatra/tree/0.0.1)
   September 09, 2007

### [API Documentation](http://railsapi.com/doc/sinatra-v1.0/)

RDoc documentation courtesy of `railsapi.com`.

### [In the Wild](/wild.html)

List of applications, libraries, websites and companies using Sinatra.

### [The Sinatra Book](http://sinatra-book.gittr.com/)

An in-depth look at building and deploying Sinatra applications.
Maintained by [Chris Schneider][cschneid] and [Zachary Scott][zzak].

[cschneid]: http://github.com/cschneid
[zzak]: http://github.com/zacharyscott

### [Sinatra Book Contrib](http://sinatra-book-contrib.com/)

Community contributed recipes and tutorials for Sinatra.

<!--

### [Routes](book.html#routes) and [Filters](book.html#filters)

Using `get`, `put`, `post`, `delete` to define routes and `before`
to inspect/modify the request before routing is performed.

### [Helpers](book.html#helpers) and [Views](book.html#views)

Extracting commonly used logic into helper methods and managing
view code in external templates.

### [Configuration](book.html#configuration)

Using `configure` blocks, settings options, and using Rack
middleware.

### [Error Handling](book.html#error_handling)

How to create custom error pages or perform actions when certain
exceptions occur within your application.

### [Deployment](book.html#deployment)

How to deploy under Thin, Passenger, etc. using a Rackup file.

-->

Screencasts and Presentations
-----------------------------

### [Sinatra, rack and middleware](http://www.slideshare.net/benschwarz/sinatra-rack-and-middleware-1509268)

Ben Schwarz presents Sinatra and his realisations of its inner workings in regard to 
rack and rack middlware at Melbourne RORO shortly after Railsconf (US).

### [RubyConf 08: Lightweight Web Services](http://rubyconf2008.confreaks.com/lightweight-web-services.html)

Adam Wiggins and Blake Mizerany present Sinatra and
[RestClient](http://github.com/adamwiggins/rest-client/tree/master)
at RubyConf 2008. The talk details Sinatra's underlying philosophy and
reflects on using Sinatra to build real world applications.

### [Meet Sinatra](http://peepcode.com/products/sinatra) (PeepCode)

Dan Benjamin introduces Sinatra in an hour-long screencast. Build an ad server with DataMapper, JavaScript, HAML, and Sinatra. In collaboration with Sinatra creator Blake Mizerany. Only $9.

### [Classy Web Development with Sinatra](http://www.pragprog.com/screencasts/v-aksinatra/classy-web-development-with-sinatra) (Prag's Screencast Series)

Adam Keys and The Pragmatic Programmers have started a series of screencasts
on Sinatra. The first two episodes cover creating a tiny web app and creating
a REST service. <em>$5 a pop.</em>

### [Sinatra at Locos x Rails](http://www.slideshare.net/godfoca/sinatra-1282891), in Buenos Aires

By [Nicolás Sanguinetti](http://github.com/foca), April 2009.

Around The Web
--------------

### [RubyInside's 29 Links and Resources](http://www.rubyinside.com/sinatra-29-links-and-resources-for-a-quicker-easier-way-to-build-webapps-1371.html)

Peter Cooper's compendium with links to tutorials, example
applications, and presentations.

### [Chris Schneider's Blog: GITTR](http://www.gittr.com/)

Christopher's blog is a treasure-trove of useful Sinatra related
information.

### [Using Compass for CSS in your Sinatra application](http://log.openmonkey.com/post/73462983/using-compass-for-css-in-your-sinatra-application)
