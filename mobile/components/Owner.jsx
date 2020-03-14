import React, { Component } from 'react';
import { View, StyleSheet, Switch, Text, YellowBox } from 'react-native';
import { HOST } from 'react-native-dotenv';
import io from 'socket.io-client';

export default class Owner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchValue: false,
      location: null
    }

    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ])
  }

  componentWillUnmount() {
    const userId = this.props.userId;
    const { socket } = this.state;
    socket.emit('disconnectUser', userId);
  }

  connectSocket() {
    const userId = this.props.userId;
    
    const socket = io.connect(`${HOST}`, { transports: ['websocket'] })
        socket.on('connect', () => {
        alert('Your Food Truck is online!');
        socket.emit('position', this.state.location, {userId: userId}); 
      })
      this.setState({ socket });
  }

  socketSwitch() {
    const userId = this.props.userId;

    if (this.state.switchValue) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
              location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
              }
          }, this.connectSocket);
        },
        error => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 }
      );
    } else {
      const { socket } = this.state;
      socket.emit('disconnectUser', userId);
      alert('Your Food Truck is offline!');
    }
  }

  handleToggleSwitch = newState => {
     if(this.state.switchValue && !this.state.socket) return;
     this.setState(newState, this.socketSwitch);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Broadcast Food Truck</Text>
        <Switch
          onValueChange={(value) => this.handleToggleSwitch({ switchValue: value })}
          value={this.state.switchValue}
          trackColor={'orange'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
})
