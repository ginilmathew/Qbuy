import React, { memo, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';



const ShopCardSkeltion = memo(() => {

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

  

    const { width, height, fontScale } = useWindowDimensions()
    const styles = makeStyles(height);

    

    return (
        <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}}>
            <Animated.View
            style={{ width: width / 4.6, height: width / 4.2, alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 5, backgroundColor: '#dcddde', margin: 4, opacity }}
        >
            
           
        </Animated.View>
        <Animated.View
                style={{paddingTop:5,backgroundColor:'#dcddde',width:'90%',height:10, opacity}}
            ></Animated.View>
        </TouchableOpacity>
    
    )
})

export default ShopCardSkeltion

const makeStyles = height => StyleSheet.create({

    itemText: {
       
        marginTop: 5,
        height: 10,
        backgroundColor: '#fafafa',
        width: '100%'
    }
})