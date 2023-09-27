import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import reactotron from '../../ReactotronConfig';
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
const CustomAnimated = (props) => {
    const { onpress, imageswitch, colors } = props;

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
            <TouchableOpacity onPress={onpress}>
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={colors}
                    style={styles.smallPandas}
                >
                    <Animated.Image
                        // animation={'pulse'}
                        // easing='ease-in-out'
                        // iterationCount='infinite'
                        style={[styles.smallPandasLogo, animatedStyle]}
                        source={imageswitch}
                        //source={images}
                    />
                 </LinearGradient>
            </TouchableOpacity>
    )
}

export default CustomAnimated

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    shawdow: {
        shadowColor: '#DDDDDD',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
    },
    bottomBar: {},
    btnCircleUp: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8E8E8',
        bottom: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
    },
    imgCircle: {
        width: 30,
        height: 30,
        tintColor: 'gray',
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img: {
        width: 30,
        height: 30,
    },
    screen1: {
        flex: 1,
        backgroundColor: '#BFEFFF',
    },
    screen2: {
        flex: 1,
        backgroundColor: '#FFEBCD',
    },
    panda: {
        width: 70,
        height: 70,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    smallPandasLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'contain',
    },
    smallPandas: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
})