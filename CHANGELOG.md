## [5.5.1](https://github.com/expediagroup/catalyst-server/compare/v5.5.0...v5.5.1) (2023-01-09)


### Bug Fixes

* bump json5 from 1.0.1 to 1.0.2 ([#59](https://github.com/expediagroup/catalyst-server/issues/59)) ([1b26e07](https://github.com/expediagroup/catalyst-server/commit/1b26e07c872045c39e9b0a26b286ee06035d3528))

# [5.5.0](https://github.com/expediagroup/catalyst-server/compare/v5.4.0...v5.5.0) (2022-12-07)


### Features

* Upgrade to node v16 ([#57](https://github.com/expediagroup/catalyst-server/issues/57)) ([d1c765f](https://github.com/expediagroup/catalyst-server/commit/d1c765f103087e3ec0624b8125e401dda29952c7))

# [5.4.0](https://github.com/expediagroup/catalyst-server/compare/v5.3.0...v5.4.0) (2022-12-06)


### Features

* empty commit to trigger release pipeline ([#58](https://github.com/expediagroup/catalyst-server/issues/58)) ([c228fa4](https://github.com/expediagroup/catalyst-server/commit/c228fa46c719322568e7d2047ad4fdb341604aa7))

# [5.3.0](https://github.com/expediagroup/catalyst-server/compare/v5.2.1...v5.3.0) (2022-03-29)

### Features

* small readme change to retrigger release ([707bcda](https://github.com/expediagroup/catalyst-server/commit/707bcda1eab529ea11523324ce303784d9b7d8e5))

## [5.2.1](https://github.com/expediagroup/catalyst-server/compare/v5.2.0...v5.2.1) (2022-01-12)


### Bug Fixes

* update steerage to 12.1.3 ([#51](https://github.com/expediagroup/catalyst-server/issues/51)) ([abf67f6](https://github.com/expediagroup/catalyst-server/commit/abf67f6ce7d1ab05f90cdc47b2b0b7f29fbc5a3c))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 5.2.0 - 2021-12-10
### Changed
- [Feat:] exposes overrides and defaults from steerage (#48)

## 5.1.0 - 2021-11-11
### Changed
- [Feat:] Start using pino-pretty library instead the option prettyPrint 

### 5.0.2 - 2021-11-03

- [Fix:] Fix defualt config for `hapi-pino` options

### 5.0.1 - 2021-11-03

- [Fix(deps):] Internal dependencies upgrade
- Updates `@vrbo/steerage` peer depenency requirement to `>=11.0.1`

### 5.0.0 - 2020-11-01

- [Breaking] Drop support for node 12. Node version 14+ required.
- Updates `@hapi/hapi` peer depenency requirement to `>=20.2.1`

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
