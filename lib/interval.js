/* jshint node: true, strict: true */

/** 
  * @module interval
  * @requires eventemitter3
  */


"use strict";

var EventEmitter = require('eventemitter3');



var tick = function () {
    if (this.alive) {
        this.funct.call(null, function done () {
            this.timer = setTimeout(tick.bind(this), this.delay);
        }.bind(this), this.ticks);
    }

    this.ticks++;
    this.emit('tick', this.ticks);
};



/** 
  * Interval - Replacement for setInterval
  *
  * @constructor
  */

var Interval = function () {
    this.alive = false;
    this.ticks = 0;
    this.delay = -1;
    this.timer = undefined;
    this.funct = undefined;
};
Interval.prototype = Object.create(EventEmitter.prototype);



/** 
  * Starts executing a callback on a given interval
  *
  * @param {function} callback The function to execute on each tick
  * @param {Number} delay How long, in milliseconds, each interval should be delayed
  * @param {Boolean} immediate If the callback should be executed immediately on start
  */

Interval.prototype.start = function (callback, delay, immediate) {
    this.alive = true;
    this.delay = delay;
    this.funct = callback;

    if (immediate) {
        tick.call(this);
        return;
    } 
    
    this.timer = setTimeout(tick.bind(this), this.delay);

    this.emit('start');
};



/** 
  * Pauses execution of the callback
  *
  * @param {Number} delay How long the pause should last. If no values is given the pause is until resume is done manually
  */

Interval.prototype.pause = function (delay) {
    this.alive = false;
    clearTimeout(this.timer);

    if (delay) {
        setTimeout(this.resume.bind(this), delay);
    }

    this.emit('pause');
};



/** 
  * Resumes executing the callback after a pause
  *
  * @param {Boolean} immediate If the callback should be executed immediately on resume
  */

Interval.prototype.resume = function (immediate) {
    this.alive = true;

    if (immediate) {
        tick.call(this);
        return;
    } 
    this.timer = setTimeout(tick.bind(this), this.delay);

    this.emit('resume');
};



/** 
  * Stops execution of the callback - Everything is reset.
  */

Interval.prototype.stop = function () {
    this.alive = false;
    this.ticks = 0;
    this.delay = -1;
    this.funct = undefined;
    clearTimeout(this.timer);

    this.emit('stop');
};



/** 
  * Adjust the delay of the execution of the callback function
  *
  * @param {Number} delay How long, in milliseconds, each interval should be delayed
  */

Interval.prototype.adjust = function (delay) {
    this.delay = delay;
    return this.delay;
};



module.exports = Interval;
