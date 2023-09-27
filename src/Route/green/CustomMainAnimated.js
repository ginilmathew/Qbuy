import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
  } from 'react-native-reanimated';

const duration = 3000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);
const CustomMainAnimated = (props) => {


    const { enableSwitch, colors, imageswitch } = props;

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
    transform: [{ rotate: `${sv.value * 45}deg` }],
  }));


   


    return (
     
            <TouchableOpacity
                style={styles.button}
                onPress={enableSwitch}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={colors}
                    style={styles.panda}
                >
                    <Animated.Image
                        style={animatedStyle}
                        source={imageswitch}
                    />
                </LinearGradient>
            </TouchableOpacity>
     
    )
}

export default CustomMainAnimated

const styles = StyleSheet.create({

    button: {
        flex: 1,
        height:'100%',
        justifyContent: 'center',
    },

    panda: {
        width: 70,
        height: 70,
        borderRadius: 35,
        zIndex:50,
        alignItems: 'center',
        justifyContent: 'center'
    },
   
})