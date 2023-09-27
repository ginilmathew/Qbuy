import { StyleSheet } from 'react-native'
import React from 'react'
import OTPTextInput from 'react-native-otp-textinput'

const OtpInput = ({onchange}) => {
    return(   
        
        <OTPTextInput 
            inputCount={4}
            textInputStyle={styles.container}
            tintColor='#E5E5E5'  
            handleTextChange={onchange} 
        />  
    )
}

export default OtpInput

const styles = StyleSheet.create({
    container:{
        height:50,
        width:50,
        backgroundColor:"#fff",
        borderRadius:10,
        borderBottomWidth:0,
        color:'#000',
        shadowOpacity:0.1,
        shadowOffset: {width: 1,height: 3},
        marginTop:100,
        elevation:2
    }
})