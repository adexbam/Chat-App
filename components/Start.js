import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer'

export default class Start extends React.Component {
    state = {
        userName: '',
        userBackgroundColor: ''
    }

    render() {
        return (
            // app container  
            <View style={styles.container}>
                {/* app background image */}             
                <ImageBackground 
                    source={require("../assets/BackgroundImage.png")} 
                    style={styles.BackgroundImage}>

                {/* app title */}
                <Text style={styles.AppTitle}>App Chat</Text> 

                {/* user chat access container */} 
                <View style={styles.AccessChatContainer}>                   
                    {/* user access input */}
                    <TextInput
                        style={styles.AppInput}
                        onChangeText={(userName) => this.setState({userName})}
                        value={this.state.userName}
                        placeholder=' Your name ...'
                    />                    
                    <Text style={styles.ChooseBackgroundColor}>Choose Background Color</Text>

                    <View style={styles.UserBackColorContainer}>{/* background color selection */}
                        {/* pink */}
                        <TouchableOpacity
                            onPress={() => this.setState({ userBackgroundColor: '#ffc0cb' })}
                            style={[styles.BackgroundColors, styles.pink]}
                        />
                        {/* purple */}
                        <TouchableOpacity
                            onPress={() => this.setState({ userBackgroundColor: '#474056' })}
                            style={[styles.BackgroundColors, styles.purple]}
                        />
                        {/* gray */}
                        <TouchableOpacity
                            onPress={() => this.setState({ userBackgroundColor: '#8A95A5' })}
                            style={[styles.BackgroundColors, styles.gray]}
                        />
                        {/* green */}
                        <TouchableOpacity
                            onPress={() => this.setState({ userBackgroundColor: '#B9C6AE' })}
                            style={[styles.BackgroundColors, styles.green]}
                        />
                    </View>                  
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Start Chatting"
                        accessibilityHint="Go to the next screen to start chatting."
                        accessibilityRole="button"
                        style={styles.ChatButton}
                        onPress={() => this.props.navigation.navigate('Chat', { userName: this.state.userName, userBackgroundColor: this.state.userBackgroundColor })} 
                    >  
                    <Text style={styles.ChattingText}>Start chatting</Text>                      
                    </TouchableOpacity>                               
                </View>
                </ImageBackground>             
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    BackgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    AppTitle: {
        marginTop: '20%',
        color: '#FFFFFF',
        fontSize: 45, 
        fontWeight: '600'
    },
    AccessChatContainer: {
        width: '88%',
        height: '44%',
        backgroundColor: 'white',
        marginBottom: '6%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    AppInput: {
        fontSize: 25, 
        fontWeight: '300', 
        color: '#000000', 
        width: '88%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        opacity: 0.5
    },
    UserBackColorContainer: {
        width: '88%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    ChooseBackgroundColor: {
        fontSize: 20, 
        fontWeight: '300', 
        color: '#757083',
        opacity: 1.0
    },
    BackgroundColors: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        marginLeft: 25
    },
    black: { backgroundColor: '#090C08' },
    purple: { backgroundColor: '#474056' },
    gray: { backgroundColor: '#8A95A5' },
    green: { backgroundColor: '#B9C6AE' },
    pink: { backgroundColor: '#ffc0cb' },
    ChatButton: {
        color:'#757083',
        textAlign: 'center',
        width: '88%',
        height: 40,
        backgroundColor: '#757083',
        paddingTop: 10,
        paddingBottom: 10
    },
    ChattingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'center',
    },
});