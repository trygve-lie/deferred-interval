'use strict';

const EventEmitter = require('events');

const _tick = Symbol('_tick');

/**
 * DeferredInterval - A secure setInterval that defer the execution of the next interval
 * only when the scheduled function have executed.
 * @extends EventEmitter
 */

const DeferredInterval = class DeferredInterval extends EventEmitter {
    constructor() {
        super();

        Object.defineProperty(this, 'alive', {
            value: false,
            writable: true,
        });

        Object.defineProperty(this, 'ticks', {
            value: 0,
            writable: true,
        });

        Object.defineProperty(this, 'delay', {
            value: -1,
            writable: true,
        });

        Object.defineProperty(this, 'timer', {
            value: undefined,
            writable: true,
        });

        Object.defineProperty(this, 'funct', {
            value: undefined,
            writable: true,
        });
    }

    get [Symbol.toStringTag]() {
        return 'DeferredInterval';
    }

    [_tick]() {
        this.ticks++;

        if (this.alive) {
            this.funct(() => {
                this.timer = setTimeout(this[_tick].bind(this), this.delay);
                this.timer.unref();
            }, this.ticks);
        }

        this.emit('tick', this.ticks);
    }

    /**
     * Starts executing a callback on a given interval
     *
     * @param {function} callback The function to execute on each tick
     * @param {Number} delay How long, in milliseconds, each interval should be delayed
     * @param {Boolean} immediate If the callback should be executed immediately on start
     */

    start(callback, delay, immediate) {
        this.emit('start');

        this.alive = true;
        this.delay = delay;
        this.funct = callback;

        if (immediate) {
            this[_tick]();
            return;
        }

        this.timer = setTimeout(this[_tick].bind(this), this.delay);
        this.timer.unref();
    }

    /**
     * Pauses execution of the callback
     *
     * @param {Number} delay How long the pause should last.
     */

    pause(delay) {
        this.emit('pause');

        this.alive = false;

        clearTimeout(this.timer);

        if (delay) {
            setTimeout(this.resume.bind(this, true), delay);
        }
    }

    /**
     * Resumes executing the callback after a pause
     *
     * @param {Boolean} immediate If the callback should be executed immediately on resume
     */

    resume(immediate) {
        this.emit('resume');

        this.alive = true;

        if (immediate) {
            this[_tick]();
            return;
        }

        this.timer = setTimeout(this[_tick].bind(this), this.delay);
        this.timer.unref();
    }

    /**
     * Stops execution of the callback - Everything is reset.
     */

    stop() {
        this.emit('stop');

        this.alive = false;
        this.ticks = 0;
        this.delay = -1;
        this.funct = undefined;

        clearTimeout(this.timer);
    }

    /**
     * Adjust the delay of the execution of the callback function
     *
     * @param {Number} delay How long, in milliseconds, each interval should be delayed
     */

    adjust(delay) {
        this.delay = delay;
        return this.delay;
    }
};

module.exports = DeferredInterval;
