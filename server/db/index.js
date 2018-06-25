const mongoose = require('mongoose')
const connection = mongoose.connection;
const mockData = require('../models/data.js')

mongoose.connect('mongodb://localhost/lex');

// connection.once('open', function() {
//   console.log('we are connected')
// })


let lexiconSchema = mongoose.Schema({
  word: String,
  username: String,
  antonyms: [],
  synonyms: [],
  examples: [],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

let Thesaurus = mongoose.model('Thesaurus', lexiconSchema);


let save = function(document, cb) {
  // console.log('IN DB SAVE FUNC', document)
  // save only words that are found
  if (document) {
    Thesaurus.create(document, (err, res) => {
      if (cb) cb(err, res)
      // console.log(err, res)
    })
  }
}

let query = function(query, cb) {
  return Thesaurus.find(query)
}


let removeOne = function(query, cb) {
  // Thesaurus.deleteOne(query, function(err) {
  //   if (cb) cb(err)
  // });
  Thesaurus.findOneAndRemove(query, cb)
}

// console.log(Thesaurus)
var testdata = {
  word: 'happy',
  username: 'Mary',
  synonyms: [ 'contented','jocular'],
  antonyms: [ 'sad' ],
  examples: [ 'Melissa came in looking happy and excited' ],
  createdAt: new Date(2017, 01, 02) }

// example save and query func usage
// console.log('****** saving....')
// save(testdata)

// query({"created": {"$gte": new Date(2018, 4, 18), "$lt": new Date(2018, 6, 17)}}).exec(function(err, matchedDoc) {
//     if (matchedDoc[0]) {
//       console.log('found')
//     } else console.log('not-found')
// })

// query({"created": {"$gte": new Date(2018, 6, 18), "$lt": new Date(2018, 6, 17)}})
// .then(function(matchedDoc) {
//   console.log('in then')
//   if (matchedDoc.length === 0) throw new Error('not found')
//   console.log(matchedDoc)
//   // send this
// })
// .catch(function(err) {
//   console.log('in err')
//   console.log(err)
//   if (err === 'not found') {
//     // call API
//   }
// })


module.exports.save = save;
module.exports.query = query
module.exports.removeOne = removeOne;
module.exports.connection = connection;