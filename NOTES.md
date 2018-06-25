### Reacts features played with
- conditional rendering
-


### Some lessons learned
- react doesn't allow void html elements
  - HTML elements such as <area />, <br />, and <input /> are void elements which are only self-closing without any content. And React throws an exception if you set either children or dangerouslySetInnerHTML prop for a void element. So html5 format `<input id="date" type="date">` gives error use react format as `<input id="date" type="date" />`
  - `<input type="radio" value="option1" checked={true} />`
  - `<input type="date" />`
- the new Date() month starts from 0
- willMount from react lifecycle is going away
- we can set index of map(elem, index) as key in react list/keys
- in render() it must return one <div> all components must be inside that

```
ERROR
  render() {
    return (
      <div>
      <ul>
      <p>
      )
  }


RIGHT WAY
  render() {
    return (
      <div>
        <div>
        <ul>
        <p>
      </div>
      )
  }

```


- a good resource to check json https://jsoneditoronline.org/
- Testing
  - mocha test runner
  - chai - assertion library
- there is a bug in wildcard regex for express routing https://github.com/expressjs/express/issues/2495
- So to match /word/abc `/word/:word[a-zA-Z]* or /word/:word[a-zA-Z]+ doesn't work BUT /word/:word[a-zA-Z]{0} -works`
- to match /word/2018-22-1 `/word/:word[0-9\-]{0}`

- "as user3344977 said in comment, the function deleteOne and deleteMany no longer exist in mongoose 4. the API documentation is not up to date. I just checked the source code of mongoose (4.4) and there is no a single trace of these function. you can use Model.findOneAndRemove(condition, options, callback) or Model.findByIdAndRemove(id, options, callback) instead." - https://stackoverflow.com/questions/42798869/mongoose-js-typeerror-model-deleteone-is-not-a-function





