import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PandaContext from '../contexts/Panda'

const CommonWhatsappButton = ({ position, bottom, right,iconName }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    const gotTowhtsapp = useCallback(() => {
        let msg = "Hi";
        let phoneWithCountryCode = "+918137009905";
      
        let mobile =
          Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;
        if (mobile) {
          if (msg) {
            let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
            Linking.openURL(url)
              .then(data => {
                // console.log("WhatsApp Opened");
              })
              .catch(() => {
                Alert("Make sure WhatsApp installed on your device");
              });
          } else {
            Alert("Please insert message to send");
          }
        } else {
          Alert("Please insert mobile no");
        }
      
    }, [])

    return (
        <TouchableOpacity
            style={{
              zIndex:100,
                width: 50,
                height: 50,
                backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                position: position,
                bottom: bottom,
                right: right
            }}
            onPress={gotTowhtsapp}
        >
            <Ionicons name={iconName ? iconName : 'logo-whatsapp'} color='#fff' size={25} />

        </TouchableOpacity>
    )
}

export default CommonWhatsappButton

const styles = StyleSheet.create({})