import { View, Text, StyleSheet, Button, useWindowDimensions, Pressable } from 'react-native'
import React, { useState } from 'react'
import CustomDateTimePicker from '../../../Components/CustomDateTimePicker'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CustomButton from '../../../Components/CustomButton'
const PreOrder = () => {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const { width } = useWindowDimensions()

    const OpenDateTime = () => {
        setOpen(true)
    }
    return (
        <View>
            <View style={styles?.container}>
                <Text style={styles.heading}>Schedule Delivery</Text>

            </View>
            <View style={styles.clockcontainer}>
                <CustomDateTimePicker date={date} open={open} label={'Delivery Date & Time'} setDate={setDate} setOpen={setOpen} />
                <View style={styles?.clock} >
                    <Text style={styles?.clocktext}>DD/MM/YYYY</Text>
                    <View style={styles.iconContainer}>
                        <Pressable onPress={OpenDateTime}>
                            <FontAwesome5 name={"calendar-alt"} size={25} color={'#5261E0'} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={styles.checkoutContainer}>
                <CustomButton
                    label={'Proceed to Checkout'} bg={'#58D36E'} width={width / 2.2}
                />
            </View>

        </View>
    )
}

export default PreOrder

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 15

    },
    heading: {
        fontFamily: 'Poppins-bold',
        color: '#23233C',
        fontSize: 18,
        letterSpacing: 1
    },
    clockcontainer: {
        paddingLeft: '10%',
        paddingRight: '10%'
    },
    clock: {
        borderColor: '#0D4E810D',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        flexDirection: 'row',
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5

    },
    clocktext: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 16,
        letterSpacing: 1
    },
    iconContainer: {
        padding: 10,
    },
    checkoutContainer: {
        marginTop: 20,
        alignItems: 'center',

    }


})