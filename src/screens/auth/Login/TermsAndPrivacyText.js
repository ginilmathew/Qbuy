import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const TermsAndPrivacyText = ({ privacyPress, termsPress }) => {
    return (
        <View style={{alignItems:'center'}}>
            <View style={{flexDirection:'row', marginTop:20}}>
                <Text style={styles.text1}>{"By Sign in, you agree to QbuyPanda's"}</Text>
                <TouchableOpacity onPress={termsPress}>
                    <Text style={styles.text2}>{" Terms of Use"}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', }}>
                <Text style={styles.text1}>{"and"}</Text>
                <TouchableOpacity onPress={privacyPress}>
                    <Text style={styles.text2}>{" Privacy Policy"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default TermsAndPrivacyText

const styles = StyleSheet.create({
    text1 : {
        fontFamily: 'Poppins-Light',
        color: '#8D8D8D',
        fontSize: 11,
    },
    text2 : {
        fontFamily: 'Poppins-Light',
        color: '#0800FF',
        fontSize: 11,
    }
})