# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### 5.0.1 - 2021-11-02

- [Other:Deps] Update @hapi-pino to V8.5.0
- Updating dependencies to latest versions

### 5.0.0 - 2021-10-31

- [Breaking] Node 14 upgrade
- Updating dependencies to latest versions

### 4.0.0 - 2020-08-18

- [Breaking] Drop support for Hapi <= 19
- Updating dependencies to latest versions

### 3.1.0 - 2020-08-11

- Updates server configuration with more appropriate defaults

### 3.0.0 - 2020-08-10

- [Breaking] Drop support for node < 12.
- [Breaking] Drop support for Hapi <= 18
- Update Github test workflow to only test node v 12.x
- Update dependencies, npm, and engines in package.json to support node version >= 12.

## 2.2.0 - 2020-06-26
### Changed
- Add support for merging multiple manifest files.

## 2.1.0 - 2020-01-09
### Changed
- Use `@vrbo` namespaced versions of `steerage` and `determination`
- Updated `determination` to v3
- Updated `standard`, `sinon`, and `nyc` dev deps

## 2.0.2 - 2019-12-17
### Fixed
- Correctly enable `hapi-pino`
- Disable prettyPrint in production
- Correct examples in README

## 2.0.1 - 2019-10-07
### Changed
- Upgrade joi dependency version.

## 2.0.0 - 2019-07-19
### BREAKING CHANGE
- Upgrade Hapi to v18
    - **`@hapi/hapi` v18.3.1 or newer now required**
    - If you are still on Hapi v17, please continue to use v1.0.1

### Changed
- Use the new `@hapi` scoped packages for Crumb, Hapi, Hoek, Joi
- Bump up `steerage` to v8 which supports Hapi 18

## 1.0.1 - 2019-04-19
### Changed
- Minor code formatting changes

## 1.0.0 - 2019-04-19
### Initial release
