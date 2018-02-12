'use strict';
var Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('AskYourBirthday');
  },

  'BirthdayIsIntent': function () {
    // TODO: Save birthday into somewhere in session
    var birthday = this.event.request.intent.slots.birthday.value;

    this.emit('AskHowLongYouWantToLive');
  },

  'LastAgeIsIntent': function () {
    // TODO: Save lastAge into somewhere in session
    var lastAge = this.event.request.intent.slots.lastAge.value;

    this.emit('AnserRestOfYourLife');
  },

  'SessionEndedRequest' : function() {
    console.log('Session ended with reason: ' + this.event.request.reason);
  },

  'Unhandled' : function() {
    this.emit(':tell', "Sorry, I didn't get that.");
  },

  'AskYourBirthday': function () {
    this.emit(':ask', 'Please tell me your birthday.');
  },

  'AskHowLongYouWantToLive': function () {
    this.emit(':ask', 'Please tell me how long you want to live.');
  },

  'AnserRestOfYourLife': function () {
    // TODO: Calculate a rest of your life from birthday and lastAge

    this.emit(':tell', 'Rest of your life is 18,250 days.  It is 438,000 hours.');
  }
};
