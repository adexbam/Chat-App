/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-use-before-define */
/* eslint-disable no-empty */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */

/**
 * @description this is the chatscreen, where the user can write and sent
 * messages, images or geo-location
 * @class Chat
 * @requires React
 * @requires React-Native
 * @requires Keyboard-Spacer
 * @requires React-Native-Gifted-Chat
 * @requires CustomActions
 * @requires React-Native-Maps
 * @requires Firebase
 * @requires Firestore
 */

import React, { Component } from 'react';
// library with GiftedChat UI
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
// import React native UI
import {
  View, Platform, StyleSheet, AsyncStorage, NetInfo,
} from 'react-native';
// library for Android devices to keep input field above the keyboard
import KeyboardSpacer from 'react-native-keyboard-spacer';
// import MapView separately
import MapView from 'react-native-maps';
// import custom component(take photo, share an image and location) display in message input bar
import CustomActions from './CustomActions';

// import firebase/firestore a db to store messages
const firebase = require('firebase');
require('firebase/firestore');

// create Chat class for Screen2
export default class Chat extends Component {
  // eslint-disable-next-line react/sort-comp
  constructor() {
    super();

    /**
    * initializing firebase
    * @param {object} firebaseConfig
    * @param {string} apiKey
    * @param {string} authDomain
    * @param {string} databaseURL
    * @param {string} projectID
    * @param {string} storageBucket
    * @param {string} messagingSenderId
    * @param {string} appId
    * @param {string} measurementId
    */

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyCRmsyQZZyiJd1w76L7sJo6c_pCnavu3wI',
        authDomain: 'chat-7e34b.firebaseapp.com',
        databaseURL: 'https://chat-7e34b.firebaseio.com',
        projectId: 'chat-7e34b',
        storageBucket: 'chat-7e34b.appspot.com',
        messagingSenderId: '1020444548919',
        appId: '1:1020444548919:web:0af3ae9b5b6cff621b84b2',
        measurementId: 'G-G1BQ6GBPQR',
      });
    }

    this.referenceChatUser = null;

    this.referenceMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: 0,
      // eslint-disable-next-line react/no-unused-state
      loggedInText: 'Please wait, you are getting logged in',
      isConnected: false,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
    };
  }

  // display username in navigation bar
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.userName,
  });

  get user() {
    return {
      name: this.props.navigation.state.params.userName,
      _id: this.state.uid,
      id: this.state.uid,
    };
  }

  /**
  * onCollectionUpdte takes snapshot on collection update
  * @function onCollectionUpdate
  * @param {string} _id
  * @param {string} text
  * @param {number} created.At
  * @param {object} user
  * @param {string} user._id
  * @param {string} image
  * @param {object} location
  * @param {number} location.longitude
  * @param {number} location.latitude
  */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    try {
      querySnapshot.forEach((doc) => {
        // get the QueryDocumentSnapshot's data
        const data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user,
          image: data.image || '',
          location: data.location || null,
        });
        this.setState({
          messages,
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
  * adds the message object to firestore, fired by onSend function
  * @function addMessage
  * @param {string} _id
  * @param {string} text
  * @param {number} created.At
  * @param {object} user
  * @param {string} user._id
  * @param {string} image
  * @param {object} location
  * @param {number} location.longitude
  * @param {number} location.latitude
  */
  addMessage() {
    console.log(this.state.messages[0].user);
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
      image: this.state.messages[0].image || '',
      location: this.state.messages[0].location || null,
    });
  }

  /**
  * handles actions when user hits send-button
  * @function onSend
  * @param {object} messages
  */
  onSend(messages = []) {
    try {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }), () => {
        this.addMessage();
        this.saveMessages();
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * loads all messages from AsyncStorage
  * @function getMessages
  * @async
  * @return {Promise<string>} The data from the storage
  */
  // async functions
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * saves all messages from AsyncStorage
  * @function saveMessages
  * @async
  */
  // async functions to save messages
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * deletes all messages from AsyncStorage
  * @function deleteMessages
  * @async
  */
  // async functions to delete messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // checks if user is online or offline
    NetInfo.isConnected.fetch().then((isConnected) => {
      // IF the user is ONLINE
      if (isConnected) {
        console.log('online');
        this.setState({
          isConnected: true,
        });
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          // update with current user data
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.userName,
              avatar: '',
            },
            loggedInText: 'Welcome!',
          });
          // listen for changes
          this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
        });

        // else user is OFFLINE
      } else {
        console.log('offline');
        this.setState({
          isConnected: false,
        });
        // get messages from async storage
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
    // this.unsubscribeMessageUser();
    this.unsubscribe();
  }

  // Bubble color function from Gifted Chat
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#aa0975',
          },
        }}
      />
    );
  }

  /**
  * hides inputbar when offline
  * @function renderInputToolbar
  */
  // display no toolbar if user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  /**
  * displays the communication features
  * @function renderCustomActions
  */
  renderCustomActions = (props) => <CustomActions {...props} />;

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  // render components
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.userBackgroundColor }]}>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    );
  }
}

//  stylesheets
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
