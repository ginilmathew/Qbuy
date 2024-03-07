import { StyleSheet, TextInput, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Controller } from 'react-hook-form'
import CommonSquareButton from './CommonSquareButton'

const SearchBox = ({ onPress }) => {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.box}
            activeOpacity={0.9}
        >
            <Text style={{ marginLeft: 20, color: '#0C256C21', fontFamily: 'Poppins-SemiBold' }}>Search...</Text>
            <CommonSquareButton iconName={'search'} onPress={onPress} />
        </TouchableOpacity>
    )
}

export default SearchBox


const styles = StyleSheet.create({
    box: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginTop: 5,
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        shadowOffset: { width: 1, height: 5 },
        flexDirection: 'row',
        alignItems: 'center',
        margin: 1,
        justifyContent: 'space-between',
        marginHorizontal: 18,
        height: 60
    }
})