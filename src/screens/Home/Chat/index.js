import { StyleSheet, View, SafeAreaView, StatusBar, Image, Text, TouchableOpacity, Platform, TextInput,  } from 'react-native'
import React, { useContext, useEffect } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from '../../../Components/CommonTexts'
import Conversation from './Conversation'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import PandaContext from '../../../contexts/Panda'


const Chat = ({navigation}) => {


    const contextPanda = useContext(PandaContext)
    let grocery = contextPanda.greenPanda
    let fashion = contextPanda.pinkPanda


    return (
        <View style={{flex:1, backgroundColor: grocery ? '#F4FFE9' : fashion ? '#FFF5F7' : '#fff'}}>
            <HeaderWithTitle title={'Chat'}/>
            <Text
                style={{
                    fontFamily: 'Nunito-Bold',
                    color: '#23233C',
                    fontSize: 15,
                    textAlign: 'center',
                    marginTop:20
                }}
            >{'TODAY'}</Text>

            <View style={{margin:10}}>
                <Conversation/>
            </View>
            <View 
                style={{position:'absolute', bottom: Platform.OS === 'android' ? 10 : 40, flexDirection:'row', justifyContent:'space-between', alignItems:'center',  width:'100%', paddingHorizontal:20}}
            >
                <TextInput 
                    placeholder='Type your message here...'
                    color='#000'
                    placeholderTextColor={'#9E9E9E'}
                    fontFamily='Poppins-Regular'
                    fontSize={12}
                />
                <View style={{alignItems:'center', flexDirection:'row'}}>
                    <TouchableOpacity>
                        <Entypo name={"attachment"} size={21} color='#5871D3' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name={"send"} size={21} color={grocery ? '#8ED053' : '#58D36E'} marginLeft={15}/>
                    </TouchableOpacity>
                </View>
            </View>       
        </View>
    
    )
}

export default Chat

const styles = StyleSheet.create({})