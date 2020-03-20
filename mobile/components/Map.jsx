import React from 'react';
import { StyleSheet, Dimensions, View, Text, YellowBox } from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import io from 'socket.io-client';
import { Actions } from 'react-native-router-flux';
import { HOST } from 'react-native-dotenv';
import { Header, Icon, Button } from 'react-native-elements';
import axios from 'axios';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            sideMenuView: false,
        };
        this.mounted = false;
        
        YellowBox.ignoreWarnings([
            'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
        ])

        this.socket = io.connect(`${HOST}`, { transports: ['websocket'] });
    }

    componentDidMount() {
        this.mounted = true;

        navigator.geolocation.getCurrentPosition(
            position => {
                if(this.mounted){
                this.setState({
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })};
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 }
        );

        this.socket.on('mapPositions', locations => {
            if(this.mounted){
            this.setState({ foodTruck: locations });
            }
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    logOut() {
        axios.post(`${HOST}/api/Customers/logout?access_token=${this.props.token}`)
        .then(res => {
          this.socket.emit('disconnectUser');
          this.goToLogin();
        })
      }
    
    goToLogin = () => Actions.login();
    goToSettings = token => Actions.customerSettings({token: token});
    toggleSideMenu = sideMenuView => this.setState({ sideMenuView: !sideMenuView });
    goToMenu = (token, businessId) => Actions.menu({businessId: businessId, token: token});
        
    render() {
        let count = 0;
        return (
            <View style={styles.container}>
                <Header
                    containerStyle={{
                        backgroundColor: '#980000',
                        justifyContent: 'space-around',
                    }}
                    leftComponent={<Icon
                        name='menu'
                        onPress={() => this.toggleSideMenu(this.state.sideMenuView)}
                    />}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                    />
                    {this.state.sideMenuView ?
                    <View style={styles.menu}>
                        <Button title="Settings" onPress={() => this.goToSettings(this.props.token)} buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
                        <Button title="Logout" onPress={() => this.logOut()} buttonStyle={{ backgroundColor: '#980000', borderBottomWidth: .45, borderBottomColor: 'white' }} />
                    </View>
                    : <View></View>}
                    <View></View>
                    {this.state.location ?
                    <MapView style={styles.mapStyle}
                        initialRegion={{
                            latitude: this.state.location.latitude,
                            longitude: this.state.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        {this.state.foodTruck ?
                            this.state.foodTruck.map(location => {
                                { count++ }
                                return (
                                    <Marker
                                        onPress={() => this.goToMenu(this.props.token, location.businessId)}
                                        businessId={location.businessId}
                                        key={count}
                                        coordinate={{
                                            latitude: location.latitude,
                                            longitude: location.longitude
                                        }}
                                    />
                                );
                            })
                            :
                            <View></View>
                        }
                    </MapView>
                    :
                    <Text>Loading...</Text>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    menu: {
        backgroundColor: '#980000',
        alignSelf: 'stretch',
      },
});
