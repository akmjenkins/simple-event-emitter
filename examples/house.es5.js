var EventEmitter = require('../src/simple-event-emitter').default;

var House = function() { 
	EventEmitter.call(this);
};

House.Event = {
	DOORBELL: 1,
	KNOCK: 2
};

//Inherit From EventEmitter
House.prototype = Object.create(EventEmitter.prototype);

House.prototype.ringFrontDoor = function() {
	return this.emit(House.Event.DOORBELL,['front door']);
};

House.prototype.ringSideDoor = function() {
	return this.emit(House.Event.DOORBELL,['side door']);
};

House.prototype.knockOnFrontDoor = function() {
	return this.emit(House.Event.KNOCK,['front door']);
};

House.prototype.knockOnSideDoor = function() {
	return this.emit(House.Event.KNOCK,['side door']);
};

House.prototype.goToSleep = function() {
	return this.off([House.Event.KNOCK,House.Event.DOORBELL]);
};

(new House())
	.on(House.Event.DOORBELL,function(whichDoor) {
		console.log('Somebody at the '+whichDoor+' rang the doorbell');
	})
	.on(House.Event.KNOCK,function(whichDoor) {
		console.log('Somebody is knocking at the '+whichDoor);
	})
	.on([House.Event.KNOCK,House.Event.DOORBELL],function(whichDoor) {
		console.log('Somebody is at the '+whichDoor);
	})
	.ringFrontDoor()
	.knockOnSideDoor()
	.goToSleep()
	.knockOnSideDoor()
