import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

// import AgoraRTC from './Agora_Web_SDK_v2_3_1_FULL/Agora_Web_SDK_FULL/AgoraRTCSDK-2.3.1.js';



function Learn(props){
  if(props.mode === "rest"){
    return (
        <button onClick={() =>props.game.learn()}>
          {'Learn New'}
          </button>
      );
  }
  return <p></p>;
}

function Inputbox(props){
    return (
        <div>
        <p>Post Item for Sale</p>
        <form method="POST" action="/insert">
          <label>
            Name:
            <input type="text" name="name" />
          </label>
          <br/>
          <label>
            Price:
            <input type="text" name="price" />
          </label>
          <br/>
          <label>
            Image URL:
            <input type="text" name="image" />
          </label>
          <br/>
          <label>
            Description:
            <br/>
            <textarea name="desc" cols="50" rows="3"> </textarea>
          </label>
          <br/>
          <input type="submit" value="Post" />
        </form>
        </div>
      );
}

function Loginbox(props){
    return (
        <form method="POST" action="/login">
          <label>
            Username: 
            <input type="text" name="user" />
          </label>
          <br/>
          <label>
            Password: 
            <input type="text" name="pass" />
          </label>
          <br/>
          <input type="submit" value="Login" />
        </form>
      );
}

function Signupbox(props){
    return (
        <form method="POST" action="/signup">
          <label>
            Username: 
            <input type="text" name="user" />
          </label>
          <br/>
          <label>
            Password: 
            <input type="text" name="pass" />
          </label>
          <br/>
          <label>
            Email: 
            <input type="text" name="email" />
          </label>
          <br/>
          <input type="submit" value="Sign Up" />
        </form>
      );
}


function Productview(props){
  var form = <div>
    <form method="GET" action="http://localhost:8080">
      <input type ="hidden" value={props.seller} name="seller"/>
      <input type="submit" value="Call for Live Demo" />
    </form>
    <form method="POST" action="/buy">
      <input type="submit" value="Buy" />
    </form></div>;
  if(props.seller===props.user){
    form = 
     <div>
    <form method="GET" action="http://localhost:8080">
      <input type ="hidden" value={props.seller} name="seller"/>
      <input type="submit" value="Accept Calls for Live Demo" />
    </form>
    <form method="POST" action="/edit">
      <input type="hidden" name="id" value={props.id}/>
      <input type="submit" value="Delete" />
      </form>;
      </div>
  }
  return (<div>
    <img src={props.image}  width="100" height="100"/>
    <p>{props.name} </p>
    <p>Offered by {props.seller}, User number {props.number} </p>
    <p>Price: ${props.price} </p>
    <p>Description: {props.desc} </p>
    {form}
    </div>);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "logged",
      products : [],
      user: null
    };
  }

  componentDidMount(){
    fetch('/get-user')
    .then(res => res.json())
    .then(user => this.setState({user}));
    fetch('/get-data')
    .then(res => res.json())
    .then(products => this.setState({products}));
  }

  post(path, params, method) {
      method = method || "post"; // Set method to post by default if not specified.

      // The rest of this code assumes you are not using a library.
      // It can be made less wordy if you use one.
      var form = document.createElement("form");
      form.setAttribute("method", method);
      form.setAttribute("action", path);

      for(var key in params) {
          if(params.hasOwnProperty(key)) {
              var hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", params[key]);
              form.appendChild(hiddenField);
          }
      }
      document.body.appendChild(form);
      form.submit();
  }

  learn() {
    this.setState({
      mode: "quiz",
    });
    // var appid = "6db557c796dc4080bc0ee4b3cc164f1f";
    // var client = AgoraRTC.createClient({mode:'interop'});
    // client.init(appid, function(){
    //     console.log("AgoraRTC client initialized");
    // });
  }

  render() {
    const tmode =this.state.mode;

    if(this.state.user){
      return (
              <div>
              <div>Logged in as {this.state.user.username}, User number {this.state.user.number}
              <form method="POST" action="/logout">
              <input type="submit" value="Logout" />
              </form></div>
              <h3>Items For Sale</h3>
              <ul>
              {this.state.products.map(prod => 
                <li key={prod._id}>
                <Productview id={prod._id} name={prod.name} number={prod.number} user={this.state.user.username} price={prod.price} seller={prod.user} desc={prod.desc} image={prod.image}/>
                </li>)}
              </ul>
              <div className="game-board">
                <Learn
                  mode={tmode} 
                  game={this} />
                <Inputbox/>  
              </div>
              <div className="game-info">
              </div>
              </div>
              );
    }
    else{
      return (
        <div>
        Logged out
        <Loginbox/>
        <br/>
        <Signupbox/>
        </div>
      );
    }
  }
}

export default App;
