---
layout: default
title: Rack::Protection
---

Rack::Protection
================

This gem protects against typical web attacks. Should work for all Rack apps,
including Rails.


# Usage

Use all protections you probably want to use:

``` ruby
# config.ru
require 'rack/protection'
use Rack::Protection
run MyApp
```

Skip a single protection middleware:

``` ruby
# config.ru
require 'rack/protection'
use Rack::Protection, :except => :path_traversal
run MyApp
```

Use a single protection middleware:

``` ruby
# config.ru
require 'rack/protection'
use Rack::Protection::AuthenticityToken
run MyApp
```

# Prevented Attacks

## Cross Site Request Forgery

Prevented by:

* [Rack::Protection::AuthenticityToken](authenticity_token.html) (not included by `use Rack::Protection`)
* [Rack::Protection::FormToken](form_token.html) (not included by `use Rack::Protection`)
* [Rack::Protection::JsonCsrf](json_csrf.html)
* [Rack::Protection::RemoteReferrer](remote_referrer.html) (not included by `use Rack::Protection`)
* [Rack::Protection::RemoteToken](remote_token.html)
* [Rack::Protection::HttpOrigin](http_origin.html)

## Cross Site Scripting

Prevented by:

* [Rack::Protection::EscapedParams](escaped_params.html) (not included by `use Rack::Protection`)
* [Rack::Protection::XSSHeader](xss_header.html) (Internet Explorer and Chrome only)
* [Rack::Protection::ContentSecurityPolicy](content_security_policy.html)

## Clickjacking

Prevented by:

* [Rack::Protection::FrameOptions](frame_options.html)

## Directory Traversal

Prevented by:

* [Rack::Protection::PathTraversal](path_traversal.html)

## Session Hijacking

Prevented by:

* [Rack::Protection::SessionHijacking](session_hijacking.html)

## Cookie Tossing

Prevented by:

* [Rack::Protection::CookieTossing](cookie_tossing.html) (not included by `use Rack::Protection`)

## IP Spoofing

Prevented by:

* [Rack::Protection::IPSpoofing](ip_spoofing.html)

## Helps to protect against protocol downgrade attacks and cookie hijacking

Prevented by:

* [Rack::Protection::StrictTransport](strict_transport.html) (not included by `use Rack::Protection`)

# Installation

    gem install rack-protection

# Instrumentation

Instrumentation is enabled by passing in an instrumenter as an option.

```
use Rack::Protection, instrumenter: ActiveSupport::Notifications
```

The instrumenter is passed a namespace (String) and environment (Hash). The namespace
is 'rack.protection' and the attack type can be obtained from the environment key
'rack.protection.attack'.
