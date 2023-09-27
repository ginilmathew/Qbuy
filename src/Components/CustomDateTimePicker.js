import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import DatePicker from 'react-native-date-picker'
const CustomDateTimePicker = ({ date, open, setDate, setOpen, label }) => {
    return (
        <View>
            <Text style={styles?.lable}>{label}</Text>
            <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    )
}

export default CustomDateTimePicker
const styles = StyleSheet.create({
    lable: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        marginBottom: 5,
        letterSpacing: 1
    }
})