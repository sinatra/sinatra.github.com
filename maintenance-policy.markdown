---
title: 'Maintenance Policy for Sinatra'
layout: default
id: maintenance-policy
---

# Maintenance Policy for Sinatra

The sinatra team develops according to the following rules.

## Kind of versions

### Patch version

Basically bug fixes are mostly. However, a simple feature that does not destroy backward compatibility may be added.

### Minor version

Includes release of new features, update of features to destroy backward compatibility and bugfixes.

### Major Version

Includes release of new features, updates of features that destroy backwards compatibility and bugfixes. Changes will be incorporated more drastic than the minor version.

## Releases

### Security Fixes

In the event of a serious vulnerability, the sinatra core team will release a new patch version ignoring the existing issue.
In light of the influence of Sinatra, backport will also be done in past versions.

Examples: rack-protection-1.5.5, sinatra-2.0.2

### Constant Release

Sinatra constantly releases the patch version.
This is effective for releasing the contributions from our community and getting feedback with detailed glanularity
Usually this will be done several times a year (3 or 4 times).

Examples: sinatra-2.0.4, sinatra-2.0.3

### Release of new features

In order to fix bugs with new features and destruction of backward compatibility, we will do a minor upgrade with about once a year span.
This is determined by discussion within the sinatra team.

Examples: sinatra-2.1

### Major Release

This is done when bringing significant changes to sinatra, as when sinatra upgrades to 2.0.
There is no clear release standard for this.

Examples: sinatra-2.0.0
