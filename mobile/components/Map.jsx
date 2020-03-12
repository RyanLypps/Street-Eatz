import React from 'react';
import { StyleSheet, Dimensions, View, Text } from "react-native";
import MapView from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class Map extends React.Component {
    state = {
        location: null,
        errorMessage: null,
    };

    constructor(props) {
        super(props);
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.location ?   
                <MapView style={styles.mapStyle} 
                initialRegion={{
                    latitude:this.state.location.coords.latitude,
                    longitude:this.state.location.coords.longitude,
                    latitudeDelta:0.0922,
                    longitudeDelta:0.0421,
                }} 
                />
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
