import { StyleSheet, Text, View, Modal, useWindowDimensions, Image, TouchableOpacity, Platform, Linking, NativeModules } from 'react-native'
import React, { useCallback } from 'react'
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const { env, mode } = NativeModules.RNENVConfig

const VersionUpgrade = () => {

    const { height, width } = useWindowDimensions();

    const sv = useSharedValue(-1);

    React.useEffect(() => {
        sv.value = withRepeat(
            withSequence(
                withTiming(1, { duration, easing }),
                withTiming(-1, { duration, easing })
            ),
            -1,
            false)
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 180}deg` }],
    }));


    const UpdateUrl = useCallback(() => {
        if(Platform.OS === "android"){
            if(mode === "green"){
                Linking.openURL("https://play.google.com/store/apps/details?id=com.diginest.qbuygreen")
            }
            else if(mode === "panda"){
                Linking.openURL("https://play.google.com/store/apps/details?id=com.qbuypanda.app")
            }
            else{
                Linking.openURL("https://play.google.com/store/apps/details?id=com.diginest.qbuyfashion")
            }
        }
        else if(Platform.OS === "ios"){
            if(mode === "green"){
                Linking.openURL("https://apps.apple.com/us/app/qbuygreen/id6449479579")
            }
            else if(mode === "panda"){
                Linking.openURL("https://apps.apple.com/us/app/qbuypanda/id6469049164")
            }
            // else{
            //     Linking.openURL("https://play.google.com/store/apps/details?id=com.diginest.qbuyfashion")
            // }
        }
    }, [])


    return (
        <View style={{ height, paddingVertical: 100, justifyContent: 'center', paddingHorizontal: 30, elevation: .1 }}>
            <View style={{ backgroundColor: '#fff', height: height / 2.5, borderRadius: 10, alignItems: 'center', justifyContent: 'space-evenly', padding: 5 }}>
                <Text style={{ fontSize: 22, textAlign: 'center' }}>A new version is available. Please update app !!</Text>
                <View>
                    <Animated.Image
                        style={[animatedStyle, { height: 60, width: 65 }]}
                        source={require('../../Images/update.png')}
                    />

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={UpdateUrl} style={{ height: 40, width: 90, justifyContent: 'center', alignItems: 'center', backgroundColor: '#56D06D', borderRadius: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>UPDATE</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </View>
    )
}

export default VersionUpgrade

const styles = StyleSheet.create({})