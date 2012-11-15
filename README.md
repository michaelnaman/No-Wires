No Wires
==========

AMD, MVC, IOC, DI JavaScript library. Mostly based on Robot Legs, but with tweaks for JavaScript. 

(AMD is provided by Require JS, if that isn't present then is falls back to claiming the NW global name space)

The driving idea behind the library is provide a complete framework for developers to work with.
The other idea behind this library is help ActionScript developers transition to JavaScript, as there
are many common concepts (eventDispatcher being one) that has been (almost) directly translated to JavaScript.


This is a largly unfinished library but it has the follwoing working;
<ul>
 <li>Class inheritance including extend and super method functionality provided by John Resig (there may but some tweeks
to this class down the line) http://ejohn.org/blog/simple-javascript-inheritance/</li>
<li>Strongly typed event dispatcher class that provides callback scope</li>
<li>Event and Payload event classes that provide the event object for dispatching events</li>
<li>Event map allows listeners on instances of the event dispatcher class to be stored in a map rather than listening directly tot he event dispatcher</li>
<li>Command map allows commands to be mapped to event</li>
<li>Injector class handles depandancy injection and invertion of control</li>
<li>Injector can map values and auto inject instances based on property name</li>
<li>Centralised event dispatcher instance injected into Actors, Commands and Mediators allowing instances to dispatch</li>
vents in the event disptacher and be able to be handled anywehre, decoupling all of your code.</li>
<li>Mediator and View classes (also treat these as not finished)</li>
</ul>

Things that are there but are in no way finished

<ul>
 <li>Package manager class enables loading of packages of JavaScript via Require JS</li>
<li>Mediator map class to map mediators and views (needs ALOT of work)</li>
<li>Some form state machine based on routing from History JS that can read from a config file</li>
and understand which packages are needed based on which URL route, then load the required
package via the package manager (also this is was started but has removed for the moment)
</li>
</ul>
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
