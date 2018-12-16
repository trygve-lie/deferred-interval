# deferred-interval

A secure `setInterval` that defer the execution of the next interval only when the scheduled
function have executed.

[![Dependencies](https://img.shields.io/david/trygve-lie/deferred-interval.svg?style=flat-square)](https://david-dm.org/trygve-lie/deferred-interval)
[![Build Status](http://img.shields.io/travis/trygve-lie/deferred-interval/master.svg?style=flat-square)](https://travis-ci.org/trygve-lie/deferred-interval)
[![Greenkeeper badge](https://badges.greenkeeper.io/trygve-lie/deferred-interval.svg?style=flat-square)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/trygve-lie/deferred-interval/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/trygve-lie/deferred-interval?targetFile=package.json)



## Installation

```bash
$ npm install deferred-interval
```


## Basic example

Example of executing a function every 10th second:

```js
const Interval = require('deferred-interval');

const schedule = new Interval();
schedule.start((done, ticks) => {
  console.log('tick number:', ticks);
  done();
}, 10000);
```


## API

The following methods are available:

### .start(callback, delay, immediate)

Starts executing a callback on a given interval.

  * `callback` - The function to execute on each tick.
  * `delay` - How long, in milliseconds, each interval should be delayed.
  * `immediate` - If the callback should be executed immediately on start.

### .pause(delay)

Pauses execution of the callback

  * `delay` - How long the pause should last. If no values is given the pause is
  until resume is done manually

### .resume(immediate)

Resumes executing the callback after a pause

  * `immediate` - If the callback should be executed immediately on resume.

### .stop()

Stops execution of the callback - Everything is reset.

### .adjust(delay)

Adjust the delay of the execution of the callback function

  * `delay` - How long, in milliseconds, each interval should be delayed.

## License

The MIT License (MIT)

Copyright (c) 2018 - Trygve Lie post@trygve-lie.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
