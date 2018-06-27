// class stateful component

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

function ThesaurusList(props) {

  return (
     <ReactCSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>
       <li> {props.value} </li>
    </ReactCSSTransitionGroup>
)

}


export default ThesaurusList;