import { StyleSheet, View, useWindowDimensions, Modal, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingModal = ({isVisible, label, closeModal, gotoNext }) => {
    
  const { width, height } = useWindowDimensions()

  return (
    <Modal isOpen={isVisible}  >
        <View 
			style={ styles.loaderStyle }
		>
			<ActivityIndicator />
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
        borderRadius: 10,
        shadowOffset: 2,
    }
})
