import React, { Component } from 'react';
import './App.css';
//import Webcam from "react-webcam";
import Gamepad from './Components/Gamepad'
// import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';

class App extends Component {

  state = {
    waitingList: [],
    username: null,
    response: '',
    post: '',
    responseToPost: '',
    wsUrl: null,
    wsPort: null,
    socket: null,
  };

  constructor() {
    super();

    this.bindHandlers();
  }

  componentDidMount() {
    this.loginApi()
      .then(res => {
        console.log(res);
        
        this.setState({
          username: res.username,
          wsUrl: res.wsUrl,
          wsPort: res.wsPort,
          response: res.express
        });

        this.connectWS();

      })
      .catch(err => console.log(err));

      this.waitingApi()
      .then(res => {
        console.log(res);
        this.setState({
          waitingList: res,
        });
      })
      .catch(err => console.log(err));
  }

  bindHandlers() {
    this.handleJoystickEvent = _throttle(this.handleJoystickEvent,`100`).bind(this);
    // this.handleJoystickEvent = this.handleJoystickEvent.bind(this);
  }

  handleJoystickEvent(event) {
    console.log(event);
    this.callWS(event);
  }
  
  loginApi = async () => {
    const response = await fetch('/api/connect');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  waitingApi = async () => {
    const response = await fetch('/api/waiting');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  connectWS() {

    const {wsUrl, wsPort} = this.state;

    this.socket = new WebSocket(`ws://${wsUrl}:${wsPort}`);

    this.socket.onopen = (event) => {
        // sending a send event to websocket server
        this.callWS("connected");
    };

    this.socket.onmessage = (event) => {
      console.log(event);
    }
  }

  callWS = (message) => {

    const baseMsg = {
      u: this.state.username,
      ct: 'user', // clientType
    }

    if(typeof message === 'object') {
      message = Object.assign(baseMsg, message);
    }
    else {
      message = Object.assign(baseMsg, {b: message});
    }

    this.socket.send(JSON.stringify(message));
  };

  handleSubmit = async e => {
    e.preventDefault();
    const body = JSON.stringify({ post: this.state.post });
    this.setState({ responseToPost: body });
    this.callWS(this.state.post);
  };

  render() {

    const { waitingList, username } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          Connected as <span className="App-header__username">{username}</span>
        </header>
        <section className="App-scetion App-section__Webcam">
          {/* <Webcam /> */}
        </section>
        <section className="App-section App-Section__Gamepad">
          <Gamepad
            handleEvent={this.handleJoystickEvent}
          />
        </section>
        <footer className="App-footer">
          <div className="App-waiting">
            <h2>Waiting List</h2>
            <ol>
            {waitingList.map(obj => (
              <li className="App-waiting__item" key={obj.id}>{obj.username}</li>
            ))}
          </ol>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
