import React, { Component } from 'react';
import { View, StyleSheet, Switch, Text, YellowBox } from 'react-native';
import { HOST } from 'react-native-dotenv';
import io from 'socket.io-client';

export default class Owner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchValue: false,
      location: null,
      loading: false
    }

    this.socket = io.connect(`${HOST}`, { transports: ['websocket'] })

    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ])
  }

componentDidMount() {
    const businessIds = this.props.businessIds;
      this.socket.emit('checkPosition', businessIds[0])

      this.socket.on('checkPosition', liveTruck => {
        this.setState({
          location: {
            latitude: liveTruck.latitude,
            longitude: liveTruck.longitude
          },
          switchValue: true,
          loading: true
        })
      })
    }

  connectSocket() {
    const businessIds = this.props.businessIds;
      alert('Your Food Truck is online!');
      this.socket.emit('position', this.state.location, {businessIds: businessIds[0]}); 
      this.setState({ loading: true });
  }

  socketSwitch() {
    const businessIds = this.props.businessIds;

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
      this.socket.emit('disconnectUser', businessIds[0]);
      alert('Your Food Truck is offline!');
    }
  }

  handleToggleSwitch = newState => {
     if(this.state.switchValue && !this.state.loading) return;
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
