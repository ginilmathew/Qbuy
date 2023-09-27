import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommonTexts from '../../../Components/CommonTexts'

const Table = ({children}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <View style={styles.dateView}>
                    <CommonTexts label={'Date'} fontSize={13}/>
                </View>
                <View style={styles.descriptionView}>
                    <CommonTexts label={'Description'} fontSize={13}/>
                </View>
                <View style={styles.coinView}>
                    <CommonTexts label={'Coin(s)'} fontSize={13}/>
                </View>
            </View>
           {children}
        </View>
    )
}

export default Table

const styles = StyleSheet.create({
    container: {
        borderWidth:1, 
        borderColor:'#E9E9E9', 
        borderRadius:15,  
        marginTop:15
    },
    headerView : {
        flexDirection:'row' , 
        borderBottomWidth:1, 
        borderColor:"#E9E9E9"
    },
    dateView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.25, 
        paddingVertical:8, 
        borderRightWidth:1, 
        borderColor:"#E9E9E9"
    },
    descriptionView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.5,  
        borderRightWidth:1, 
        borderColor:"#E9E9E9"
    },
    coinView : {
        marginLeft: 10,
        justifyContent:'center', 
        alignItems:'center',
        flex:0.25
    }
})