import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ModalScreen = () => {
    const navigation = useNavigation();

    const handleCloseModal = () => {
        navigation.goBack();
    };

    const loginUser = () => {
        navigation.navigate("Login")
    }

    return (
        <View style={styles.container}>
            <View style={styles.modal}>
                <Text style={styles.warningText}>Welcome as a Guest User!</Text>
                <Text style={styles.messageText}>As a guest user, you have limited access to certain features.</Text>
                <Button title="Continue as Guest" onPress={handleCloseModal} />
                <Button title="Login" onPress={loginUser} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%', // Adjust the width as needed
        alignItems: 'center',
    },
    warningText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    messageText: {
        marginBottom: 20,
    },
});

export default ModalScreen;