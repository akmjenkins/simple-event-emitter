import EventEmitter from '../src/simple-event-emitter';

class House extends EventEmitter 
{

	static Event = {
		DOORBELL: 1,
		KNOCK: 2
	}

	constructor()
	{
		super();
	}

	ringFrontDoor()
	{
		return this.emit(House.Event.DOORBELL,['front door']);
	}

	ringSideDoor()
	{
		return this.emit(House.Event.DOORBELL,['side door']);
	}

	knockOnFrontDoor()
	{
		return this.emit(House.Event.KNOCK,['front door']);
	}

	knockOnSideDoor()
	{
		return this.emit(House.Event.KNOCK,['side door']);
	}

	goToSleep()
	{
		return this.off([House.Event.KNOCK,House.Event.DOORBELL]);
	}

}

(new House())
	.on(House.Event.DOORBELL,(whichDoor) => {
		console.log('Somebody at the '+whichDoor+' rang the doorbell');
	})
	.on(House.Event.KNOCK,(whichDoor) => {
		console.log('Somebody is knocking at the '+whichDoor);
	})
	.on([House.Event.KNOCK,House.Event.DOORBELL],(whichDoor) => {
		console.log('Somebody is at the '+whichDoor);
	})
	.ringFrontDoor()
	.knockOnSideDoor()
	.goToSleep()
	.knockOnFrontDoor()
