# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2019-01-20
### Added
- `webpack` with simple config file

### Changed
- Remove `gulp` with related packages
- Plugin expose - now delivered as `CCS` lib under all the module definitions - `umd`
- Project directory structure - `/dist` folder contains only one production ready file

## [1.1.0] - 2018-11-17
### Added
- Frugal type mode
- Sorting function with test coverage

### Changed
- Babel preset used in a gulpfile to `babel-preset-env`
- Way of passing word in `initTypeLoop` - assign-by-value
- Array based words are transformed to strings on init (chunk mode was abandoned)

## [1.0.0] - 2018-09-14
### Added
- First release
- This CHANGELOG file
- Compiled dist js files
