export default class EventEmitter {

	constructor()
	{

	}

	_eventEmitterEvents()
	{
		return this.eventEmitterEvents || (this.eventEmitterEvents = {});
	}

	_clearEventEmitterEvents()
	{
		this.eventEmitterEvents = {};
	}

	on(event,callback)
	{
		var events;

		if(!event) {
			throw new Error('No event(s) specified');
		}

		if(!callback) {
			throw new Error('No callback is specified');
		}

		if(typeof callback != 'function') {
			throw new Error('Supplied callback is not a function');
		}

		events = this._eventEmitterEvents();
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
		var events;
		if(!callback) {
			throw new Error('No callback is specified');
		}

		if(typeof callback != 'function') {
			throw new Error('Supplied callback is not a function');
		}

		events = this._eventEmitterEvents();
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
		var events;
		if(!event) {
			throw new Error('No event(s) specified');
		}

		events = this._eventEmitterEvents();

		//is empty object
		if(Object.keys(events).length === 0 && events.constructor === Object) {
			return this;
		}

		(Array.isArray(event) ? event : [event]).forEach((event) => {
			var ns,ns_event_type;

			//check if this event is namespaced
			for(let event_type in events) {

				//check if event_type is namespaced - e.g. NAMESPACE.event_name
				ns = event_type.split('.');
				ns_event_type = ns.length > 1 ? ns[1] : event_type;

				if(ns_event_type == event) {
					for( let i in events[event_type] ) {
						events[event_type][i].apply(this,args || []);
					}
				}

			}

		});
		return this;
	}

	off(event,callback)
	{
		var events;
		if(!event) {
			this._clearEventEmitterEvents();
			return this;
		}


		events = this._eventEmitterEvents();

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