import React, { Component } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { View, Platform, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Text } from 'react-native'
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
    }; 
  }
 
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
    }),
    () => {
      this.addMessage();
    }
  );
}

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'Welcome!',
      });
      // listen for changes
      this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate)
    });

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
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    //this.unsubscribeMessageUser();
    this.unsubscribe();
  }


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

  //render components
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.userBackgroundColor }]}>
        <GiftedChat
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