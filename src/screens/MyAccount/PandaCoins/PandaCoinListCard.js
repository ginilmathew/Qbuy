import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useContext } from 'react'
import CommonTexts from '../../../Components/CommonTexts'
import moment from 'moment'
import PandaContext from '../../../contexts/Panda'

const PandaCoinListCard = memo(({item}) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active

    return (
        <View 
            style={styles.container}
        >
            <View style={styles.headerView}>
                <Text style={styles.headerText}>{moment(item?.created_at).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={styles.descriptionView}>
                <Text
                    style={styles.descriptionText}
                >{item?.message}</Text>
            </View>
            <View style={styles.coinTextView}>
                <Text style={{ color: item?.amount < 0 ? '#F32B2B' : active === 'fashion' ? '#2D8FFF' : '#F39E2B', fontFamily:'Poppins-SemiBold', fontSize:18  }}>{item?.amount}</Text>
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