---
layout: post
title: Rack Protection v1.5.5 is out
author: Kunpei Sakai
author_url: https://github.com/namusyaka
publish_date: Thursday, March 8, 2018
---

I have just released Rack Protection v1.5.5 for backporting security fix.

## Details

The v1.5.5 contains a security fix for [CVE-2018-1000119](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-1000119).

It was determined a timing attack vulnerability in the CSRF token checking that can result in signatures can be exposed.

[The original fix](https://github.com/sinatra/sinatra/commit/8aa6c42ef724f93ae309fb7c5668e19ad547eceb) has already been merged at rack-protection v2.0.0.rc3. Therefore, there is no problem if you are using rack-protection v2.0.0.rc3 or later.

If you still are using rack-protection v1.5.X, we would highly recommend to upgrade the gem.

## Thank you

Finally, I am deeply grateful to [Andreas Karlsson](https://github.com/jeltz) and [Kurt Seifried](https://github.com/kseifriedredhat) who worked on this issue.
Thank you.
