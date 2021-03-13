// Example WAMP client for AutobahnJS connecting to a Crossbar.io WAMP router.

// AutobahnJS, the WAMP client library to connect and talk to Crossbar.io:
var autobahn = require('autobahn');

console.log("Running AutobahnJS " + autobahn.version);

// We read the connection parameters from the command line in this example:
//const url = process.env.CBURL;
//const realm = process.env.CBREALM;

// Make us a new connection ..
var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:8080/ws',
   realm: 'realm1'});

// .. and fire this code when we got a session
connection.onopen = function (session, details) {
   console.log("session open!", details);

  
   var counter = 0;

   setInterval(function () {
      console.log("publishing to topic 'com.myapp.hello': " + "Hello World "+counter);
      session.publish('com.myapp.hello', ['Hello World ' + counter]);
//      document.getElementById('WAMPEvent').innerHTML =  "Event: Hello World "+counter;
      counter += 1;
   }, 1000);

   // Your code goes here: use WAMP via the session you got to
   // call, register, subscribe and publish ..

//   connection.close();
};

// .. and fire this code when our session has gone
connection.onclose = function (reason, details) {
   console.log("session closed: " + reason, details);
}

// Don't forget to actually trigger the opening of the connection!
connection.open();
