import React from 'react';
import { StyleSheet, Dimensions, View, Text, YellowBox } from "react-native";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import io from 'socket.io-client';
import { Actions } from 'react-native-router-flux';
import { HOST } from 'react-native-dotenv';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null
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

    goToMenu = (businessId) => Actions.menu({businessId: businessId});
        
    render() {
        let count = 0;

        return (
            <View style={styles.container}>
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
                                        onPress={() => this.goToMenu(location.businessId)}
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
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
