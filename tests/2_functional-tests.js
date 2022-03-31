const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

    test('Translation with text and locale fields', function (done) {
        chai.request(server).post('/api/translate').send({ text: 'Mangoes are my favorite fruit.', locale: "american-to-british" })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.', "Response body.translation should be correct");
                assert.equal(res.body.text, 'Mangoes are my favorite fruit.', "Response body.text should be correct");

                done();
            })
    });

    test('Translation with text and invalid locale field', function (done) {
        chai.request(server).post('/api/translate').send({ text: 'Mangoes are my favorite fruit.', locale: "americans-to-british" })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'Invalid value for locale field', "Response body.error should be correct");

                done();
            })
    });

    test('Translation with missing text field', function (done) {
        chai.request(server).post('/api/translate').send({ locale: "american-to-british" })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'Required field(s) missing', "Response body.error should be correct");

                done();
            })
    });

    test('Translation with missing locale field', function (done) {
        chai.request(server).post('/api/translate').send({ text: 'Mangoes are my favorite fruit.' })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'Required field(s) missing', "Response body.error should be correct");

                done();
            })
    });

    test('Translation with empty text', function (done) {
        chai.request(server).post('/api/translate').send({ text: '', locale: "american-to-british" })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'No text to translate', "Response body.error should be correct");

                done();
            })
    });

    test('Translation with text that needs no translation', function (done) {
        chai.request(server).post('/api/translate').send({ text: 'Mangoes are my favourite fruit.', locale: "american-to-british" })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.translation, 'Everything looks good to me!', "Response body.translation should be correct");
                assert.equal(res.body.text, 'Mangoes are my favourite fruit.', "Response body.text should be correct");

                done();
            })
    });
});
