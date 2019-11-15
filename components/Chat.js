import React, { Component } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { View, Platform, StyleSheet, AsyncStorage, NetInfo } from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'

//import firebase/firestore
const firebase = require('firebase');
require('firebase/firestore');

// create Chat class for Screen2
export default class Chat extends Component {
  constructor() {
    super();
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCRmsyQZZyiJd1w76L7sJo6c_pCnavu3wI",
        authDomain: "chat-7e34b.firebaseapp.com",
        databaseURL: "https://chat-7e34b.firebaseio.com",
        projectId: "chat-7e34b",
        storageBucket: "chat-7e34b.appspot.com",
        messagingSenderId: "1020444548919",
        appId: "1:1020444548919:web:0af3ae9b5b6cff621b84b2",
        measurementId: "G-G1BQ6GBPQR"
      });
    } 
    
    this.referenceChatUser = null;

    this.referenceMessages = firebase.firestore().collection('messages');
    
    this.state = {
      messages: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
      isConnected: false,
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
    }; 
  }
 
  //display username in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  get user() {
    return {
      name: this.props.navigation.state.params.userName,
      _id: this.state.uid,
      id: this.state.uid,
    }
  }


  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({ 
      messages,
   });
  }

  addMessage() {
    console.log(this.state.messages[0].user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  // async functions
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // async functions to save messages
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }
 
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }
  

  componentDidMount() {
    //checks if user is online or offline
    NetInfo.isConnected.fetch().then(isConnected => {
      //IF the user is ONLINE
      if (isConnected) {
        console.log('online');
        this.setState({
          isConnected: true,
        })
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
       firebase.auth().signInAnonymously();
      }
      //update with current user data
      this.setState({
        uid: user.uid,
        user: {
          _id: user.uid,
          name: this.props.navigation.state.params.userName,
          avatar: '',
        },
        loggedInText: 'Welcome!'
      });
      // listen for changes
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate)
    });

      //else user is OFFLINE
      } else {
        console.log('offline');
        this.setState({
          isConnected: false,
        });
        //get messages from async storage
        this.getMessages();
      }
    });
    /*
    this.setState({
      messages: [
        {
          _id: 'msg0',
          text: 'Hello ' + this.props.navigation.state.params.userName + '! Welcome to App Chat.',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
    */
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    //this.unsubscribeMessageUser();
    this.unsubscribe();
  }

  //Bubble color function from Gifted Chat
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

   //display no toolbar if user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  //render components
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.userBackgroundColor }]}>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});