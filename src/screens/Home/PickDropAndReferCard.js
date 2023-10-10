import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import CommonTexts from '../../Components/CommonTexts';


const PickDropAndReferCard = ({label,lotties, onPress, lottieFlex, ml}) => {
    return (

        // <View style={{flex:1,alignItems:'center'}}>
        //       <Text>Coming Soon!..</Text>
        // </View>
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            <View 
                style={{
                    width:65, 
                    height:45, 
                    alignItems:'center', 
                    justifyContent:'center', 
                    flex: lottieFlex,
                    marginLeft:ml,
                }}
            >
                <LottieView 
                   style={{height:'100%',width:'100%'}}
                    source={lotties} 
                    autoPlay
                    loop
                />
            </View>
            <View style={{flex:1 }}>
                <CommonTexts label={label}/>
            </View>
        </TouchableOpacity>
    )
}

export default PickDropAndReferCard

const styles = StyleSheet.create({
    container : { 
        flex:0.46, 
        backgroundColor: '#fff', 
        borderRadius: 10, 
        elevation: 2, 
        alignItems: 'center',    
        marginVertical:6, 
        shadowOpacity:0.03, 
        shadowRadius:1, 
        flexDirection:'row'
    },
    lottieView : {
        width:65, 
        height:50, 
        alignItems:'center', 
        justifyContent:'center', 
        flex:0.4 
    }
})