import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
import CartContext from '../../contexts/Cart';
import LinearGradient from 'react-native-linear-gradient';
import PandaContext from '../../contexts/Panda';
import { getProducts } from '../../helper/homeProductsHelper';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import reactotron from 'reactotron-react-native';


const CartButton = ({ bottom }) => {

    const { cart } = useContext(CartContext);
    const { active } = useContext(PandaContext)
    const [total, setTotal] = useState(0)

    const offset = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => ({
        bottom: offset.value,
    }));

    

    React.useEffect(() => {
        
        if(cart?.product_details?.length === 1){
            offset.value = withTiming(5, { duration: 3000 })
        }
        
    }, [cart?.product_details?.length]);



    const navigation = useNavigation()

    const onPress = () => {
        navigation.navigate('cart');
    }
    


    if(cart?.product_details?.length > 0) {
        return (
            <View style={{ 
                paddingTop: 70
                }}>
            <Animated.View style={[styles.container, { bottom: bottom, }]} entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.container]}
            >
                <LinearGradient
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={active === "panda" ? ['#7BE495', '#329D9C'] : active === "fashion" ? ['#FF41F2', '#FF5757'] : ['#9BFF58', '#8BC852' ]}
            style={styles.container}
        >
                <View style={styles.leftContainer}>
                    <IonIcon
                        color="#fff"
                        name='cart'
                        size={30}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.mainText}>{"Go to Cart"}</Text>
                        <Text style={styles.items}>{cart?.product_details?.length} Items</Text>
                    </View>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.totalText}>{'total'}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹ {cart?.product_details?.reduce((acc, curr) => {
            return acc + parseFloat(curr?.productdata?.price) * parseFloat(curr?.quantity)
        },0).toFixed(2)}</Text>
                    </View>
                </View>
                </LinearGradient>
            </TouchableOpacity>
            </Animated.View>
            </View>
        );
    }

    
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '98%',
        height: 60,
        marginHorizontal: 5,
        position: 'absolute',
        borderRadius: 10,
        //bottom: 100
    },
    leftContainer: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        //backgroundColor: '#b1bd9f',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        flex: 3
    },
    icon: {
        height: 24,
        width: 24,
        marginRight: 10
    },
    textContainer: {
        marginLeft: 20,
        justifyContent: 'center',
        flexShrink: 1
    },
    mainText: {
        fontFamily: 'Quicksand-Bold',
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    items: {
        color: 'white',
        fontSize: 12
    },
    subTextContainer: {
        flexDirection: 'row',

        marginTop: 2
    },
    subText: {
        color: 'white',
        marginRight: 5
    },
    rightContainer: {
        //backgroundColor: COLORS.primary,
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 8,
        paddingLeft: 8,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalText: {
        color: 'white',
        fontSize: 12
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2
    },
    price: {
        fontFamily: 'Quicksand-Bold',
        color: 'white',
        fontSize: 16
    },
    currency: {
        color: 'white',
        fontSize: 12,
        alignSelf: 'flex-end',
        marginLeft: 2
    }
});


export default CartButton