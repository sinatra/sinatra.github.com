---
title: 'Maintenance Policy for Sinatra'
layout: default
id: maintenance-policy
---

# Maintenance Policy for Sinatra

The sinatra team develops according to the following rules.

## Kind of versions

### Patch version

Basically bug fixes are mostly. However, a simple feature that does not break backward compatibility may be added.

### Minor version

Includes release of new features and bugfixes.

### Major Version

Includes release of new features, updates of features that break backwards compatibility and bugfixes. Changes may include more drastic changes than a Minor version update.

## Releases

### Security Fixes

In the event of a serious vulnerability, the sinatra core team will release a new patch version prioritizing this rather than adding other functions or fixing bugs
In light of the influence of Sinatra, backport will also be done in past versions.

Examples: rack-protection: 1.5.5, 2.0.1. sinatra: 2.0.2

### Release Timing

Sinatra constantly releases the patch version.
This is effective for releasing the contributions from our community and getting feedback with detailed glanularity

### Major Release

This is done when bringing significant changes to sinatra, as when sinatra upgrades to 2.0.
There is no clear release standard for this.

Examples: sinatra-2.0.0
