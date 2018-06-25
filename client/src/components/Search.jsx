// class stateful component

import React from 'react';
import ListThesaurus from './ListThesaurus.jsx'

function ListItem(props) {
  return <li><p>{props.value} </p></li>;
}

function Search(props) {
  const antonyms = props.thesauri.antonyms;
  const synonyms = props.thesauri.synonyms;
  const examples = props.thesauri.examples;

  const listAntonyms = antonyms.map((d, index) =>
    <ListThesaurus key={index} value={d} />
  );

  const listSynonyms = synonyms.map((d, index) =>
    <ListThesaurus key={index} value={d} />
    )

  const listExamples = examples.map((d, index) =>
    <ListThesaurus key={index} value={d} />
    )


  return (
    <div>
      <p> Findings for word <i> <b> {props.thesauri.word} </b> </i> </p>
      <ul>
        <h3> Antonym(s) are </h3>
        {listAntonyms}
      </ul>

      <ul>
        <h3> Synonym(s) are </h3>
        {listSynonyms}
      </ul>

      <ul>
        <h3> Example(s) are </h3>
        {listExamples}
      </ul>

    </div>
  );
}



// export default Search;
export default Search;