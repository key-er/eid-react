const express = require('express');
const db = require('./db/index.js');
const api = require('../helpers/oxfordAPI.js')
const searchLexicon = api.searchLexicon;
const utils = require('../helpers/utils.js')
var query = utils.query;


let app = express();

app.use(express.static(__dirname + '/../client/dist'));

/// Middleware for parsing request body
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




app.post('/word', function(req, res) {
  // check db first
  console.log('******* in POST ***** ', req.body.word)

  query({word:req.body.word, username: req.body.username})
  .then((matchedDoc) => res.status(200).send(matchedDoc[0]))
  .catch((err) => {
    if (err !== 'not found') res.status(503).send('sever internal error')
    // not found in db, call API now
    if (err === 'not found') {
      searchLexicon(req.body.word, (err, data) => {
        if (err) res.status(404).send()
        else {
          console.log('saving in db')
          // append username to the api data before saving
          data.username = req.body.username;
          console.log(data)
          db.save(data)
          res.status(200).send(data)
        }
      });
    }
  })
})


// same thing as above but with get
app.get('/word/:word(\\D+)/', (req, res) => {
 const word = req.params.word
 console.log(req.params) // req.params = {word: <regexmatch>}
 query(req.params)
 .then((matchedDoc) => res.status(200).send(matchedDoc[0]))
 .catch((err) => {
  if (err === 'not found') {
    searchLexicon(word, (err, data) => {
      if (err) res.status(404).send()
      else {
        console.log('saving in db')
        console.log(data)
        db.save(data)
        res.status(200).send(data)
      }
    })
  }
  else res.status(503).send('sever internal error')
 })
})


// app.get('/word/:word(\\D+)/', function(req, res)  {
//   console.log('came in strings get', req.url)
//   console.log(req.params)
//   query({word: req.params.word})
//   .then(function(data) {
//     console.log('inside then')
//     res.status(200).send(data)
//   })
//   .catch((err) => res.status(404).send(err))

// })



app.get('/word/:from[0-9\-]{0}/', function (req, res) {
  console.log('came in DATE get')
  // the client sent a get request with username $.get('/user/2017-12-12' {username:'abc'})
  // on server we see it as "/word/2018-06-20?username=mary" and it exists in req.query

  console.log(req.query)

  var dateObj = new Date(req.params.from.split('-').join(','))

  query({'createdAt': {"$gte": dateObj}, username: req.query.username})
  .then((matchedDoc) => res.status(200).send(matchedDoc))
  .catch((err) => res.status(404).send(err))

});


let port = process.env.PORT || 8088;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
