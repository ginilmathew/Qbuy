import { StyleSheet, View, useWindowDimensions, Modal, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingModal = ({isVisible, label, closeModal, gotoNext }) => {
    
  const { width, height } = useWindowDimensions()

  return (
    <Modal visible={isVisible} style={{ backgroundColor: 'transparent' }} transparent={true} >
        <View 
			style={ [styles.loaderStyle, { width, height }] }
		>
			<ActivityIndicator color={"red"} size={30} />
		</View>
    </Modal>
  )
}

export default LoadingModal

const styles = StyleSheet.create({
    loaderStyle: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: 2,
    }
})
