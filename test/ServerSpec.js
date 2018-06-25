const expect = require('chai').expect;
const request = require('request')
const db = require('../server/db/index.js')
const utils = require('../helpers/utils.js')
// const save = db.save;
// const query = db.query;


describe('Testing database CRUD', function() {
  it('should save in db', (done) => {
    var testDocument = {
      word: 'testWord',
      synonyms: [ 'testSyn1','testSyn2'],
      antonyms: [ 'testAnt' ],
      examples: [ 'This is our testWord created on future date' ],
      createdAt: new Date(2018, 09, 02)
    }

    // saving
    db.save(testDocument)

    // reading saved
    db.query({word:'testWord'})
      .then(function(matchedDoc) {
        console.log(matchedDoc[0].word)
        expect(matchedDoc[0].word).to.equal('testWord')
        // done()
      })
      done()
   })


  it ('should delete from db', (done) => {
    // db.removeOne({word: 'testWord'}, function(e,r) {
    db.connection.db.collection('thesaurus').deleteMany({word:'testWord'})
    .then(() => {
      db.query({word:'testWord'})
      .then(function(matchedDoc) {
        console.log(matchedDoc.length)
        done()
        })
    })

    // })


    db.connection.db.collection('thesaurus').deleteMany({word:'testWord'})
  })
})


    // // deleting record (if exist)
    // db.removeOne({'word':'arcanetest'}, function(err, res) {
    //   if (err) console.log(err)
    //   else console.log('deleted')
    // })

    // // should return not-found as deleted
    // request('http://localhost:8080/word/arcanetest',  (err, res) => {
    //   console.log(res.body)
    // })

    // let options = {
    //   uri:'http://127.0.0.1:8080/word',
    //   method:'POST',
    //   'json': {
    //       'word': 'arcane',
    //     }
    // };

    // request(options, (err, res, body) => {
    //   request('http://localhost:8080/word/arcanetest', (err, res) => {
    //     console.log(res.body)
    //   })
    // })



    // request('http://localhost:8080/word/arcane', (err, res) => {
    //   console.log(res.body)
    // })


    // let document1 = {
    //   "word":"arcane",
    //   "examples":["the arcane world of the legal profession"],
    //   "synonyms":["mysterious","secret","hidden","concealed","covert","clandestine","enigmatic","dark"],
    //   "antonyms":["well known","open"]
    // }

    // let document2 = {
    //    "word" : "goad",
    //    "examples" : [ "he applied his goad energetically to the cattle's hindquarters" ],
    //    "synonyms" : [ "prod", "spiked stick", "spike", "staff", "crook", "pole", "rod" ],
    //    "antonyms" : [ "Not found" ]
    // }


    // db.save(document)

  // })


// })


xdescribe('HTTP Request', function() {

  db.removeOne({word: 'testWord'})
  it('should get the words', (done) => {
    var testDocument = {
      word: 'testWord',
      synonyms: [ 'testSyn1','testSyn2'],
      antonyms: [ 'testAnt' ],
      examples: [ 'This is our testWord created on future date' ],
      createdAt: new Date(2018, 09, 02)
    }

    // saving
    db.save(testDocument)
    request('http://localhost:8080/word/testWord', (err, res, body) => {
      console.log(body)
    })

  })
  xit ('should get the words', () => {
    request('http://localhost:8080/word/')

  })

  xit ('should err in non-existing word', () => {

  })

})