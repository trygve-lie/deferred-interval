'use strict';

const EventEmitter = require('eventemitter3');

const _tick = Symbol('_tick');

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
            }, this.ticks);
        }

        this.emit('tick', this.ticks);
    }

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
    }

    pause(delay) {
        this.emit('pause');

        this.alive = false;

        clearTimeout(this.timer);

        if (delay) {
            setTimeout(this.resume.bind(this, true), delay);
        }
    }

    resume(immediate) {
        this.emit('resume');

        this.alive = true;

        if (immediate) {
            this[_tick]();
            return;
        }

        this.timer = setTimeout(this[_tick].bind(this), this.delay);
    }

    stop() {
        this.emit('stop');

        this.alive = false;
        this.ticks = 0;
        this.delay = -1;
        this.funct = undefined;

        clearTimeout(this.timer);
    }

    adjust(delay) {
        this.delay = delay;
        return this.delay;
    }
};

module.exports = DeferredInterval;
