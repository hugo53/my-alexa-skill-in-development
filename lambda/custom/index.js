'use strict';
var Alexa = require("alexa-sdk");

var APP_ID = process.env.APP_ID;

var languageStrings = {
  'en-US': {
    'translation': {
      'BYE': 'Good bye.',
      'ASK_BIRTHDAY': 'Please tell me your birthday.',
      'ASK_BIRTHDAY_AGAIN': 'Sorry, I couldn\'t understand.  Please tell me your birthday.',
      'ANSWER_REST_OF_YOUR_LIFE': 'Rest of your life is 18,250 days.  It is 438,000 hours.'
    }
  },
  'ja-JP': {
    'translation': {
      'BYE': '終了します。',
      'ASK_BIRTHDAY': 'あなたの誕生日を教えてください。',
      'ASK_BIRTHDAY_AGAIN': 'すみません、わかりませんでした。あなたの誕生日を教えてください。',
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
    answeringBirthdayHandlers
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

// NOTE: Rest of life should be based on 平均余命
// see: http://www.mhlw.go.jp/toukei/saikin/hw/life/life10/01.html
var answeringBirthdayHandlers = Alexa.CreateStateHandler('_ANSWERING_BIRTHDAY_STATE', {
  'AnsweredBirthday': function () {
    var birthday = this.event.request.intent.slots.birthday.value;

    // NOTE: Log for debug, so remove it later
    console.log('birthday = ', birthday);

    this.handler.state = '';

    this.emit(':tell', this.t("ANSWER_REST_OF_YOUR_LIFE"));
  },
  'Unhandled': function () {
    this.handler.state = '_ANSWERING_BIRTHDAY_STATE';
    this.emit(':ask', this.t("ASK_BIRTHDAY_AGAIN"));
  }
});
