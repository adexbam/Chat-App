/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
// eslint-disable-next-line linebreak-style
/**
* @description this file handles the CustomAction button in text input field
* @class CustomActions
* @requires React
* @requires React-Native
* @requires Prop-Types
* @requires Expo-Image-Picker
* @requires Expo-Permissions
* @requires Expo-Location
* @requires Firebase
* @requires Firestore
*/

import React, { Component } from 'react';
// import popTypes define the structure props sent to a component
import PropTypes from 'prop-types';
// import React native UI
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// ImagePicker, Permissions and Location are no longer included in expo and need to be installed separately
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// import firebase/firestore a db to store data
import firebase from 'firebase';
import 'firebase/firestore';

// create CustomActions class
export default class CustomActions extends Component {
  /**
  * Let the user pick an image from the device's image library
  * @function imagePicker
  * @async
  */
  // allows user to pick and send images from their device
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Let the user take a photo with device's camera
  * @function takePhoto
  * @async
  */
  // allows user to take a new picture to send
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    try {
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * get the location of the user by using GPS
  * @function getLocation
  * @async
  */
  // allows user get location
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    try {
      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({}).catch((error) => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Upload images to firebase
  * @function uploadImageFetch
  * @async
  */
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    // this will make a unique file name for each image uploaded
    let uriParts = uri.split('/');
    let imageName = uriParts[uriParts.length - 1];

    const ref = firebase.storage().ref().child(`${imageName}`);
    const snapshot = await ref.put(blob);
    blob.close();
    const imageUrl = await snapshot.ref.getDownloadURL();
    return imageUrl;
  }

  /**
  * function that handles communication features
  * @function onActionPress
  */
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
          default:
        }
      },
    );
  };

  // render function
  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

//  stylesheets
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
