import axios from 'axios';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Text, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { HOST } from 'react-native-dotenv';
import AnimatedInput from 'react-native-animated-input-label';

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
    .then(res => {
        axios.get(`${HOST}/api/Owners/${res.data.userId}/businesses`)
        .then(response => this.goToOwnerPage(res.data.id, res.data.userId, response.data.map(business => business.id)))
        .catch(err => alert('You have no businesses associated with your account'));
    })
    .catch(err => alert('Login attempt failed. Wrong username or password.'));
  }

  goToOwnerPage = (token, userId, businessIds) => Actions.owner({token: token, userId: userId, businessIds: businessIds});
  goToMap = (token) => Actions.map(token);
  goToRegister = () => Actions.register();
  
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
        <ScrollView scrollEnabled={true}>
          <AnimatedInput 
            inputStyle={styles.input}
            labelStyle={styles.labelInput}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
            paddingLeft={10}
            keyboardType={'email-address'}
            onChangeText={this.handleEmail}>
            Email</AnimatedInput>
          <AnimatedInput 
            inputStyle={styles.input}
            labelStyle={styles.labelInput}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
            paddingLeft={10}
            keyboardType={'email-address'}
            secureTextEntry={true}
            onChangeText={this.handlePassword}>
            Password</AnimatedInput>
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
  labelInput: {
    color: '#ADABAB',
    fontSize: 15,
    marginLeft: 30,
    zIndex: 1,
    justifyContent: 'space-evenly',
  },
  input: {
    padding: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 15,
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
