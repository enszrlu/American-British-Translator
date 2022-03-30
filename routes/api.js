'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let text = req.body.text;
      let locale = req.body.locale;


      if (text == "") {
        return res.json({ error: 'No text to translate' })
      }
      if (!text || !locale || locale == "") {
        return res.json({ error: 'Required field(s) missing' })
      }


      if (locale == "american-to-british") {
        let translation = translator.americanToBritishTranslator(text);
        if (translation.toLowerCase() == text.toLowerCase()) {
          return res.json({ text: text, translation: "Everything looks good to me!" })
        }
        res.json({ text: text, translation: translation })
      }
      else if (locale == "british-to-american") {
        let translation = translator.britishToAmericanTranslator(text);
        if (translation.toLowerCase() == text.toLowerCase()) {
          return res.json({ text: text, translation: "Everything looks good to me!" })
        }
        res.json({ text: text, translation: translation })
      }
      else {
        return res.json({ error: 'Invalid value for locale field' })
      }

    });
};
