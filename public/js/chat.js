//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

const messages = []; //array that hold the record of each string in chat
let  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  talking = true; //when false the speach function doesn't work

function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("chatbox").value;
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
    messages.push(lastUserMessage);
    for (var i = 1; i < 13; i++) {
      if (messages[messages.length - i])
        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
    }
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    const lastUserMessage = `${USER_ID}: ${document.getElementById("chatbox").value}`
    console.log('message', lastUserMessage);
    newEntry();
    socket.emit('update', lastUserMessage);
  }
  if (key == 38) {
    console.log('hi')
      //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}

socket.on('update', message => {
    console.log(message);
    messages.push(message);
    for (var i = 1; i < 22; i++) {
      if (messages[messages.length - i]) {
        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
      }
    }
});


/*
//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
    if ('speechSynthesis' in window && talking) {
      var utterance = new SpeechSynthesisUtterance(say);
      //msg.voice = voices[10]; // Note: some voices don't support altering params
      //msg.voiceURI = 'native';
      //utterance.volume = 1; // 0 to 1
      //utterance.rate = 0.1; // 0.1 to 10
      //utterance.pitch = 1; //0 to 2
      //utterance.text = 'Hello World';
      //utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }
  */