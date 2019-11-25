# Chat-App
A chat app for mobile devices using React Native. The app provide users with a chat interface and the possibility to share images and their location.
  - select images from your device's storage
  - take photos
  - get current geo-location
  - write send and receive messages
  
### Setup Accounts
To be able to access and use the services for the development and setup of this app, the following accounts need to be set up.
* [Expo] - building native iOS and Android apps using JavaScript and React Native
* [Firebase] - mobile development platform

### Data Storage
For data storage and user authentication, the services of Firebase have been used.
  - Cloud Firestore database for storage of the messages
  - Firebase Storage for storage of the images
  - Firebase Authentication with Anonymous Sign-In Provider

### Installation
```sh
$ npm install expo-cli --global
```
The following npm packages are required, the versions are mentioned for compatibility issues that might arise.

|Package | Info |
|--------|--------|
 |@react-native-community/async-storage:|
 |cookies|
 |eslint| Optional
 |expo| Used to build the app and manage api actions
 |firebase| Data base stored in cloud
 |react| Dependency of React Native
 |react-dom| Dependency of React
 |react-native| Library used to build this app
 |react-native-gesture-handler| Dependency of React Native
 |react-native-gifted-chat| Library used to build the chat functionalities
 |react-native-keyboard-spacer| Library used to correct the position of the keyboard in Android devices
 |react-native-web| Library to run React Native components and APIs on the web using React DOM
 |react-navigation| Library used to navigate through the app pages (e.g Start/Chat)
# Note
All packages have been installed locally




```sh
$ npm install -s [package name]
or
$ npm install -s [for installing all dependencies]
```

### Setup
- set up React Native app with Expo by running $ expo init [project name] in the Win CMD
- create basic file setup with start.js, chat.js and custom-actions.js
- enable navigation between screens through react-navigation
- setup and configure GiftedChat, incl. KeyBoardSpacer - use hardwired data
- setup of Firebase database
- setup of Firebase authentication
- setup of AsyncStorage for offline data management
- implement NetInfo for online/offline switch
- implement mobile device's communication features, i.e. camera and geolocation


### Set Up Firestore Database

Data is designed to be stored on a Firestore databse. 

To get started, head over to Google Firebase and “Sign in” or create an account.

Next, click on the “Go to console” link and choose “Add project.” The default settings will suffice.

With the new project created and in the project console choose “Create database” in the Cloud Firestore section.

Start the database in test mode but **note** that anyone will be able to read and write from onto your databse.

With "test mode" enabled it's not time to create a collection. Name the collection "messages". You will then be asked to create the first document in the collection. Use the following fields for this document:

![Firebase Document](https://i.ibb.co/y57kY20/Screenshot-2019-10-14-at-19-30-21.png)

Next open up your “Project Settings” (by clicking on the gear icon). Under the “General” tab, you’ll find a section called “Your apps,” which is where you can generate configurations for different platforms. Click the “Firestore for Web” button, which will open up the following modal:

![apiKey](https://images.careerfoundry.com/public/courses/fullstack-immersion/A5/E4/A5-E3-test-firestore-configuration.PNG)

Copy the contents of the config object (from { apiKey:… to messagingSenderId:…}) in this modal. You will need to paste this into the firebaseConfig file in the following directory:

components/utils/firebaseConfig.js

#### Firebase Authentication

To set up simple authentication, back in the firestore console click on "authentication" under "Develop" and click on anonymous. 

![](https://images.careerfoundry.com/public/courses/fullstack-immersion/A5/E4/anonymous_authentication.png)

### Starting the Application

If everything is set up correctly you should be able to navigate to the project folder and use the following command to initiate the application:

```bash
expo start
```

The application should start on on
