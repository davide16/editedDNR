"use strict";
var autobahn = require('autobahn');
console.log("Running AutobahnJS " + autobahn.version);

var sess;
//var mqtt = require('mqtt')
var {parse} = require('flatted/cjs');
var broker;
var dnrInterface = require('dnr-interface')
const TOPIC_DNR_HB = dnrInterface.TOPIC_DNR_HB
const TOPIC_REGISTER = dnrInterface.TOPIC_REGISTER
const TOPIC_REGISTER_ACK = dnrInterface.TOPIC_REGISTER_ACK
const TOPIC_REGISTER_REQ = 'register_req'
const TOPIC_DNR_SYN_REQ = dnrInterface.TOPIC_DNR_SYN_REQ
const TOPIC_DNR_SYN_RES = dnrInterface.TOPIC_DNR_SYN_RES
const TOPIC_DNR_SYN_RESS = dnrInterface.TOPIC_DNR_SYN_RESS
const TOPIC_FLOW_DEPLOYED = dnrInterface.TOPIC_FLOW_DEPLOYED
const TOPIC_MODULE_INSTALLING = dnrInterface.TOPIC_MODULE_INSTALLING
const TOPIC_MODULE_INSTALLED = dnrInterface.TOPIC_MODULE_INSTALLED
const TOPIC_MODULE_INSTALL_FAILED = dnrInterface.TOPIC_MODULE_INSTALL_FAILED
const TOPIC_MODULE_DELETING = dnrInterface.TOPIC_MODULE_DELETING
const TOPIC_MODULE_DELETED = dnrInterface.TOPIC_MODULE_DELETED
const TOPIC_MODULE_DELETE_FAILED = dnrInterface.TOPIC_MODULE_DELETE_FAILED
const TOPIC_MODULE_UPDATING = dnrInterface.TOPIC_MODULE_UPDATING
const TOPIC_MODULE_UPDATED = dnrInterface.TOPIC_MODULE_UPDATED
const TOPIC_MODULE_UPDATE_FAILED = dnrInterface.TOPIC_MODULE_UPDATE_FAILED

function Broker(){
  broker = this
  broker.subscription = {} //  subscriber, topic, callback
  broker.topics = {}
  broker.endpoint = 'ws://192.168.56.101:8080/ws'

  this.connect()
 //  this.disconnect()
}
Broker.prototype.disconnect = function() {
     var connection = new autobahn.Connection({
     url: 'ws://192.168.56.101:8080/ws',
     realm: 'realm1'});

    connection.onclose = function (reason, details) {
    console.log("session closed: " + reason, details);
  }
//  connection.close();
}
Broker.prototype.connect = function() {
     var connection = new autobahn.Connection({
     url: 'ws://192.168.56.101:8080/ws',
     realm: 'realm1'});
  // .. and fire this code when we got a session
    connection.onopen = function (session,details) {

          function my_subscribe(session_id)
          {
            console.log("Connected with session ID " + session_id, details);

            var topics = [
              TOPIC_DNR_HB,
              TOPIC_REGISTER,
              TOPIC_REGISTER_ACK,
              TOPIC_REGISTER_REQ,
              TOPIC_DNR_SYN_REQ,
              TOPIC_DNR_SYN_RES,
              TOPIC_DNR_SYN_RESS,
              TOPIC_FLOW_DEPLOYED,
              TOPIC_MODULE_INSTALLING,
              TOPIC_MODULE_INSTALLED,
              TOPIC_MODULE_INSTALL_FAILED,
              TOPIC_MODULE_DELETING,
              TOPIC_MODULE_DELETED,
              TOPIC_MODULE_DELETE_FAILED,
              TOPIC_MODULE_UPDATING,
              TOPIC_MODULE_UPDATED,
              TOPIC_MODULE_UPDATE_FAILED,
           ];

            for (var j = 0; j < topics.length; ++j) {
                // subscribe to all of above NodeRed events
           broker.subscribe(session_id, topics[j]);
           console.log("publishing to topic " + topics[j] + " Hello World ");
       	 	 session.publish(topics[j], ['Hello World ']);
         }
      }

// wamp.session.list
// wamp.session.get
// my_subscribe
function list_sessions () {
   if (session) {
     var reason="vediamo";
     var message="se funziona";
      session.call("wamp.session.list").then(
         function (sessions) {
            console.log("Current session IDs on realm", sessions);
            for (var i = 0; i < sessions.length; ++i) {
               var len = sessions.length-1;

                 my_subscribe(sessions[len]);

               session.call("wamp.session.get", [sessions[i]]).then(
                  function (session_details) {
                     console.log(session_details);
                  },
                  function (err) {
                     console.log(err);
                  }
               );
            }
         },
         function (err) {
            console.log("Could not retrieve subscription for topic", err);
         }
      );
   } else {
      console.log("not connected");
   }
}
//main
        list_sessions();

  //onopen function end
    };

connection.open();

//broker.connect function end
};

Broker.prototype.subscribe = function(subscriber, topic, cb) {
  let that = this
 // console.log("SESSION "+sess)
	if (this.subscription[subscriber]) {
    // updating old topic
    let oldTopic = this.subscription[subscriber].topic
    if (oldTopic === topic){
      return
    }

    if (this.topics[oldTopic]){
      this.topics[oldTopic]--
    }
    if (this.topics[oldTopic] <= 0){
      broker.unsubscribe(oldTopic)
    }
  }

  if (!this.topics[topic]){
    this.topics[topic] = 1
    broker.subscribe(topic)
    console.log("Subscribed to: " + topic + " from subscriber: " + subscriber);
  } else {
    this.topics[topic]++
  }

  // either updating or create new
  this.subscription[subscriber] = {topic: topic, cb:cb}
}

Broker.prototype.unsubscribe = function(subscriber) {
  for (let k in this.subscription){
    if (k === subscriber){
      var topic = this.subscription[k].topic

      if (this.topics[topic]){
        this.topics[topic]--
        if (this.topics[topic] <= 0){
          broker.unsubscribe(topic)
        }
      }
      delete this.subscription[k]
    }
  }
}

Broker.prototype.publish = function(publisher, topic, msg) {
  broker.publish(topic, msg)
  //console.log("Publishing to: " + topic + " Message: " + msg);
}

module.exports = Broker
