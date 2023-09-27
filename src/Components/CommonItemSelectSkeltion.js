import { StyleSheet } from 'react-native'
import React, { memo, useEffect } from 'react'
import Animated, { useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';


const CommonItemSelectSkeltion = memo(() => {

    const opacity = useSharedValue(1);


	useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withDelay(1000, withTiming(0.5, { duration: 1000 })),
				withDelay(1000, withTiming(1, { duration: 1000 })),
			),
			-1,
			false
		)
	}, [])


    return (

        <Animated.View
            style={{ backgroundColor:'#fff', borderRadius: 10, elevation: 10, alignItems: 'center', justifyContent: "center", marginLeft: 10, marginVertical: 10, shadowOpacity: 0.1, shadowRadius: 1, opacity, flex: 0.25 }}
        >
            <Animated.View
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 5,
                    backgroundColor:'#fff',
                    opacity
                }}
            ></Animated.View>

        </Animated.View>

    )
})

export default CommonItemSelectSkeltion

const styles = StyleSheet.create({
    foodTypeText: {
        fontFamily: 'Poppins-Regular',
        color: '#23233C',
        fontSize: 14,
        paddingVertical: 8
    },
    foodTypeView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: 5
    },
})