import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'

const AddressCard = memo(({ setSelected, selected, item }) => {

    const onClick = () => {
        setSelected(item)
    }
  

    return (
        <TouchableOpacity
            onPress={onClick}
            style={styles.container}
        >
            <View style={{ flex: 1 }}>
                <Text
                    style={styles.addressText}
                >{item?.area?.address}</Text>
            </View>
        </TouchableOpacity>
    )
})

export default AddressCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: '#E9E9E9',
        paddingVertical: 8,
        padding: 5
    },
    addressText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
        marginTop: 5
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    borderStyle: {

    },
    textStyle: {
        fontSize: 12,
        margin: 1,
        color: 'black',
        fontWeight: '600',
        marginRight: -15, color: '#8ED053'
    }

})