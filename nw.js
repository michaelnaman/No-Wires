/* Author : Michael Naman

No wirez provides the context for your JavaScript application and then everything including the kitchen sink

*/

(function(undefined)
{
	function createNW()
	{
		var nw = {};
		nw.cls = {
			models : {},
			commands : {},
			views : {},
			mediators : {},
			utils : {}
		};

		
		//**EVENT DISPATCHER****************************************************
		nw.cls.EventDispatcher = Class.extend(
		{
			eventMap : Object,
					
			init : function()
			{
				eventMap = {};
			},
						
			addEventListener : function(eventString, handler, handlerScope, useOnce)
			{
				if (useOnce === undefined || useOnce === null)
				{
					useOnce = false;
				}

				if (typeof this.eventMap[eventString] === "undefined")
				{
					this.eventMap[eventString] = [];
				}
				//--SHOULD LOOP THROUGH ARRAY AND TEST FOR DUPLICATE HANLDER AND SCOPE MAYBE??
				this.eventMap[eventString].push({callback:handler, scope:handlerScope, useOnce : useOnce});
			},
			
			removeEventListener : function(eventString, handler, handlerScope)
			{
				if (typeof this.eventMap[eventString] !== "undefined")
				{
					var tArray = this.eventMap[eventString];
					var i = tArray.length - 1;
					for (i; i >= 0; i--)
					{
						var obj = tArray[i];
						if (obj.callback === handler && obj.scope === handlerScope)
						{
							tArray.splice(i,1);
							if (tArray.length === 0)
							{
								delete  this.eventMap[eventString];
							}
						}
					}
				}
			},
			
			dispatch : function(event)
			{
				var i, tArray, l, callbackObj;
				if (typeof this.eventMap[event.type] !== "undefined")
				{
					tArray = this.eventMap[event.type];
					i = tArray.length - 1;
					for (i; i >= 0; i--)
					{
						callbackObj = tArray[i];
						callbackObj.callback.call(callbackObj.scope, event);
						if (callbackObj.useOnce)
						{
							tArray.splice(i,1);
							if (tArray.length === 0)
							{
								delete  this.eventMap[eventString];
							}
						}
					}
				}
				
				if (typeof this.eventMap["all"] !== "undefined")
				{
					tArray = this.eventMap["all"];
					l = tArray.length;
					i = 0;
					for (i; i<l; ++i)
					{
						callbackObj = tArray[i];
						callbackObj.callback.call(callbackObj.scope, event);
					}
				}
			}
		});
		
		
		//**EVENT CLASSES*****************************************************************
		nw.cls.Event = Class.extend(
		{
			baseType : "Event",
			type : null,
			currentTarget : null,

			init : function(type, currentTarget)
			{
				this.type = this.baseType+":"+type;
				this.currentTarget = currentTarget;
			}
		});

		nw.cls.PayloadEvent = nw.cls.Event.extend(
		{
			baseType : "PayloadEvent",
			payload : null,
			
			init : function(type, currentTarget, payload)
			{
				this._super(type, currentTarget);

				this.payload = payload;
			}
		});

		nw.cls.NwEvent = nw.cls.PayloadEvent.extend(
		{
			baseType : "NwEvent"
		});


		//**EVENT MAP*****************************************************************
		nw.cls.EventMap = Class.extend(
		{
			mappedEvents : [],

			mapEvent : function(dispatcher, eventType, handler, handlerScope)
			{
				//--REPLACE WITH DICTIONARY THAT CAN TAKE OBJECTS AS KEYS
				//--ADD IN THE NEW AWESOME WAY TO DO THIS!!! :o)
				this.mappedEvents.push({dispatcher : dispatcher,
										eventType : eventType,
										handler : handler,
										handlerScope : handlerScope
										});

				dispatcher.addEventListener(eventType, handler, handlerScope);
			},

			unmapEvent : function(dispatcher, eventType, handler, handlerScope)
			{
				//--REPLACE WITH DICTIONARY THAT CAN TAKE OBJECTS AS KEYS
				//--ADD IN THE NEW AWESOME WAY TO DO THIS!!! :o)
				var l = this.mappedEvents.length;
				var i = 0;
				for (i; i < l; i++)
				{
					var obj = this.mappedEvents[i];
					if (obj.dispatcher === dispatcher)
					{
						dispatcher.removeEventListener(eventType, handler, handlerScope);
						break;
					}
				}
			},

			unmapAllListeners : function()
			{
				var l = this.mappedEvents.length;
				var i = 0;
				for (i; i < l; i++)
				{
					var obj = this.mappedEvents[i];
					obj.dispatcher.removeEventListener(eventType, obj.handler, obj.handlerScope);
				}

				this.mappedEvents = [];
			}
		});
	

		//**DEPENDANCY INJECTOR****************************************************
		nw.cls.Injector = Class.extend(
		{
			injectOnRegister : true,
			map : {},
			classMap : {},
			eventBus : null,
			commandMap : null,
			
			init : function(eventBus , injectOnRegister)
			{
				this.injectOnRegister = (injectOnRegister === undefined) ? false : injectOnRegister;
				
				this.map = {};
				this.classMap = {};

				this.eventBus = eventBus;
				this.eventBus.addEventListener("NwEvent:startUp", this.handleStartUp, this);
			},
			
			setCommandMap : function(commandMap)
			{
				this.commandMap = commandMap;
			},
			
			mapSingleton : function(name, ClassObj)
			{
				var instance = new ClassObj();
				this.mapInstance(name, instance);
			},
			
			mapInstance : function (name , instance)
			{
				if (this.injectOnRegister)
				{
					this.injectInto(instance);
				}
				this.map[name] = instance;
			},

			mapClass : function (name, ClassObj)
			{
				this.classMap[name] = ClassObj;
			},
			
			unmap : function(name)
			{
				//--CHECK INSTANCES
				if (typeof this.map[name] !== "undefined")
				{
					delete this.map[name];
				}

				//--CHECK CLASS OBJECTS
				if (typeof this.classMap[name] !== "undefined")
				{
					delete this.classMap[name];
				}
			},

			getInstance : function(name)
			{
				var instance = this.map[name];
				if (instance === null || instance === undefined)
				{
					throw "Injector::getClass()::name: "+name+" mapping does not exist";
				}
				return instance;
			},

			getClass : function(name)
			{
				var ClassObj = this.classMap[name];
				if (ClassObj === null || ClassObj === undefined)
				{
					throw "Injector::getClass()::name: "+name+" mapping does not exist";
				}
				return ClassObj;
			},
			
			injectInto : function(instance, additional)
			{
				var i;
				for (i in instance)
				{
					//--MAPP CLASS INJECTORS FIRST SO THE PROPERTY IS ACTIVE
					if (this.classMap[i] !== undefined && typeof instance[i] !== 'function')
					{
						//--AWESOME BIT COMMING UP
						var tInstance = new this.classMap[i]();
						this.injectInto(tInstance);
						instance[i] = tInstance;
						//--YEAH, YOU READ THAT RIGHT :o)
					}

					if (this.map[i] !== undefined && typeof instance[i] !== 'function')
					{
						instance[i] = this.map[i];
					}
				}
				
				if (additional !== undefined)
				{
					for (i in additional)
					{
						instance[i] = additional[i];
					}
				}
			},
			
			handleStartUp : function(event)
			{
				this.eventBus.removeEventListener("NwEvent:startUp", this.handleStartUp, this);
				this.startUp();
			},
			
			startUp : function()
			{
				var i;
				for (i in this.map)
				{
					var instance = this.map[i];
					this.injectInto(instance);
				}

				delete this.handleStartUp;
				delete this.startUp;
			}
		});

		//**MODEL****************************************************
		nw.cls.Actor = nw.cls.EventDispatcher.extend(
		{
			store : Object,
			eventBus : null,
			lastChanged : Object,

			init : function()
			{
				store = {};
			},

			set : function(obj)
			{
				this.lastChanged = {};
				var i;
				for (i in obj)
				{
					this.store[i] = obj[i];
					this.lastChanged[i] = obj[i];
				}
				this.dispatch(new nw.cls.NwEvent("updated", this, this.lastChanged));
			},

			get : function(propertyKey)
			{
				return this.store[propertyKey];
			},

			del : function(propertyKey)
			{

				if (typeof this.store[propertyKey] !== "undefined")
				{
					delete this.store[propertyKey];
					this.dispatch(new nw.cls.NwEvent("delete", this, propertyKey));
				}
			},

			getLastChanged : function()
			{
				var t = this.lastChanged;
				this.lastChanged = {};
				return t;
			}
		});

		//**COMMAND****************************************************
		nw.cls.Command = Class.extend(
		{
			eventBus : null,
			event : null,

			execute : function()
			{
			}
		});
		
		//**COMMAND MAP****************************************************
		nw.cls.CommandMap = Class.extend(
		{
			injector : null,
			eventBus : null,
			map : {},
			
			init : function(eventBus, injector)
			{
				this.eventBus = eventBus;
				this.eventBus.addEventListener("all", this.handleEvent, this);
				this.injector = injector;
			},
			
			mapEvent : function(eventType , command, useOnce)
			{
				useOnce = (useOnce === undefined) ? false : useOnce;
				
				if (typeof this.map[eventType] === "undefined")
				{
					this.map[eventType] = [];
				}
				this.map[eventType].push({command:command, useOnce:useOnce});
			},
			
			unMapCommand : function (eventType, command)
			{
				if (typeof this.map[eventType] !== "undefined")
				{
					var tArray = this.map[event.type];
					var l = tArray.length;
					var i = 0;
					for (i = l-1; i >= 0; --i)
					{
						var commandObj = tArray[i];
						if (command == commandObj.command)
						{
							tArray.splice(i,1);
						}
					}
				}
			},
			
			handleEvent : function(event)
			{
				if (this.map.hasOwnProperty(event.type))
				{
					var tArray = this.map[event.type];
					var l = tArray.length;
					var i = 0;
					for (i = l-1; i >= 0; --i)
					{
						var commandObj = tArray[i];
						var command = new commandObj.command();
						
						this.injector.injectInto(command, {event : event});
						
						command.execute();
						
						if (commandObj.useOnce)
						{
							tArray.splice(i,1);
						}
					}
				}
			}
		});

		
		//**MEDIATOR MAP*************************************************
		nw.cls.MediatorMap = Class.extend(
		{
			classMap : Object,
			viewMap : Object,
			injector : null,
			eventDispatcher : null,
			eventMapClass : null,
			
			init : function(injector, eventDispatcher, eventMapClass)
			{
				this.injector = injector;
				this.eventDispatcher = eventDispatcher;
				this.eventMapClass = eventMapClass;

				this.classMap = {};
				this.viewMap = {};
			},
			
			setEventMapClass : function(eventMapClass)
			{
				this.eventMapClass = eventMapClass;
			},

			mapView : function(ViewClass, MediatorClass)
			{
				if (!this.classMap.hasOwnProperty(ViewClass))
				{
					this.classMap[ViewClass] =
					{
						ViewClass : ViewClass,
						MediatorClass : MediatorClass
					};
				}
				else
				{
					throw "ERROR - MediatorMap::classMap already has "+ViewClass+" mapped";
				}
			},

			instantiateViewAndMediator : function(ViewClass)
			{
				if (typeof this.classMap[ViewClass] !== "undefined")
				{
					var obj = this.classMap[ViewClass];
					var returnObj = {};
					returnObj.view = new obj.ViewClass();
					returnObj.mediator = new obj.MediatorClass();

					this.injector.injectInto(mediator);
					mediator.eventMap = new this.eventMapClass();

					return returnObj;
				}
				else
				{
					throw "ERROR - MediatorMap::instantiateView() : unable to locate view: "+ViewClass;
				}
			},

			unmapView : function(ViewClass)
			{
				if (this.classMap.hasOwnProperty(ViewClass))
				{
					delete this.classMap[ViewClass];
				}
			}
		});

		//**ABSTRACT VIEW MEDIATOR******************************************
		nw.cls.AbstractMediator = Class.extend(
		{
			view : null,
			eventBus : null,
			commandMap : null,
			eventMap : null,
						
			onRegister : function()
			{
				
			},
			
			onUnRegister : function()
			{
				
			},

			clearEventMap : function()
			{
				this.eventMap.unmapAllListeners();
			}
		});

		//**ABSTRACT VIEW*********************************************
		nw.cls.AbstractView = nw.cls.EventDispatcher.extend(
		{
			template : null,
			domElement : null,

			render : function()
			{

			},

			addedToDom : function()
			{
				//--create DOM element here
			},

			removedFromDom : function()
			{

			}
		});

		nw.eventBus = new nw.cls.EventDispatcher();
		nw.injector = new nw.cls.Injector(nw.eventBus, false);
		nw.commandMap = new nw.cls.CommandMap(nw.eventBus, nw.injector);
		nw.injector.setCommandMap(nw.commandMap);
		nw.mediatorMap = new nw.cls.MediatorMap();

		//--NOW MAP CORE INSTANCES AND CLASSES SO THEY CAN BE INJECTED
		nw.injector.mapInstance("eventBus", nw.eventBus);
		nw.injector.mapInstance("injector", nw.injector);
		nw.injector.mapInstance("commandMap", nw.commandMap);
		nw.injector.mapClass("eventMap", nw.cls.EventMap);
		nw.injector.mapClass("eventDispatcher", nw.cls.EventDispatcher);


		nw.startUp = function()
		{
			console.log("nw.startUp()");
			this.eventBus.dispatch(new nw.cls.NwEvent("startUp", this));

			//--NOT SURE IF THIS'LL WORK
			//--clean up, don't let anyone fire this twice.
			delete this.startUp;
		};

		nw.print = function()
		{
			if (typeof console != "undefined")
			{
				console.log("NW: ",this);
			}
		};
		
		return nw;
	}

	//--TEST TO SEE IF REQUIRE JS IS PRESENT,
	if (typeof define !== "undefined")
	{
		define(createNW);
	}
	else
	{
		//--IF NOT CLAIM THE "NW" GLOBAL NAMESPACE
		NW = createNW();
	}
})();


