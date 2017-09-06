'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);
	}

	_createClass(EventEmitter, [{
		key: '_eventEmitterEvents',
		value: function _eventEmitterEvents() {
			return this.eventEmitterEvents || (this.eventEmitterEvents = {});
		}
	}, {
		key: '_clearEventEmitterEvents',
		value: function _clearEventEmitterEvents() {
			this.eventEmitterEvents = {};
		}
	}, {
		key: 'on',
		value: function on(event, callback) {
			var events;

			if (!event) {
				throw new Error('No event(s) specified');
			}

			if (!callback) {
				throw new Error('No callback is specified');
			}

			if (typeof callback != 'function') {
				throw new Error('Supplied callback is not a function');
			}

			events = this._eventEmitterEvents();
			(Array.isArray(event) ? event : [event]).forEach(function (event) {
				if (!events[event]) {
					events[event] = [];
				}

				events[event].push(callback);
			});
			return this;
		}
	}, {
		key: 'one',
		value: function one(event, callback) {
			var _this = this;

			var events;
			if (!callback) {
				throw new Error('No callback is specified');
			}

			if (typeof callback != 'function') {
				throw new Error('Supplied callback is not a function');
			}

			events = this._eventEmitterEvents();
			(Array.isArray(event) ? event : [event]).forEach(function (event) {
				var cb = function cb() {
					this.off(event, cb);
					callback.apply(this, arguments);
				};
				_this.on(event, cb);
			});
			return this;
		}
	}, {
		key: 'emit',
		value: function emit(event, args) {
			var _this2 = this;

			var events;
			if (!event) {
				throw new Error('No event(s) specified');
			}

			events = this._eventEmitterEvents();

			//is empty object
			if (Object.keys(events).length === 0 && events.constructor === Object) {
				return this;
			}

			(Array.isArray(event) ? event : [event]).forEach(function (event) {
				var ns, ns_event_type;

				//check if this event is namespaced
				for (var event_type in events) {

					//check if event_type is namespaced - e.g. NAMESPACE.event_name
					ns = event_type.split('.');
					ns_event_type = ns.length > 1 ? ns[1] : event_type;

					if (ns_event_type == event) {
						for (var i in events[event_type]) {
							events[event_type][i].apply(_this2, args || []);
						}
					}
				}
			});
			return this;
		}
	}, {
		key: 'off',
		value: function off(event, callback) {
			var events;
			if (!event) {
				this._clearEventEmitterEvents();
				return this;
			}

			events = this._eventEmitterEvents();

			(Array.isArray(event) ? event : [event]).forEach(function (event) {

				if (!events[event]) {
					return;
				}

				if (!callback) {
					delete events[event];
					return;
				}

				events[event] = events[event].filter(function (cb) {
					return cb !== callback;
				});
			});

			return this;
		}
	}]);

	return EventEmitter;
}();

exports.default = EventEmitter;