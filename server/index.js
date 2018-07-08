const express = require('express');
const db = require('./db/index.js');
const api = require('../helpers/oxfordAPI.js')
const searchLexicon = api.searchLexicon;
const utils = require('../helpers/utils.js')
const request = require('request')
var query = utils.query;

try {
  console.log('no exception')
  config = require('../config.js')
}
catch(e) {
  console.log('hit exception')
  config = {
    'client_id': process.env.github_secret.split('|')[0] ,
    'client_secret': process.env.github_secret.split('|')[1]
  }
}



let app = express();

app.use(express.static(__dirname + '/../client/dist'));

/// Middleware for parsing request body
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var client_id = config.client_id;
var client_secret = config.client_secret;

// app.get('/login', function(req, res) {
//   res.redirect('https://github.com/login/oauth/authorize?client_id=6b9e164de8e098f9fe9c&redirect_uri=https://eid-react.herokuapp.com/auth')

// })

app.get('/login', function(req, res) {
  res.redirect('https://github.com/login/oauth/authorize?client_id=6b9e164de8e098f9fe9c')
})


// app.get('https://github.com/login/oauth/authorize?client_id=6b9e164de8e098f9fe9c')
// it would redirect to (https://eid-react.herokuapp.com/auth because defined in UI dev settings as callback) with code as https://eid-react.herokuapp.com/auth?code=bf6c7dbc9aebb8d242bc' Now we need to exchange this  code with https://github.com/login/oauth/access_token to get token in response

app.get('/auth', function(req, res) {
  console.log('********** in auth get', req.query.code)
  if (req.query.code) {
    let options = {
      url: 'https://github.com/login/oauth/access_token',
      form: {
      client_id:client_id,
      client_secret:client_secret,
      code: req.query.code,
      redirect_uri: 'https://eid-react.herokuapp.com/auth/protected',
      // state: req.query.state
      }
    }
    request.post(options, function(err, response, body) {
      console.log(body)
      // res.send(body)
      var token = body.split('&')[0].split('=')[1]
      res.redirect(`https://api.github.com/user?access_token=${token}`)
    })
  }

  else {
    res.send('code condition not match')
  }
})


app.get('/auth/protected', function(req, res) {
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


let port = process.env.PORT || 8089;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
