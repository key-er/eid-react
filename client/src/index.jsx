import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import SearchHistory from './components/SearchHistory.jsx'
import initdata from '../../server/models/data.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: '',
      thesauri: initdata,
      history: false,
    }

    // this.username;
  }


  search() {
    $.post('/word', {word: this.state.word, username: sessionStorage.getItem('username')}, (data) => {
      this.setState({
        thesauri: data
      })
    })
  }

  handleChange(event) {
    this.setState({
      word: event.target.value
    })
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.search.apply(this)
    }
  }

  showOrHideHistory(event) {
    this.setState({
      history: !this.state.history
    });

  }


  handleUser(event) {
    if (event.key === 'Enter') {
    sessionStorage.setItem('username', event.target.value)
    }
  }


  render() {
    // conditional rendering
    const history = this.state.history;
    if (history) {
      var searchHistory = <SearchHistory history={history} handleUser={this.handleUser.bind(this)} />
    }

    return (
      <div>
        <h2> Oxford Dictionary Search </h2>
        <p> <i> Powered by Oxforddictionaries.com </i> </p>

          {/* username: <Username handleUser={this.handleUser.bind(this)} /> */}
          {/* username: <input type="email" onKeyPress={this.handleUser.bind(this)}/> <br/><br/> */}
          {/* passwd: <input type="password" /> <br/> */}

        Enter a word: <input value={this.state.word} onChange={this.handleChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} />
        <button onClick={this.search.bind(this)}> Go Search! </button>
        <Search thesauri={this.state.thesauri}/>
        <button onClick={this.showOrHideHistory.bind(this)}> My History </button>
        {searchHistory}


      </div>
      )
  }

}

ReactDOM.render(<App />, document.getElementById('app'))