import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import CommonTexts from '../../../Components/CommonTexts'

const PandaCoinListCard = memo(({item}) => {
    return (
        <View 
            style={styles.container}
        >
            <View style={styles.headerView}>
                <Text style={styles.headerText}>{item?.date}</Text>
            </View>
            <View style={styles.descriptionView}>
                <Text
                    style={styles.descriptionText}
                >{item?.description}</Text>
            </View>
            <View style={styles.coinTextView}>
                <Text style={{ color: item?.color, fontFamily:'Poppins-SemiBold', fontSize:18  }}>{item?.coin}</Text>
            </View>
        </View>
    )
})

export default PandaCoinListCard

const styles = StyleSheet.create({
    container : {
        flexDirection:'row' , 
        borderTopWidth:1, 
        borderColor:"#E9E9E9"
    },
    headerView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.25, 
        paddingVertical:8, 
        borderRightWidth:1, 
        borderColor:"#E9E9E9"
    },
    headerText : {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,
    },
    descriptionView : {
        marginLeft: 10,
        justifyContent:'center', 
        flex:0.5,  
        borderRightWidth:1, 
        borderColor:"#E9E9E9",
    },
    descriptionText : {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 12,
    },
    coinTextView : {
        marginLeft: 10,
        justifyContent:'center', 
        alignItems:'center',
        flex:0.25
    }
})