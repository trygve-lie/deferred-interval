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
        if (this.alive) {
            this.funct(() => {
                this.timer = setTimeout(this[_tick].bind(this), this.delay);
            }, this.ticks);
        }

        this.ticks++;
        this.emit('tick', this.ticks);
    }

    start(callback, delay, immediate) {
        this.alive = true;
        this.delay = delay;
        this.funct = callback;

        if (immediate) {
            this[_tick]();
            return;
        }

        this.timer = setTimeout(this[_tick].bind(this), this.delay);

        this.emit('start');
    }

    pause(delay) {
        this.alive = false;
        clearTimeout(this.timer);

        if (delay) {
            setTimeout(this.resume.bind(this), delay);
        }

        this.emit('pause');
    }

    resume(immediate) {
        this.alive = true;

        if (immediate) {
            this[_tick]();
            return;
        }
        this.timer = setTimeout(this[_tick].bind(this), this.delay);

        this.emit('resume');
    }

    stop() {
        this.alive = false;
        this.ticks = 0;
        this.delay = -1;
        this.funct = undefined;
        clearTimeout(this.timer);

        this.emit('stop');
    }

    adjust(delay) {
        this.delay = delay;
        return this.delay;
    }
};

module.exports = DeferredInterval;
