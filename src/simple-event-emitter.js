const privateState = new WeakMap();

let getEvents = function() {
	return privateState.get(this).events;
}

let clearEvents = function() {
	privateState.set(this,{events:{}});
}

export default class EventEmitter {

	constructor()
	{
		clearEvents.call(this);
	}

	on(event,callback)
	{
		let events = getEvents.call(this);

		if(!event) {
			throw new Error('No event(s) specified');
		}

		if(!callback) {
			throw new Error('No callback is specified');
		}

		if(typeof callback != 'function') {
			throw new Error('Supplied callback is not a function');
		}

		(Array.isArray(event) ? event : [event]).forEach((event) => {
			if(!events[event]) {
				events[event] = [];
			}

			events[event].push(callback)
		});
		return this;
	}

	one(event,callback)
	{
		let events = getEvents.call(this);
		if(!callback) {
			throw new Error('No callback is specified');
		}

		if(typeof callback != 'function') {
			throw new Error('Supplied callback is not a function');
		}

		(Array.isArray(event) ? event : [event]).forEach((event) => {
			let cb = function() {
				this.off(event,cb);
				callback.apply(this,arguments);
			};
			this.on(event,cb);
		});
		return this;
	}

	emit(event,args)
	{
		let events = getEvents.call(this);
		if(!event) {
			throw new Error('No event(s) specified');
		}

		//is empty object
		if(Object.keys(events).length === 0 && events.constructor === Object) {
			return this;
		}

		(Array.isArray(event) ? event : [event]).forEach((event) => {
			let ns,ns_event_type,cb;

			//check if this event is namespaced
			for(let event_type in events) {

				//check if event_type is namespaced - e.g. NAMESPACE.event_name
				ns = event_type.split('.');
				ns_event_type = ns.length > 1 ? ns[1] : event_type;

				if(ns_event_type == event) {
					for( let i in events[event_type] ) {
						(cb = events[event_type][i]) && cb.apply(this,args || []);
					}
				}

			}

		});
		return this;
	}

	off(event,callback)
	{
		let events = getEvents.call(this);
		if(!event) {
			clearEvents.call(this);
			return this;
		}

		(Array.isArray(event) ? event : [event]).forEach((event) => {

			if(!events[event]) { 
				return; 
			}

			if(!callback) { 
				delete events[event]; 
				return;
			}

			events[event] = events[event].filter((cb) => {
				return cb !== callback;
			});

		});

		return this;
	}

}
