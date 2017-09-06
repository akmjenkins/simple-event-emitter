//EventEmitterTest.js
import assert from 'assert';
import EventEmitter from '../src/simple-event-emitter';

//instance of EventEmitter
var eventEmitter;

const EVENT_ONE = 'EVENT_ONE';
const EVENT_TWO = 'EVENT_TWO';
const EVENT_THREE = 'EVENT_THREE';
const EVENT_ARGUMENTS = [1,2,3];

//before each test, re-create dummyInstance and eventEmitter
//so that we don't contaminate other tests
beforeEach(() => eventEmitter = new EventEmitter() );

describe('.on',() => {
  
  it('is chainable',() => {
    assert.equal(eventEmitter,eventEmitter.on(EVENT_ONE,() => {}));
  });

  it('should throw an error if no event(s) are specified',() => {
    assert.throws(
      () => eventEmitter.on(),
      (err) => {
        return /No event\(s\) specified/.test(err);
      },
      'unexpected error'
    );
  });

  it('should throw an error if no callback is specified',() => {
    assert.throws(
      () => eventEmitter.on(EVENT_ONE),
      (err) => {
        return /No callback is specified/.test(err);
      },
      'unexpected error'
    );
  });

  it('should throw an error if callback is not runnable',() => {
    assert.throws(
      () => eventEmitter.on(EVENT_ONE,1),
      (err) => {
        return /Supplied callback is not a function/.test(err);
      },
      'unexpected error'
    );
  });

});

describe('.one',() => {

  it('is chainable',() => {
    assert.equal(eventEmitter,eventEmitter.one(EVENT_ONE,() => {}));
  });

  it('should throw an error if no callback is specified',() => {
    assert.throws(
      () => eventEmitter.one(EVENT_ONE),
      (err) => {
        return /No callback is specified/.test(err);
      },
      'unexpected error'
    );
  });

  it('should throw an error if callback is not runnable',() => {
    assert.throws(
      () => eventEmitter.one(EVENT_ONE,1),
      (err) => {
        return /Supplied callback is not a function/.test(err);
      },
      'unexpected error'
    );
  });

  it('should only fire a callback once',(done) => {
    var i = 0;
    eventEmitter
      .one(EVENT_ONE,() => i++)
      .emit(EVENT_ONE)
      .emit(EVENT_ONE);

    setTimeout(() => done(assert.ok(i === 1)));
  });

});

describe('.off',() => {

  it('is chainable',() => {
    assert.equal(eventEmitter,eventEmitter.off());
    assert.equal(eventEmitter,eventEmitter.off(EVENT_ONE));
    assert.equal(eventEmitter,eventEmitter.off([EVENT_ONE,EVENT_TWO]));
  });

  it('removes an event',(done) => {
    var i = 0;
    eventEmitter
      .on(EVENT_ONE,() => i++)
      .emit(EVENT_ONE)
      .off(EVENT_ONE)
      .emit(EVENT_ONE)

    setTimeout(() => done(assert.ok(i === 1)));
  });

  it('removes all events',(done) => {
    var i = 0;
    eventEmitter
      .on([EVENT_ONE,EVENT_TWO,EVENT_THREE],() => i++)
      .emit(EVENT_ONE)
      .off()
      .emit([EVENT_ONE,EVENT_TWO,EVENT_THREE])

    setTimeout(() => done(assert.ok(i === 1)));
  });

  it('should not fire a callback when a namespaced event is detached',(done) => {
    var i = 0;
    eventEmitter
      .on('TEST.'+EVENT_ONE,() => i++)
      .off('TEST.'+EVENT_ONE)
      .emit(EVENT_ONE)
      .emit('TEST.'+EVENT_TWO)
    setTimeout(() => done(assert.ok(i == 0)))
  });


});

describe('.emit',() => {

  it('is chainable',() => {
    assert.equal(eventEmitter,eventEmitter.emit(EVENT_ONE));
  });

  it('should throw an error if no event(s) are specified',() => {
    assert.throws(
      () => eventEmitter.emit(),
      (err) => {
        return /No event\(s\) specified/.test(err);
      },
      'unexpected error'
    );
  });

  it('should fire a callback when attached with a single event',(done) => {
    eventEmitter
      .on(EVENT_ONE,() => done(assert.ok(true)))
      .emit(EVENT_ONE);
  });

  it('should fire callbacks when attached with multiple events',(done) => {
    var i = 0;
    eventEmitter
      .on([EVENT_ONE,EVENT_TWO],() => i++)
      .emit([EVENT_ONE,EVENT_TWO]);
    setTimeout(() => done(assert.ok(i == 2)))
  });

  it('should fire a callback with the correct arguments',(done) => {
    eventEmitter
      .on(EVENT_ONE,(a,b,c) => done(assert.equal(1,a)) )
      .emit(EVENT_ONE,EVENT_ARGUMENTS);
  });

  it('should fire a callback on a namespaced event',(done) => {
    var i = 0;
    eventEmitter
      .on('TEST.'+EVENT_ONE,() => i++)
      .emit(EVENT_ONE)
    setTimeout(() => done(assert.ok(i == 1)))
  });

  it('should fire a callback when a namespaced event is detached',(done) => {
    var i = 0;
    eventEmitter
      .on(['TEST.'+EVENT_ONE,EVENT_ONE],() => i++)
      .emit(EVENT_ONE)
      .off('TEST.'+EVENT_ONE)
      .emit(EVENT_ONE)
    setTimeout(() => done(assert.ok(i == 3)))
  });

});
