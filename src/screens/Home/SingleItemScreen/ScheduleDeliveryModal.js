import { StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from '../../../Components/CustomButton'

import CommonPicker from '../../../Components/CommonPicker'
import DatePicker from 'react-native-date-picker'
import moment from 'moment';

const ScheduleDeliveryModal = ({ date, setDate, showModal, onPress, checkout }) => {

    const [openCalendar, setOpenCalendar] = useState(false)

    const { width, height } = useWindowDimensions()


    return (
        <Modal
            animationType="slide"
            transparent={ true }
            visible={ showModal }
            onDismiss={ onPress }
        >
            <View style={ { width: width - 50, backgroundColor: '#fff', borderRadius: 20, alignSelf: 'center', marginTop: 300, shadowOpacity: 0.1, shadowOffset: { x: 5, y: 5 }, paddingHorizontal: 20, paddingVertical: 10, elevation: 5 } }>
                <TouchableOpacity onPress={ onPress } style={ { position: 'absolute', right: 15, top: 10, zIndex: 1 } }>
                    <Ionicons name='close-circle' color='#000' size={ 25 } />
                </TouchableOpacity>
                <CommonTexts label={ 'Schedule Delivery' } fontSize={ 18 } textAlign='center' />
                <CommonPicker
                    onPress={ () => setOpenCalendar(true) }
                    label={ moment(date).format("DD-MM-YYYY  hh:mm A") }
                    topLabel='Delivery Date & Time'
                    icon={ <Ionicons name={ 'calendar' } size={ 20 } color={ "#5261E0" } /> }
                    mt={ 10 }
                    backgroundColor='#fff'
                    borderWidth={ 0.5 }
                />
                <DatePicker
                    mode='datetime'
                    modal
                    open={ openCalendar }
                    date={ date }
                    onConfirm={ (date) => {
                        setOpenCalendar(false)
                        setDate(date)
                    } }
                    onCancel={ () => {
                        setOpenCalendar(false)
                    } }
                />
                <CustomButton
                    onPress={ checkout }
                    label={ 'Proceed to Checkout' } bg='#58D36E' mt={ 20 } mb={ 10 }
                />


            </View>
        </Modal>
    )
}

export default ScheduleDeliveryModal

const styles = StyleSheet.create({})