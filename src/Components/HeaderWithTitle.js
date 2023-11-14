import { StyleSheet, View, SafeAreaView, StatusBar, Image, Text, TouchableOpacity, Platform, TextInput, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CommonTexts from './CommonTexts'
import { useNavigation } from '@react-navigation/native'
import PandaContext from '../contexts/Panda'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import reactotron from '../ReactotronConfig'
import AuthContext from '../contexts/Auth'


const HeaderWithTitle = ({ title, noBack, onPressBack, mode,backarrow }) => {




    const contextPanda = useContext(PandaContext)
    const userContext = useContext(AuthContext)
    let active = contextPanda.active
    const navigation = useNavigation()

    const backAction = useCallback(() => {
        if (mode === 'checkout') {
            navigation.navigate('Checkout')
        } 
        else if(mode === "home"){
            navigation.navigate('green')
        }
        else if(backarrow * 1 === 0){
            if(!userContext?.location){
                Alert.alert('warning', 'Please enable location or select any address', [
                
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ]);
            }
            else{
                navigation.goBack()
            }

        }else{
            navigation.goBack()
        }
    }, [navigation, mode])

    const onClickFashionCat = useCallback(() => {
        navigation.navigate('FashionCategory')
    }, [navigation])

    const onClickWishlist = useCallback(() => {
        navigation.navigate('Wishlist')
    }, [navigation])


    return (
        <>
            <StatusBar backgroundColor={ active === "green" ? '#8ED053' : active === "fashion" ? '#FF7190' : '#58D36E' } barStyle="dark-content" />
            <View
                style={ { backgroundColor: active === "green" ? '#8ED053' : active === "fashion" ? '#FF7190' : '#58D36E', height: Platform.OS === 'android' ? 55 : 90, flexDirection: 'row', paddingLeft: 15, alignItems: 'flex-end', } }
            >
                <View
                    style={ { flexDirection: 'row', alignItems: 'center', paddingBottom: 5 } }
                >
                    { !noBack && <TouchableOpacity onPress={ onPressBack ? onPressBack : backAction }>
                        <Ionicons name={ "chevron-back" } size={ 30 } color='#fff' marginTop={ -2 } />
                    </TouchableOpacity> }
                    <CommonTexts
                        label={ title }
                        color={ '#fff' }
                        fontSize={ 21 }
                        mt={ Platform.OS === 'android' ? 2 : -2 }
                        numberOfLines={ 1 }
                    />
                </View>
                <View style={ { flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 10, bottom: 10 } }>
                    { active === "fashion" && <>
                        <TouchableOpacity onPress={ onClickFashionCat }>
                            <AntDesign name={ "appstore1" } color="#fff" size={ 22 } />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ onClickWishlist }>
                            <Fontisto name={ "heart" } color="#fff" size={ 20 } marginLeft={ 10 } />
                        </TouchableOpacity>
                    </> }
                </View>
            </View>
        </>
    )
}

export default HeaderWithTitle

const styles = StyleSheet.create({})