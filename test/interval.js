'use strict';

const lolex = require('lolex');
const tap = require('tap');

const Interval = require('../');

/**
 * Constructor
 */

tap.test('Constructor() - object type - should be DeferredInterval', (t) => {
    const interval = new Interval();
    t.equal(Object.prototype.toString.call(interval), '[object DeferredInterval]');
    t.end();
});

/**
 * .start()
 */

tap.test('.start() - delay: 2000ms, immidiate: not set - should run callback once after 2000ms', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000);

    clock.tick(2500);

    t.equal(count, 1);
    t.end();

    clock.uninstall();
});

tap.test('.start() - delay: 2000ms, immidiate: false - should run callback once after 2000ms', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(2500);

    t.equal(count, 1);
    t.end();

    clock.uninstall();
});

tap.test('.start() - delay: 2000ms, immidiate: true - should run callback twice after 2000ms', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, true);

    clock.tick(2500);

    t.equal(count, 2);
    t.end();

    clock.uninstall();
});

tap.test('.start() - delay: 2000ms, immidiate: false - should emit start event once', (t) => {
    const clock = lolex.install();

    const interval = new Interval();

    interval.on('start', () => {
        t.ok(true);
        t.end();
    });

    interval.start((done) => {
        done();
    }, 2000, false);

    clock.tick(2500);

    clock.uninstall();
});

tap.test('.start() - delay: 2000ms, immidiate: true - should emit "start" event once', (t) => {
    const clock = lolex.install();

    const interval = new Interval();

    interval.on('start', () => {
        t.ok(true);
        t.end();
    });

    interval.start((done) => {
        done();
    }, 2000, true);

    clock.tick(2500);

    clock.uninstall();
});

/**
 * .pause()
 */

tap.test('.pause() - delay: 1000ms - should run callback after delay', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(5000);
    t.equal(count, 2);

    interval.pause(10000);

    clock.tick(11000);
    t.equal(count, 3);

    clock.tick(4000);
    t.equal(count, 5);

    t.end();

    clock.uninstall();
});

tap.test('.pause() - delay: not set - should pause', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(5000);
    t.equal(count, 2);

    interval.pause();

    clock.tick(11000);
    t.equal(count, 2);

    clock.tick(4000);
    t.equal(count, 2);

    t.end();

    clock.uninstall();
});

tap.test('.pause() - call method - should emit "pause" event once', (t) => {
    const clock = lolex.install();

    const interval = new Interval();
    interval.on('pause', () => {
        t.ok(true);
        t.end();
    });

    interval.start((done) => {
        done();
    }, 2000, false);

    clock.tick(5000);

    interval.pause();

    clock.uninstall();
});

/**
 * .resume()
 */

tap.test('.resume() - immediate: not set - should resume and start with fresh timer', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(5000);
    t.equal(count, 2);

    interval.pause();

    clock.tick(11000);
    t.equal(count, 2);

    interval.resume();

    clock.tick(1000);
    t.equal(count, 2);

    clock.tick(2000);
    t.equal(count, 3);

    t.end();

    clock.uninstall();
});

tap.test('.resume() - immediate: true - should resume stright away', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(5000);
    t.equal(count, 2);

    interval.pause();

    clock.tick(11000);
    t.equal(count, 2);

    interval.resume(true);

    clock.tick(1000);
    t.equal(count, 3);

    clock.tick(2000);
    t.equal(count, 4);

    t.end();
    clock.uninstall();
});

tap.test('.resume() - call method - should emit "resume" event once', (t) => {
    const clock = lolex.install();

    const interval = new Interval();
    interval.on('resume', () => {
        t.ok(true);
        t.end();
    });

    interval.start((done) => {
        done();
    }, 2000, false);

    clock.tick(5000);

    interval.pause();

    clock.tick(10000);

    interval.resume();

    clock.uninstall();
});

/**
 * .stop()
 */

tap.test('.stop() - call method - should stop', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(5000);
    t.equal(count, 2);

    interval.stop();

    clock.tick(11000);
    t.equal(count, 2);

    clock.tick(4000);
    t.equal(count, 2);

    t.end();

    clock.uninstall();
});

tap.test('.stop() - call method - should emit "stop" event once', (t) => {
    const clock = lolex.install();

    const interval = new Interval();
    interval.on('stop', () => {
        t.ok(true);
        t.end();
    });

    interval.start((done) => {
        done();
    }, 2000, false);

    clock.tick(5000);

    interval.stop();

    clock.uninstall();
});

/**
 * .adjust()
 */

tap.test('.adjust() - delay: 1000 ms - should change interval to new delay', (t) => {
    const clock = lolex.install();
    let count = 0;

    const interval = new Interval();
    interval.start((done, ticks) => {
        count = ticks;
        done();
    }, 2000, false);

    clock.tick(5000);
    t.equal(count, 2);

    interval.adjust(1000);

    clock.tick(2000);
    t.equal(count, 4);

    t.end();
    clock.uninstall();
});
