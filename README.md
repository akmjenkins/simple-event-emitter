# Simple EventEmitter
---

The simple EventEmitter, is lightweight and provides a simplified API compared to the to [Node.js Event Emitter][ee] that will handle the vast majority of event handling cases.

  [ee]: https://nodejs.org/api/events.html#events_class_eventemitter

### Usage
---
Example usage (from `examples/house.es6.js`):

```js
import SimpleEventEmitter from 'simple-event-emitter';

class House extends ExtendedEventEmitter 
{
	static Event = {
		DOORBELL: 1,
		KNOCK: 2
	}

	constructor() {
		super();
	}

	ringFrontDoor() {
		return this.emit(House.Event.DOORBELL,['front door']);
	}
	
	knockOnFrontDoor() {
		return this.emit(House.Event.KNOCK,['front door']);
	}	

    /* ... */

	goToSleep() {
		return this.off([House.Event.KNOCK,House.Event.DOORBELL]);
	}

}

(new House())
	.on(House.Event.DOORBELL,(whichDoor) => {
		console.log(`Somebody at the ${whichDoor} rang the doorbell`);
	})
	.on(House.Event.KNOCK,(whichDoor) => {
		console.log(`Somebody is knocking at the ${whichDoor}`);
	})
	.on([House.Event.KNOCK,House.Event.DOORBELL],(whichDoor) => {
		console.log(`Somebody is at the ${whichDoor}`);
	})
	.ringFrontDoor()
	.goToSleep()
	.knockOnFrontDoor()

```

### API
---

#### .on(event(s),callback)
Attach a callback to an event or an array of events.
Event can be a string or number or an array of string/numbers.

e.g.
```js
myHouse.on(['knock','doorbell'],() => console.log('some one is at the door') );
```

#### .one(event(s),callback)
Attach a callback to an event or an array of events that will only be triggered once and them removed. 
```js
myHouse.one('knock',() => console.log('some one is at the door') );
myHouse.emit('knock'); //logs someone is at the door
myHouse.emit('knock'); //no log
```

**Note:** The callback will be triggered once per event and them removed, not once entirely.
```js
myHouse.on(['knock','doorbell'],() => console.log('some one is at the door') );
myHouse.emit('knock'); //logs someone is at the door
myHouse.emit('knock'); //no log
myHouse.emit('doorbell'); //logs someone is at the door
```

#### .off([event(s),[callback]])
All parameters are optional. By simply calling `.off()` on an instance, all events will be removed.

By calling `.off()` with an event, or array of events: e.g.
```js
myHouse.off([
   House.Event.DOORBELL,
   House.Event.KNOCK
])
```
All callbacks that were attached to those events will be removed.

Call `.off()` with an event, or array of events, and a handler reference, to surgically remove a specific callback:

```js
var onDoorbell = () => { /* ... */ }
myHouse.on(House.Event.DOORBELL,onDoorBell);
/*... */
myHouse.off(House.Event.DOORBELL,onDoorBell);
```

#### .emit(event(s),[args...])
Emit an event (or an array of events) from an instance with arguments.
```js
myHouse.on(House.Event.DOORBELL,(whichDoor,howManyTimes) => {
  console.log(`somebody rang the ${whichDoor} ${howManyTimes} times`);
});
myHouse.emit(House.Event.DOORBELL,['front door',3]);
```

### Namespacing Events
---
You can namespace events by prepending a string with a `.` to an event name to make them easier to manipulate (e.g. remove) later without affecting other events

For instance:
```
var myHouse = new House();
myHouse
   .on('MOM.' + House.Event.DOORBELL,(whichDoor) => {
       console.log('Mom says: I'll get the '+whichDoor);
   })
   .on(House.Event.DoorBell,(whichDoor) => {
       console.log('I'll get the '+whichDoor);
    })
    
myHouse.emit(House.Event.DOORBELL,['front door']);
   //logs
   Mom says: I'll get the front door
   I'll get the front door
    
//mom leaves
myHouse.off('MOM.' + House.Event.DOORBELL);
myHouse.emit(House.Event.DOORBELL,['front door']);
//logs
   I'll get the front door





