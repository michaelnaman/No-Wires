JS-RL-port
==========

AMD, MVC, IOC, DI JavaScript library. Mostly based on Robot Legs, but with tweaks for JavaScript. 

(AMD is provided by Require JS, if that isn't present then is falls back to claiming the NW global name space)

The driving idea behind the library is provide a complete framework for developers to work with.
The other idea behind this library is help ActionScript developers transition to JavaScript, as there
are many common concepts (eventDispatcher being one) that has been (almost) directly translated to JavaScript.


This is a largly unfinished library but it has the follwoing working;

-Class inheritance including extend and super method functionality provided by John Resig (there may but some tweeks
to this class down the line) http://ejohn.org/blog/simple-javascript-inheritance/
-Strongly typed event dispatcher class that provides callback scope
-Event and Payload event classes that provide the event object for dispatching events
-Event map allows listeners on instances of the event dispatcher class to be stored in a map rather than directly
-Command map allows commands to be mapped to event
-Injector class handles depandancy injection and invertion of control
-Injector can map values and auto inject instances based on property name
-Centralised event dispatcher instance injected into Actors, Commands and Mediators allowing instances to dispatch 
events in the event disptacher and be able to be handled anywehre, decoupling all of your code.
-Mediator and View classes (also treat these as not finished)

Things that are there but are in no way finished

-Package manager class enables loading of packages of JavaScript via Require JS
-Mediator map class to map mediators and views (needs ALOT of work)
-Some form state machine based on routing from History JS that can read from a config file
and understand which packages are needed based on which URL route, then load the required
package via the package manager (also this is was started but has removed for the moment)

Things that need some thought

-Compiler - evey library needs a compiler and so does this one. The compiler needs to be able to read
 the state machine config and package all of the JS files per package into one file, then update
 the config file to point to the one, mushed up minified file
-tests - nothing like releaseing code with out tests
-have a look at how the dependancies are managed Require JS and History JS

Other bits

-There is a name and a logo but am not happy with it
-Examples - this is one example of the parts that working

Dependancies

-John Resigs Class inheritance http://ejohn.org/blog/simple-javascript-inheritance/
-Require JS (not essential and I don;t think this currently works as I've not tested it)
http://ejohn.org/blog/simple-javascript-inheritance/


Like I said this is only an experiment, it may go somewhere, it may not.
