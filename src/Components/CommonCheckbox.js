import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

const CommonCheckbox = ({ }) => {
    
    const [toggleCheckBox, setToggleCheckBox] = useState(false)


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>setToggleCheckBox(!toggleCheckBox)}>
                <Ionicons name={ "md-checkbox"} size={19} color= {toggleCheckBox ? "#A9A9A9" : '#30B948'}/>
            </TouchableOpacity>
            <Text style={styles.textStyle}
            >{'All'}</Text>
        </View>
    )
}

export default CommonCheckbox

const styles = StyleSheet.create({
    container:{
        flexDirection:'row', 
        alignItems:'center'
    },
    textStyle:{
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize:  13,
    }
})