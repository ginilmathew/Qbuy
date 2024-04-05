import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ContactCard = ({heading,content,iconColor,iconName, onpress}) => {
    return (
        <View style={{marginTop:20}}>
            <CommonTexts label={heading} fontSize={19}/>
            <View style={styles.container}>
                <View style={{flex:0.8}}>
                    <Text
                        style={styles.contentText}
                    >{content}</Text>

                </View>
                <TouchableOpacity style={{width:40,height:40, borderRadius:30, backgroundColor: iconColor, alignItems:'center', justifyContent:'center'}} onPress={onpress ? onpress : null}>
                    
                    <Ionicons name={iconName} color={'#fff'} size={20}/>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ContactCard

const styles = StyleSheet.create({
    container : {
        flexDirection:'row', 
        justifyContent:'space-between',
        alignItems:'center'
    },
    contentText : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 11,
    }
})