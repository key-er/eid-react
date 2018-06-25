import React from 'react';

function Username(props) {
  return <input type="email" placeholder="Enter your username" onKeyPress={props.handleUser}/>
}

export default Username