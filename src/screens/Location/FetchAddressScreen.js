import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, useAnimatedValue } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Geolocation from 'react-native-geolocation-service';
import reactotron from "reactotron-react-native";

const FetchAddressScreen = () => {
    const [location, setLocation] = useState(null);
    const animatedValue = useAnimatedValue(0);

    useEffect(() => {
        const getPosition = async() => {
            await Geolocation.getCurrentPosition(
                position => {
                    let coords = {
                        latitude: position.latitude,
                        longitude: position.longitude
                    }
                
                    setLocation(coords)
                    //getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude)

                    //getAddressFromCoordinates(position?.coords?.latitude, position?.coords?.longitude);
                    // userContext.setLocation([position?.coords?.latitude, position.coords?.longitude])
                    
                },
                error => {
                    //checkUserAddress()

                },
                {
                    accuracy: {
                        android: 'high',
                        ios: 'best',
                    },
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    distanceFilter: 0,
                    forceRequestLocation: true,
                    forceLocationManager: false,
                    showLocationDialog: true,
                },
            );
        }

        getPosition()
    }, []);

    useEffect(() => {
        if (location) {
            animatedValue.setValue(0);
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [location]);

    const renderLocation = () => {
        if (!location) {
            return <Text>Loading location...</Text>;
        }

        const latitude = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [location.latitude, location.latitude + 100],
        });

        const longitude = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [location.longitude, location.longitude + 100],
        });

        return (
            <View style={styles.location}>
                <Text style={styles.latitude}>{latitude}</Text>
                <Text style={styles.longitude}>{longitude}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderLocation()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    location: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    latitude: {
        fontSize: 20,
        fontWeight: "bold",
    },
    longitude: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default FetchAddressScreen;