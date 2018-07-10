'use strict';

const Interval = require('../');

const schedule = new Interval();

schedule.start((done, ticks) => {
    console.log('tick number:', ticks);
    done();
}, 1000);
