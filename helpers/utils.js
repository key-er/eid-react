const db = require('../server/db/index.js');

// creating a promise object to avoid code repetition of db.query()
let query = function(query, cb) {
  return new Promise(function (resolve, reject) {
    db.query(query)
      .then(function(matchedDoc) {
        console.log('mtached doc length', matchedDoc.length)
        if (matchedDoc.length === 0) reject('not found')
        else resolve(matchedDoc)
      })
  })
}


let parseData = function(data) {
  var jData = JSON.parse(data)
  var basePath = jData.results[0].lexicalEntries[0].entries[0].senses[0]

  let parsedData = {
    word: jData.results[0].word,
    synonyms: ['Not found'],
    antonyms: ['Not found'],
    examples: ['Not found'],
  }


  let looper = function(d) {
    let result = [];
    for (let i = 0; i < d.length; i++) {
      result.push(d[i].text)
    }
    return result
  }

  if (basePath.synonyms) {
    parsedData.synonyms = looper(basePath.synonyms)
  }

  if (basePath.antonyms) {
    parsedData.antonyms = looper(basePath.antonyms)
  }

  if (basePath.examples) {
    parsedData.examples = looper(basePath.examples)
  }

  return parsedData
}



module.exports.query = query
module.exports.parseData = parseData