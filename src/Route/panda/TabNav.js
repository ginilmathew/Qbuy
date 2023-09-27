
import React, { useCallback, useContext, useEffect, useState, useTransition } from 'react'
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import {
    Alert,
    Animated,
    Easing,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import CartNav from '../../Navigations/CartNav';
import MyOrderNav from '../../Navigations/MyOrderNav';
import MyAccountNav from '../../Navigations/MyAccountNav';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import PandaContext from '../../contexts/Panda';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import HomeNav from './Home';
import CartContext from '../../contexts/Cart';
import reactotron from 'reactotron-react-native';



const TabNav = () => {

    const cartContext = useContext(CartContext)
    const pandaContext = useContext(PandaContext)

    reactotron.log({cart: cartContext?.cart})


    const navigation = useNavigation()
    const [isPending, startTransition] = useTransition();

    let [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
    const [showSwitch, setShowSwitch] = useState(false)

    const enableSwitch = useCallback(() => {
        setShowSwitch(!showSwitch)
    }, [showSwitch])


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                // start rotation in one direction (only half the time is needed)
                Animated.timing(animatedValue, { toValue: 1.0, duration: 150, easing: Easing.linear, useNativeDriver: true }),
                // rotate in other direction, to minimum value (= twice the duration of above)
                Animated.timing(animatedValue, { toValue: -1.0, duration: 300, easing: Easing.linear, useNativeDriver: true }),
                // return to begin position
                Animated.timing(animatedValue, { toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true })
            ])
        ).start();
    }, [])


    const _renderIcon = (routeName, selectedTab) => {
        let icon = '';

        switch (routeName) {
            case 'home':
                return (
                    <Entypo
                        name={"home"}
                        size={25}
                        color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                    />
                );
            case 'cart':
                return (
                    <>
                    {cartContext?.cart?.product_details?.length > 0  && <View style={{ height: 15, width: 15, borderRadius: 7.5, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 15, right: 20,zIndex:1 }}>
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cartContext?.cart?.product_details?.length}</Text>
                    </View>}
                    <AntDesign
                        name={"shoppingcart"}
                        size={25}
                        color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                    />
                    </>
                );
            case 'order':
                return (
                    <FontAwesome
                        name={"shopping-bag"}
                        size={25}
                        color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                    />
                );
            case 'account':
                return (
                    <Ionicons
                        name={"settings-sharp"}
                        size={25}
                        color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                    />
                );
        }
    };
    const renderTabBar = ({ routeName, selectedTab, navigate }) => {
        return (
            <TouchableOpacity
                onPress={() => navigate(routeName)}
                style={styles.tabbarItem}
            >
                {_renderIcon(routeName, selectedTab)}
            </TouchableOpacity>
        );
    }

    const gotoFashion = useCallback(() => {
        pandaContext.setActive('fashion')
        startTransition(() => {
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'fashion' },
                  ],
                })
            );
        })
        
    }, [])

    const gotoGreen = () => {
        pandaContext.setActive('green')
        startTransition(() => {
            navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'green' },
                  ],
                })
            );
        })
    }


    return (
        <CurvedBottomBar.Navigator
            type="DOWN"
            style={styles.bottomBar}
            shadowStyle={styles.shawdow}
            height={70}
            circleWidth={50}
            bgColor="#F3FFF5"
            initialRouteName="title1"
            screenOptions={{
                headerShown: false
            }}
            renderCircle={({ selectedTab, navigate }) => (
                <Animated.View style={styles.btnCircleUp}>
                    {showSwitch && <View style={{ position: 'absolute', bottom: 70, flexDirection: 'row', width: 120, justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={gotoFashion}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FF41F2', '#FF5757']}
                                style={styles.smallPandas}
                            >
                                <Animatable.Image
                                    animation={'pulse'}
                                    easing='ease-in-out-quad'
                                    iterationCount='infinite'
                                    style={styles.smallPandasLogo}
                                    // source={require('../Images/cool.png')}
                                    source={require('../../Images/textile.png')}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={gotoGreen}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#8BC852', '#9BFF58']}
                                style={styles.smallPandas}
                            >
                                <Animatable.Image
                                    animation={'pulse'}
                                    easing='ease-in-out'
                                    iterationCount='infinite'
                                    style={styles.smallPandasLogo}
                                    // source={ require('../Images/green.png')}
                                    source={require('../../Images/grocery.png')}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={enableSwitch}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#7BE495', '#329D9C']}
                            style={styles.panda}
                        >
                            <Animated.Image
                                style={{
                                    transform: [{
                                        rotate: animatedValue.interpolate({
                                            inputRange: [-1, 1],
                                            outputRange: ['-0.1rad', '0.1rad']
                                        })
                                    }]
                                }}
                                source={require('../../Images/home.png')}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            )}
            tabBar={renderTabBar}
        >
            <CurvedBottomBar.Screen
                name="home"
                position="LEFT"

                component={HomeNav}
            />
            <CurvedBottomBar.Screen
                name="cart"
                position="LEFT"
                component={CartNav}
            />
            <CurvedBottomBar.Screen
                name="order"
                component={MyOrderNav}
                position="RIGHT"
            />
            <CurvedBottomBar.Screen
                name="account"
                component={MyAccountNav}
                position="RIGHT"
            />
        </CurvedBottomBar.Navigator>
    )
}

export default TabNav

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