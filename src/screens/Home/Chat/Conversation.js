import { StyleSheet, View, Text, FlatList, useWindowDimensions, Image } from 'react-native'
import React from 'react'

const Conversation = () => {

    const {width} = useWindowDimensions()

    const datas = [
        {   id: 1, 
            receive:'Welcome to Qbuy Panda How can we help you?',
            receiveTime:"8:30 AM, Today",           
            send:'Hiii',
            sendTime:'8:32 AM, Today'
        },
        
    ]      

    const renderItems = ({item}) => {    
    return(
        <View >
            <View style={{marginVertical:5, flexDirection:'row', alignItems:'center'}}>
                <View style={{width:40, height:40, borderRadius:30, backgroundColor:'#58D36E', alignItems:'center', justifyContent:'center'}}>
                    <Image
                        style={styles.logo}
                        source={require('../../../Images/logo.png')}
                    />

                </View>
                <View style={{marginLeft:5}}>
                    <View 
                        style={{alignSelf:'flex-start', backgroundColor:'#DFEFE2', padding:10, borderRadius:15, borderBottomLeftRadius:0, maxWidth: width/2.5  }}
                    >   
                        <Text style={{ fontSize:12, color:'#0A2638', fontFamily:'Nunito-SemiBold' }}>{item.receive}</Text>
                    </View>
                    <Text  style={{ fontSize:8, color:'#F81C1C', fontFamily:'Montserrat-Medium' }}>{item.receiveTime}</Text>
                </View>
            </View>

            <View style={{marginVertical:5}} >
                <View 
                    style={{alignSelf:'flex-end', backgroundColor:'#DFEFE2', padding:10, borderRadius:15, borderBottomRightRadius:0, maxWidth: width/2  }}
                >   
                    <Text  style={{ fontSize:12, color:'#0A2638', fontFamily:'Nunito-SemiBold' }}>{item.send}</Text>
                </View>
                <Text  style={{alignSelf:'flex-end', fontSize:8, color:'#F71C1C', fontFamily:'Montserrat-Medium' }}>{item.sendTime}</Text>

            </View>
        </View>
            
        )
    }

        return (
        
            <FlatList 
                data={datas}
                keyExtractor={(item) => item.id}
                renderItem={renderItems}
            />  
        )
    }

export default Conversation

const styles = StyleSheet.create({
    logo: {
		width: 40,
		height: 40,
		resizeMode: 'contain',
        marginTop:10
	},
})