'use strict';
var Alexa = require("alexa-sdk");

var APP_ID = process.env.APP_ID;

var languageStrings = {
  'en-US': {
    'translation': {
      'BYE': 'Good bye.',
      'ASK_BIRTHDAY': 'Please tell me your birthday.',
      'ASK_LAST_AGE': 'Please tell me how long you want to live.',
      'ANSWER_REST_OF_YOUR_LIFE': 'Rest of your life is 18,250 days.  It is 438,000 hours.'
    }
  },
  'ja-JP': {
    'translation': {
      'BYE': '終了します。',
      'ASK_BIRTHDAY': 'あなたの誕生日を教えてください。',
      'ASK_LAST_AGE': 'あなたは何歳まで生きたいですか。',
      'ANSWER_REST_OF_YOUR_LIFE': 'あなたの残りの人生は18,250日で、時間で表すと438,000時間です。'
    }
  }
};

exports.handler = function(event, context) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.resources = languageStrings;
  alexa.registerHandlers(
    handlers,
    askingBirthdayHandlers,
    answeringBirthdayHandlers,
    askingLastAgeHandlers,
    answeringLastAgeHandlers
  );
  alexa.execute();
};

var handlers = {
  "LaunchRequest": function () {
    this.emit('CalculateRestOfYourLife');
  },
  "CalculateRestOfYourLife": function () {
    this.handler.state = '_ASKING_BIRTHDAY_STATE';
    this.emitWithState('Unhandled');
  },
  "AMAZON.CancelIntent": function() {
    this.emit(':tell', this.t("BYE"));
  },
  "AMAZON.StopIntent": function() {
    this.emit(':tell', this.t("BYE"));
  }
};

var askingBirthdayHandlers = Alexa.CreateStateHandler('_ASKING_BIRTHDAY_STATE', {
  'Unhandled': function () {
    this.handler.state = '_ANSWERING_BIRTHDAY_STATE';
    this.emit(':ask', this.t("ASK_BIRTHDAY"));
  }
});

var answeringBirthdayHandlers = Alexa.CreateStateHandler('_ANSWERING_BIRTHDAY_STATE', {
  'AnsweredBirthday': function () {
    var birthday = this.event.request.intent.slots.birthday.value;

    this.handler.state = '_ASKING_LAST_AGE_STATE';
    this.emitWithState('Unhandled');
  }
});

var askingLastAgeHandlers = Alexa.CreateStateHandler('_ASKING_LAST_AGE_STATE', {
  'Unhandled': function () {
    this.handler.state = '_ANSWERING_LAST_AGE_STATE';
    this.emit(':ask', this.t("ASK_LAST_AGE"));
  }
});

var answeringLastAgeHandlers = Alexa.CreateStateHandler('_ANSWERING_LAST_AGE_STATE', {
  'AnsweredLastAge': function () {
    var lastAge = this.event.request.intent.slots.lastAge.value;

    this.handler.state = '';
    this.emit(':tell', this.t("ANSWER_REST_OF_YOUR_LIFE"));
  }
});
