const express = require('express');
const db = require('./db/index.js');
const api = require('../helpers/oxfordAPI.js')
const searchLexicon = api.searchLexicon;
const utils = require('../helpers/utils.js')
const request = require('request')
var query = utils.query;



let app = express();

app.use(express.static(__dirname + '/../client/dist'));

/// Middleware for parsing request body
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



app.get('/login', function(req, res) {
  res.redirect('https://github.com/login/oauth/authorize?client_id=6b9e164de8e098f9fe9c&redirect_uri=https://eid-react.herokuapp.com/auth')

})


app.get('/auth', function(req, res) {

  if (req.query.code) {

    let options = {
      url: 'https://github.com/login/oauth/access_token',
      client_id: process.env.github_secret.split('|')[0],
      client_secret: process.env.github_secret.split('|')[1],
      code: req.query.code,
      redirect_uri: 'https://eid-react.herokuapp.com/protected',
      state: req.query.state
    }

    request.post(options, function(err, response, body) {
      console.log('err in post', err)
      console.log('res in post')
      console.log('body in post', body)
      res.send('posted...')
    })
  }

  else {
    res.send('stats and code condition not match')
  }


})



// app.get('/auth', function(req, res) {
//   var code = req.query.code;

//   request.post({url:'https://github.com/login/oauth/access_token', cliend_id: '1a87845988b42de82d4c', client_secret:process.env.client_secret_oath, code:code}, function(e, r, body) {
//       console.log(body)
//       res.end('posted')
//   })
// })


app.get('/protected', function(req, res) {
  res.send('protected resource')
})

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
          if (data === null)  {
            data = { username: req.body.username, word:req.body.word, synonyms: ['not found'], antonyms: ['not found'], examples: ['not found'] }
            // don't save in db just send the response
            console.log('not saving in db')
            res.status(200).send(data)
          }
          else if (data !== null) {
            console.log('err/data fetched is:', err, data)
            // append username to the api data before saving
            data.username = req.body.username || 'guest';
            console.log('saving in db')
            db.save(data)
            res.status(200).send(data)
          }
        }
      });
    }
  })
})



app.get('/word/:word(\\D+)/', function(req, res)  {
  console.log('came in strings get', req.url)
  console.log(req.params)
  query({word: req.params.word})
  .then(function(data) {
    console.log('inside then')
    res.status(200).send(data)
  })
  .catch((err) => res.status(404).send(err))

})



app.get('/word/:from[0-9\-]{0}/', function (req, res) {
  console.log('came in DATE get')
  // the client sent a get request with username $.get('/user/2017-12-12' {username:'abc'})
  // on server we see it as "/word/2018-06-20?username=mary" and it exists in req.query

  console.log(req.query)

  var dateObj = new Date(req.params.from.split('-').join(','))
  query({'createdAt': {"$lte": dateObj}, username: req.query.username})
  .then((matchedDoc) => res.status(200).send(matchedDoc))
  .catch((err) => res.status(200).send({word:'No record found'}))

});


let port = process.env.PORT || 8088;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
