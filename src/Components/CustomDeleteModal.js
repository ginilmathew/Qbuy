import { StyleSheet, TouchableOpacity, View, Modal, useWindowDimensions } from 'react-native'
import React from 'react'


import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomButton from './CustomButton'
import CommonTexts from './CommonTexts'

const DeleteUserModal = ({ visible, onDismiss, onPress,label }) => {

    const { width } = useWindowDimensions()

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onDismiss={onDismiss}
        >
            <View
                style={{ width: width - 50, backgroundColor: '#fff', borderRadius: 20, alignSelf: 'center', marginTop: 300, shadowOpacity: 0.1, shadowOffset: { x: 5, y: 5 }, paddingHorizontal: 20, paddingVertical: 10, elevation: 5 }}
            >
                <TouchableOpacity
                    onPress={onDismiss}
                    style={{ position: 'absolute', right: 15, top: 10, zIndex: 1 }}
                >
                    <Ionicons name='close-circle' color='#000' size={25} />
                </TouchableOpacity>
                <CommonTexts label={label} fontSize={16} textAlign='center' mt={20} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                    <CustomButton
                        onPress={onDismiss}
                        label={'NO'} bg='#F32B2B' width={width / 3}
                    />
                    <CustomButton
                        onPress={onPress}
                        label={'YES'} bg='#58D36E' width={width / 3}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default DeleteUserModal

const styles = StyleSheet.create({})