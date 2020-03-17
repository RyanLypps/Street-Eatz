import axios from 'axios';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { HOST } from 'react-native-dotenv';

class Register extends Component {
    state = {
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        name: '',
        value: ''
    }

    handleEmail = text => this.setState({ email: text });
    handlePassword = text => this.setState({ password: text });
    handleConfirmedPassword = text => this.setState({ confirmedPassword: text });
    handleName = text => this.setState({ name: text });
    handleNumber = text => this.setState({ phoneNumber: text });
    handleTextChange = (newText) => this.setState({ value: newText });
 
    registerUser = (name, phoneNumber, email, password) => {
        axios.post(`${HOST}/api/Customers`, {
            name: name,
            number: phoneNumber,
            email: email,
            password: password
        })
        .then((response) =>
            axios.post(`${HOST}/api/Customers/login`, {
                email: email,
                password: password
            })
            .then(res => this.goToMap(res.data.id))
            .catch(errLogin => alert('Please enter a valid username and password.'))
        )
        .catch(errCreate => alert('Oops. Something went wrong.'));
    }

    goToMap = (token) => Actions.map(token);
    goToLogin = () => Actions.login();

    render() {    
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
                <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder='Name'
                    autoCapitalize='none'
                    paddingLeft={10}
                    onChangeText={this.handleName}
                />
                <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder='Phone Number'
                    autoCapitalize='none'
                    paddingLeft={10}
                    keyboardType={'numeric'}
                    onChangeText={this.handleNumber}
                />
                <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder='Email'
                    autoCapitalize='none'
                    paddingLeft={10}
                    onChangeText={this.handleEmail} />
                <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder='Password'
                    autoCapitalize='none'
                    paddingLeft={10}
                    onChangeText={this.handlePassword} />
                <TextInput style={styles.input}
                    underlineColorAndroid='transparent'
                    placeholder='Confirm Password'
                    autoCapitalize='none'
                    paddingLeft={10}
                    onChangeText={this.handleConfirmedPassword}
                />
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => this.registerUser(this.state.name, this.state.phoneNumber, this.state.email, this.state.password)}>
                    <Text style={styles.registerButtonText}>Create Account</Text>
                </TouchableOpacity>
                <Text style={styles.registerButton} onPress={this.goToLogin} >Return to login page</Text>
            </View>
        )
    }
}
export default Register;

const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#ffe599'
    },
    input: {
        margin: 10,
        height: 40,
        padding: 2,
        borderColor: 'black',
        backgroundColor: 'white',
        borderWidth: 1,
        marginLeft: 30,
        marginRight: 30,
    },
    loginButton: {
        backgroundColor: '#980000',
        padding: 10,
        marginTop: 25,
        marginLeft: 100,
        marginRight: 100,
        marginBottom: 15,
        height: 40,
        borderRadius: 20,
    },
    registerButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    registerButton: {
        color: 'blue',
        textAlign: 'center'
    },
    logo: {
        width: 400,
        height: 500,
        marginBottom: -35,
        marginTop: -95,
        resizeMode: 'contain',
    }
});
