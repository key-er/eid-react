##### How to run
`npm install`

`npm run react-dev` (compile jsx)

`npm run server-dev` (runs nodemon)


` cd server; mkdir -p data/db `
`mongod --dbpath data/db`

Test

`npm install --save mocha chai`


for one time
`npm test`

for continuous monitor
`nodemon node_modules/mocha/bin/mocha --watch test/ServerSpec.js`


to connect mlab mongo
`mongo --host 127.0.0.1:27017`
`mongo ds263670.mlab.com:63670/<dbname> -u <dbuser> -p <dbpassword>`
(check settings -> revealconfig for all env variables)

```
> show collections
> db.<collection_name>.find({}) // to list all
> db.<collection_name>.deleteMany({}) // to delete all entries
```


### Deploy
Steps
- Add to the scripts in package.json `  "postinstall": "webpack"  `
- Add Procfile -  ` web: node server/index.js `
- Pushing to master branch deploys to heroku `https://eid-react.herokuapp.com/`



#### Service Worker test
`npm install lighthouse --dev`
`./node_modules/lighthouse/lighthouse-cli/index.js https://eid-react.herokuapp.com/`