const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

const britishToAmericanSpelling = swap(americanToBritishSpelling);
const britishToAmericanTitles = swap(americanToBritishTitles);

const americanToBritDict = { ...americanToBritishTitles, ...americanOnly, ...americanToBritishSpelling }

const britishToAmericanDict = { ...britishToAmericanTitles, ...britishOnly, ...britishToAmericanSpelling }

class Translator {
    translate(text, dict) {
        let searchText = text.toLowerCase();
        let translatedText = text;

        Object.keys(dict).forEach((key) => {
            if (searchText.includes(key)) {

                if (searchText.indexOf(key) == 0) {
                    let re = new RegExp('(' + key + ')( |\\.|-|\\!|\\?)', "ig");
                    translatedText = translatedText.replace(re, '<span class="highlight">' + dict[key] + '</span>' + "$2");
                }
                else {
                    let re = new RegExp('( |-)(' + key + ')( |\\.|-|\\!|\\?)', "ig");
                    translatedText = translatedText.replace(re, "$1" + '<span class="highlight">' + dict[key] + '</span>' + "$3");
                }

                searchText = translatedText.toLowerCase();
            }
        })

        if (translatedText.charAt(0) == "<") {
            translatedText = translatedText.slice(0, 24) + translatedText.charAt(24).toUpperCase() + translatedText.slice(25);
        }
        else {
            translatedText = translatedText.charAt(0).toUpperCase() + translatedText.slice(1);
        }

        console.log("Text: " + text)
        console.log("Translated Text: " + translatedText)
        return translatedText;
    }

    americanToBritishTranslator(text) {
        let translatedText = this.translate(text, americanToBritDict);

        let timeRegex = /(\d\d?):(\d\d)/;
        translatedText = translatedText.replace(timeRegex, '<span class="highlight">' + "$1" + "." + "$2" + '</span>');

        return translatedText
    }

    britishToAmericanTranslator(text) {
        let translatedText = this.translate(text, britishToAmericanDict);

        let timeRegex = /(\d\d?).(\d\d)/;
        translatedText = translatedText.replace(timeRegex, '<span class="highlight">' + "$1" + ":" + "$2" + '</span>');

        return translatedText
    }


}

module.exports = Translator;