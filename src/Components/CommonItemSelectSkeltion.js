import { StyleSheet } from 'react-native'
import React, { memo, useEffect } from 'react'
import Animated, { useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { View } from 'react-native-animatable';


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
  <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
  <Animated.View
            style={{ backgroundColor:'#fff', elevation: 10, alignItems: 'center', justifyContent: "center", marginLeft: 10, marginVertical: 10, shadowOpacity: 0.1, shadowRadius: 1, opacity,width:65,height:65,borderRadius:50 }}
        >
           
        </Animated.View>
        <Animated.View
                style={{
                    paddingVertical: 4,
                    paddingHorizontal: 5,
                    backgroundColor:'#fff',
                    opacity,
                    width:'80%'
                }}
            ></Animated.View>

        
        </View>
        

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