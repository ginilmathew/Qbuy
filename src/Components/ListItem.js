import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'


const ListItem = ({ label, onPress, onValueChange, icon }) => {

    return (

        <TouchableOpacity 
            onPress={onPress} 
            style={styles.container} 
        >
            <View style={{ flexDirection:'row', alignItems:'center' }}>
                {icon}
                <View style={{ flex:1 }}>
                    <Text style={styles.nameText}>{label}</Text>
                </View>
                <AntDesign name={"caretright"} color="#fff" size={15}/>
            </View>

        </TouchableOpacity>
    )
}

export default ListItem

const styles = StyleSheet.create({
    container : { 
        marginHorizontal:20, 
        borderBottomWidth:1, 
        borderBottomColor:'#555555A3', 
        paddingVertical:25 
    },
    nameText : { 
        color:'#fff', 
        fontSize:13, 
        fontFamily:'Poppins-Medium', 
        marginLeft:5 
    }

})