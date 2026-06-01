//4.3.3 And here we'll import that custom module with logging events function we've just created.
const logEvents = require("./logEvents");

// 4.4.0 So here we'll import also the "events" common core module and assign it to "EventEmitter".
const EventEmitter = require("events");

// 4.4.1 Right after that we'll need to define a class "MyEmitter" that extends "EventEmitter" we have from "events" module.
class MyEmitter extends EventEmitter {
}

// 4.4.2 Let's initialize the object from that class.
const myEmitter = new MyEmitter();

// 4.4.3 Then we'll add a listener for the log event with "on" method added to that object and that's how we're going to listen for an event. We'll call it "log" event (similar to "addEventListener" method in Vanilla JS we can listen for any event we want to with first parameter). Then as a second parameter we're calling an anonymous arrow function with a parameter "message" passed in and then inside of that function calling that "logEvents" function, where we pass "message" in.
myEmitter.on("log", (message) => logEvents(message));

// 4.4.4 So now, when we're listening for the "log" event we need to go ahead and omit the event to test this out. Let's set a timeout, which let us understand better how everything is processed. (The timeout is just for example to set a short delay here emulating server delays, usually we don't have to do that.) We'll use again "myEmitter" with "omit" method used on it. Now we're not listening but emitting the event. And as a first parameter it'll have "log" event and as second parameter let's send a message (there can be more parameters, if it needs).
// (Go to [04-event-emitter/logEvents.js])
setTimeout(() => {
  myEmitter.emit("log", "Log event emitted");
}, 2000);
