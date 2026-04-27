---
layout: post
title: Mustermann 4.0 released!
author: Konstantin Haase
author_url: https://github.com/rkh
publish_date: Monday, April 27, 2026
---

[13 years ago today](https://github.com/sinatra/mustermann/commit/1b98e6273855fbd0492ec6b3f805e1b1773c7837), I released the very first version of [Mustermann](https://github.com/sinatra/mustermann).

It allows you to create Regexp-like pattern objects:

```ruby
require "mustermann"

pattern = Mustermann.new("/hello/:name")

pattern =~ "/hello/world"      # => 0
pattern.params("/hello/world") # => {"name" => "world"}
```

This is what Sinatra [uses](https://github.com/sinatra/sinatra/blob/v4.2.1/lib/sinatra/base.rb#L1105) to match routes and extract parameters from the request path.

Since then, [other projects](https://github.com/sinatra/mustermann#projects-using-mustermann) besides Sinatra have started using Mustermann, which I think is fantastic, and it has been maintained by a great community of [contributors](https://github.com/sinatra/mustermann/graphs/contributors) over the years. I myself took a break from Mustermann from 2017 until two weeks ago!

## Performance, performance, performance!

You can find the full list of changes in the [changelog](https://github.com/sinatra/mustermann/blob/main/CHANGELOG.md), but the really big highlight is a significant improvement in performance!

**Important disclaimer:** The numbers below reflect pattern matching and routing performance only! For a real world app, this is probably not a bottleneck. So take especially the framework benchmarks with a truckload of salt.

#### For individual patterns

Pattern creation is now **6 times faster** than before, and matching individual patterns can be up to **3 times faster** than before, assuming normal usage, and over **150 times** faster for [malicious input strings](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS).

Here are preliminary results for [hanami-router](https://github.com/hanami/hanami-router) when upgrading Mustermann from 3.1.1 to 4.0.0, without any other changes:

<a href="{{ site.baseurl }}/images/mustermann-4.0/hanami-router.png"><img src="{{ site.baseurl }}/images/mustermann-4.0/hanami-router.png" alt="hanami-router with Mustermann 3.1.1 vs 4.0.0" style="width: 100%; border: solid 1px #ccc;" /></a>

And most of Hanami's routing logic currently doesn't even use Mustermann!

#### For sets of patterns

However, the biggest performance improvement is for sets of patterns. Mustermann 4 now comes with tooling to match against multiple patterns at once, at greatly improved performance. In my benchmarks, matching against a set of 1000 patterns is more than **400 times faster** than before, and the improvement grows with the number of patterns.

```ruby
require "mustermann/set"

set = Mustermann::Set.new

set.add "/hello/:name"
set.add "/goodbye/:name"

result = set.match("/hello/world")
result.pattern # => #<Mustermann::Sinatra:""/hello/:name">
result[:name]  # => "world"
```

For convenience, you can also attach arbitrary values to individual patterns.

```ruby
set.add "/users/:id", controller: "users", action: "show"
set.match("/users/42").value # => { controller: "users", action: "show" }
```

As you might have spotted, this API is primarily intended for use within frameworks and libraries. So what's the impact for end-users?

Here are experimental numbers for Sinatra [patched](https://github.com/sinatra/sinatra/pull/2163) to use this new feature:

<a href="{{ site.baseurl }}/images/mustermann-4.0/sinatra.png" alt><img src="{{ site.baseurl }}/images/mustermann-4.0/sinatra.png" alt="Sinatra with Mustermann 3.1.1 vs 4.0.0 (using Mustermann::Set)" style="width: 100%; border: solid 1px #ccc;" /></a>

However, in Sinatra's case, the performance improvement is still smaller than it could be for other uses, as routes need to be tried in definition order, and all matching patterns need to be tried, as you can use `pass` to skip to the next route.

With a [very minimalistic implementation](https://github.com/sinatra/mustermann/blob/v4.0.0/mustermann/lib/mustermann/router.rb) that doesn't have these constraints, I'm seeing the following results (attention, this is a logarithmic scale):

<a href="{{ site.baseurl }}/images/mustermann-4.0/mustermann-router.png"><img src="{{ site.baseurl }}/images/mustermann-4.0/mustermann-router.png" alt="Sinatra with Mustermann 3.1.1 vs Mustermann::Router" style="width: 100%; border: solid 1px #ccc;" /></a>

#### More numbers

[Pattern-only benchmarks](https://github.com/sinatra/mustermann/blob/v4.0.0/bench/versions.rb):

<table class="mustermann-data-table">
  <thead>
    <tr>
      <th colspan="2">Scenario</th>
      <th>3.1.1</th>
      <th class="highlight">4.0.0</th>
      <th>Improvement</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="5">Simple patterns</td>
      <td>Compilation</td>
      <td class="number">12.1 K/s</td>
      <td class="number highlight">70.8 K/s</td>
      <td class="number">6x</td>
    </tr>
    <tr>
      <td>Matching non-repeating strings</td>
      <td class="number">4.5 M/s</td>
      <td class="number highlight">4.5 M/s</td>
      <td class="number">–</td>
    </tr>
    <tr>
      <td>Matching repeating strings</td>
      <td class="number">5.9 M/s</td>
      <td class="number highlight">17.1 M/s</td>
      <td class="number">3x</td>
    </tr>
    <tr>
      <td>Extracting params</td>
      <td class="number">0.7 M/s</td>
      <td class="number highlight">2.2 M/s</td>
      <td class="number">3x</td>
    </tr>
    <tr>
      <td>Matching against 1k different patterns</td>
      <td class="number">3 M/s</td>
      <td class="number highlight">7.1 K/s</td>
      <td class="number">425x</td>
    </tr>
    <tr>
      <td rowspan="2">Complex patterns</td>
      <td>Extracting params</td>
      <td class="number">486 K/s</td>
      <td class="number highlight">955 K/s</td>
      <td class="number">2x</td>
    </tr>
    <tr>
      <td>Matching against malicious input</td>
      <td class="number">3.6 K/s</td>
      <td class="number highlight">582 K/s</td>
      <td class="number">162x</td>
    </tr>
  </tbody>
</table>

[Routing Rack requests](https://github.com/rkh/router-performance/) (hot path scenario):

<table class="mustermann-data-table">
  <thead>
    <tr>
      <th>Router</th>
      <th>Mustermann</th>
      <th>100 routes</th>
      <th>1,000 routes</th>
      <th>10,000 routes</th>
    </tr>
  </thead>
  <tbody>
    <tr class="highlight">
      <td>Mustermann Router</td>
      <td><b>4.0.0</b></td>
      <td class="number">1,544,163 req/s</td>
      <td class="number">1,500,825 req/s</td>
      <td class="number">1,338,151 req/s</td>
    </tr>
    <tr>
      <td>Sinatra</td>
      <td>3.1.1</td>
      <td class="number">28,544 req/s</td>
      <td class="number">24,659 req/s</td>
      <td class="number">19,042 req/s</td>
    </tr>
    <tr class="highlight">
      <td>Sinatra</td>
      <td><b>4.0.0</b></td>
      <td class="number">38,256 req/s</td>
      <td class="number">38,052 req/s</td>
      <td class="number">37,750 req/s</td>
    </tr>
    <tr>
      <td>Hanami Router</td>
      <td>3.1.1</td>
      <td class="number">359,054 req/s</td>
      <td class="number">345,686 req/s</td>
      <td class="number">315,447 req/s</td>
    </tr>
    <tr class="highlight">
      <td>Hanami Router</td>
      <td><b>4.0.0</b></td>
      <td class="number">463,865 req/s</td>
      <td class="number">447,507 req/s</td>
      <td class="number">419,410 req/s</td>
    </tr>
    <tr>
      <td>Ruby on Rails</td>
      <td>–</td>
      <td class="number">7,972 req/s</td>
      <td class="number">5,177 req/s</td>
      <td class="number">964 req/s</td>
    </tr>
    <tr>
      <td>Roda</td>
      <td>–</td>
      <td class="number">271,880 req/s</td>
      <td class="number">219,390 req/s</td>
      <td class="number">155,147 req/s</td>
    </tr>
  </tbody>
</table>

<style>
.mustermann-data-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #fff;
  }

  th, td {
    padding: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
  }

  .number {
    text-align: right;
    font-family: monospace;
  }

  .highlight {
    background-color: #e0ffe0;
  }
}
</style>

Benchmarks taken on my development machine (2024 MacBook Pro).

Again, keep in mind that these aren't measuring full applications, nor going through the full HTTP protocol. So while these numbers are exciting, they don't necessarily translate to a real world app.

All these frameworks also come with differing sets of features, that will impact performance in different ways. The Hanami measurements are only measuring `hanami-router`, and are thus more comparable to the numbers from [Roda](https://roda.jeremyevans.net/) (without any plugins) or `Mustermann::Router`, which also only do Rack routing, and thus can't be directly compared to Sinatra and [Rails](https://rubyonrails.org/), which come with richer feature sets out of the box, as wall as a host of middleware to [secure your application](https://sinatrarb.com/protection/).

Rails and Roda are included for comparison, but they don't use Mustermann. Rails has a similar tool to Mustermann called [Journey](https://github.com/rails/rails/tree/main/actionpack/lib/action_dispatch/journey) and Roda uses nested Ruby blocks to mimic route structure.

## So when can I use it?

### Stand-alone

You can update to Mustermann 4.0 by changing your Gemfile:

```ruby
gem "mustermann", "~> 4.0"
```

Or if you don't use Bundler, you can install it with:

```bash
gem install mustermann -v "~> 4.0"
```

### Sinatra

Sinatra (at least up to 4.2.1) depends on Mustermann 3. In theory it is already compatible with 4.0, as the breaking changes are minimal, but an updated Sinatra version that leverages Mustermann 4.0 more fully is [currently under development](https://github.com/sinatra/sinatra/pull/2163). Once it's released, you can update Sinatra to the latest version to benefit from the improvements in Mustermann 4.0.

Expect an updated Sinatra release in the next few weeks!

### Hanami

Similar to Sinatra, Hanami depends on Mustermann 3.1. There is [on-going work](https://discourse.hanamirb.org/t/trie-based-routing-with-mustermann/1441) to figure out to what extent Hanami can leverage Mustermann 4.0. I'm working closely with the Hanami team, and this should be resolved in the next few weeks as well.

### Grape

Update Mustermann (see above) and you should be good to go. Grape will automatically use the latest version of Mustermann available.
