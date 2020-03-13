import axios from 'axios';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Text, TouchableOpacity, TextInput, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { HOST } from 'react-native-dotenv';

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  handleEmail = text => this.setState({ email: text })
  handlePassword = text => this.setState({ password: text })

  login = (email, pass) => {
    axios.post(`${HOST}/api/Customers/login`, {
        email: email,
        password: pass
    })
    .then(res => this.goToMap(res.data.id))
    .catch(err => alert('Login attempt failed. Wrong username or password.'));
  }

  loginOwner = (email, pass) => {
    axios.post(`${HOST}/api/Owners/login`, {
        email: email,
        password: pass
    })
    .then(res => this.goToOwnerPage(res.data.id))
    .catch(err => alert('Login attempt failed. Wrong username or password.'));
  }

  goToOwnerPage = (token) => Actions.owner(token);
  goToMap = (token) => Actions.map(token);
  goToRegister = () => Actions.register();

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <ScrollView scrollEnabled={true}>
          <TextInput style={styles.input}
            underlineColorAndroid='transparent'
            placeholder='Email'
            autoCapitalize='none'
            paddingLeft={10}
            keyboardType={'email-address'}
            onChangeText={this.handleEmail} />
          <TextInput style={styles.input}
            underlineColorAndroid='transparent'
            placeholder='Password'
            autoCapitalize='none'
            paddingLeft={10}
            secureTextEntry={true}
            onChangeText={this.handlePassword} />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.login(this.state.email, this.state.password)}>
            <Text style={styles.loginButtonText}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ownerLoginButton}
            onPress={() => this.loginOwner(this.state.email, this.state.password)}>
            <Text style={styles.loginButtonText}> Login As Owner </Text>
          </TouchableOpacity>
          <Text style={styles.registerButton} onPress={this.goToRegister}>Click Here To Register.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
export default Login

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
  ownerLoginButton: {
    backgroundColor: '#980000',
    padding: 10,
    marginTop: 0,
    marginLeft: 100,
    marginRight: 100,
    marginBottom: 15,
    height: 40,
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  registerButton: {
    color: 'blue',
    textAlign: 'center'
  },
  logo: {
    width: 375,
    height: 350,
    marginBottom: 35,
    marginTop: 35,
    marginLeft: 17,
    resizeMode: 'contain',
    justifyContent: 'center',
  }
})
