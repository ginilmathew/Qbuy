import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import PandaContext from '../../../contexts/Panda'


const AddMoreItem = ({ label, onPress, onValueChange, icon, noBorder, img }) => {

    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda

    return (

        <TouchableOpacity 
            onPress={onPress} 
            style={styles.container} 
        >
            <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Ionicons name={"add-circle"} color={grocery ? '#FF9C0C' : fashion ? '#FF7190' : "#586DD3"} size={25}/>
                <View style={styles.labelView}>
                    <Text style={styles.labelText}>{'Add more items'}</Text>
                </View>
                <Ionicons name={"chevron-forward"} color="#939393" size={20}/>
            </View>

        </TouchableOpacity>
    )
}

export default AddMoreItem

const styles = StyleSheet.create({
    container: { 
        marginTop: 15,  
        paddingVertical:6, 
        borderWidth: 1, 
        borderColor: '#FF6600', 
        borderStyle: 'dashed', 
        //borderColor:'#F3F3F3', 
        paddingHorizontal:8, 
    },
    labelView : { 
        flex:1, 
        flexDirection:'row', 
        alignItems:'center' 
    },
    labelText : { 
        color:'#23233C', 
        fontSize:13, 
        fontFamily:'Poppins-Bold', 
        marginLeft:5 
    },

})