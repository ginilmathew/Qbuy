
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
import PandaContext from '../../contexts/Panda';
import { CommonActions, StackActions, TabActions, useNavigation } from '@react-navigation/native';
import HomeNav from './Home';
import CartContext from '../../contexts/Cart';
import CustomAnimated from './CustomAnimated';
import CustomMainAnimated from './CustomMainAnimated';
import AuthContext from '../../contexts/Auth';
import customAxios from '../../CustomeAxios';
import Tooltip from 'react-native-walkthrough-tooltip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import reactotron from 'reactotron-react-native';
import OrderPlaced from '../../screens/Cart/Checkout/Payment/OrderPlaced';
import { navigationRef } from '../../Navigations/RootNavigation';
import CartScreen from '../../screens/_Home/CartScreen';



const TabNav = () => {

    const [tooltip, setToolTip] = useState(false)
    const [enableSub, setEnableSub] = useState(false)
    const [enableThird, setEnableThird] = useState(false)


    const cartContext = useContext(CartContext)
    const pandaContext = useContext(PandaContext)
    const userContext = useContext(AuthContext)



    useEffect(() => {
        checkFirst()
    }, [])


    const checkFirst = async () => {
        //await AsyncStorage.removeItem("tooltip")
        let toolTip = await AsyncStorage.getItem("tooltip");

        if (!toolTip) {
            setToolTip(true)
            await AsyncStorage.setItem("tooltip", `1`)

        }


    }




    const navigation = useNavigation()
    const [isPending, startTransition] = useTransition();


    let [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
    const [showSwitch, setShowSwitch] = useState(false)


    const enableSwitch = useCallback(() => {
        //reactotron.log({pandaContext : pandaContext?.active})
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
                    <>
                        {pandaContext?.active === 'green' &&
                            <Entypo
                                name={"home"}
                                size={25}
                                color={routeName === selectedTab ? '#8ED053' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === 'panda' &&
                            <Entypo
                                name={"home"}
                                size={25}
                                color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === "fashion" &&
                            <Entypo
                                name={"home"}
                                size={25}
                                color={routeName === selectedTab ? '#FF6184' : '#FF9FB4'}
                            />
                        }
                    </>
                );
            case 'cart':
                return (
                    <>
                        
                        {pandaContext?.active === 'green' &&
                            <AntDesign
                                name={"shoppingcart"}
                                size={25}
                                color={routeName === selectedTab ? '#8ED053' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === 'panda' &&
                            <AntDesign
                                name={"shoppingcart"}
                                size={25}
                                color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === "fashion" &&
                            <AntDesign
                                name={"shoppingcart"}
                                size={25}
                                color={routeName === selectedTab ? '#FF6184' : '#FF9FB4'}
                            />
                        }
                        {cartContext?.cart?.product_details?.length > 0 && <View style={{ height: 15, width: 15, borderRadius: 7.5, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 15, right: 20, zIndex: 100 }}>
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cartContext?.cart?.product_details?.length}</Text>
                        </View>}
                    </>
                );
            case 'order':
                return (
                    <>
                        {pandaContext?.active === 'green' &&
                            <FontAwesome
                                name={"shopping-bag"}
                                size={25}
                                color={routeName === selectedTab ? '#8ED053' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === 'panda' &&
                            <FontAwesome
                                name={"shopping-bag"}
                                size={25}
                                color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === "fashion" &&
                            <FontAwesome
                                name={"shopping-bag"}
                                size={25}
                                color={routeName === selectedTab ? '#FF6184' : '#FF9FB4'}
                            />
                        }
                    </>

                );
            case 'account':
                return (
                    <>
                        {pandaContext?.active === 'green' &&
                            <Ionicons
                                name={"settings-sharp"}
                                size={25}
                                color={routeName === selectedTab ? '#8ED053' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === 'panda' &&
                            <Ionicons
                                name={"settings-sharp"}
                                size={25}
                                color={routeName === selectedTab ? '#58D36E' : '#AAD1A2'}
                            />}
                        {pandaContext?.active === "fashion" &&
                            <Ionicons
                                name={"settings-sharp"}
                                size={25}
                                color={routeName === selectedTab ? '#FF6184' : '#FF9FB4'}
                            />
                        }
                    </>

                );
        }
    };




    const renderTabBar = ({ routeName, selectedTab, navigate }) => {

   

        const NavigationPage = () => {

            const route = navigationRef.current?.getCurrentRoute()
            
            // reactotron.log("in", routeName, navigation.getState(), route)
            const state = navigation.getState()
            if(userContext?.userData){
                // if(routeName === "home" && state?.index > 0){
                //     // navigation.dispatch(
                //     //     CommonActions.reset({
                //     //         index: 0,
                //     //         routes: [
                //     //             { name: routeName },
                //     //         ],
                //     //     })
                //     // )
                //     navigation.popToTop()
                // }
                // else{
                //     navigate(routeName)
                // }
                navigate(routeName)
                //return false;
                // try {
                //     if(routeName === "home"){
                //         if(route?.name === "Cart" || route?.name === "MyOrders" || route?.name === "MyAccount" || route?.name === "Home" ){
                //             navigate(routeName)
                //         }
                //         else{
                //             console.log('navigation called')
                //             navigation.dispatch(StackActions.popToTop());
                //             const jumpToAction = TabActions.jumpTo('home')
                //             navigation.dispatch(jumpToAction);
                //         }
                       
                //         // if(navigation.canGoBack()){
                //         //     navigation.dispatch(StackActions.popToTop());
                //         // }
                //         // else{
                //         //     navigate(routeName)
                //         // }
                        
                //         //navigation.popToTop()
                //     }
                //     else{
                  
                //         navigate(routeName)
                //     }
                    
                // } catch (error) {
                //     navigate(routeName)
                // }
                //navigation.popToTop()

               
            }
            else{
                if(routeName === "home"){
                    navigate(routeName)
                    // navigation.navigate(routeName)
                    // startTransition(() => {
                    //     navigation.dispatch(
                    //         CommonActions.reset({
                    //             index: 0,
                    //             routes: [
                    //                 { name: 'green' },
                    //             ],
                    //         })
                    //     );
                    // })
                }
                else{
                    Alert.alert('Warning', 'This page not available for guest user. Click Ok to proceed with login', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {text: 'OK', onPress: () => navigation.navigate("Login")},
                      ]);
                    
                }
                
            }

        }

        if(routeName === "OrderPlaced"){
            return null
        }

        return (
            <TouchableOpacity
                onPress={NavigationPage}
                style={styles.tabbarItem}
            >
                {_renderIcon(routeName, selectedTab)}
            </TouchableOpacity>
        );
    };

    const gotoPanda = useCallback(() => {
        //switchcartUpdate('panda')
        pandaContext.setActive('panda')
        //cartContext.getCartDetails()
        //navigation.navigate("home")
        // startTransition(() => {
        //     navigation.dispatch(
        //         CommonActions.reset({
        //             index: 0,
        //             routes: [
        //                 { name: 'home' },
        //             ],
        //         })
        //     );
        // })
        //setShowSwitch(!showSwitch)
        // startTransition(() => {
        //     navigation.dispatch(
        //         CommonActions.reset({
        //           index: 0,
        //           routes: [
        //             { name: 'panda' },
        //           ],
        //         })
        //     );
        // })

    }, [showSwitch, cartContext?.cart])

    const goToFashion = useCallback(async () => {
        //switchcartUpdate('fashion')
        pandaContext.setActive('fashion')
        // startTransition(() => {
        //     navigation.dispatch(
        //         CommonActions.reset({
        //             index: 0,
        //             routes: [
        //                 { name: 'home' },
        //             ],
        //         })
        //     );
        // })
        // setShowSwitch(!showSwitch)
        // if(cartContext?.cart){
        //     await AsyncStorage.setItem("greenCart",JSON.stringify(cartContext?.cart))
        // }

        // let cartData = await AsyncStorage.getItem("fashionCart");
        // if(cartData){
        //     cartContext.setCart(JSON.parse(cartData))
        // }
        // else{
        //     cartContext.setCart(null)
        // }
        // startTransition(() => {
        //     navigation.dispatch(
        //         CommonActions.reset({
        //           index: 0,
        //           routes: [
        //             { name: 'fashion' },
        //           ],
        //         })
        //     );
        // })


    }, [cartContext?.cart, showSwitch])


    useEffect(() => {
        //reactotron.log({active: pandaContext?.active})
        if(userContext?.userData){
            cartContext.getCartDetails()
        }
        
        navigation.navigate("home")
       // setShowSwitch(!showSwitch)
    }, [pandaContext?.active])
    

    const goTogreen = useCallback(async() => {
        //switchcartUpdate('green')
        await pandaContext.setActive('green')
        
        
    }, [showSwitch, cartContext?.cart])

    const imageswitch = {
        panda: require('../../Images/home.png'),
        fashion: require('../../Images/textile.png'),
        green: require('../../Images/grocery.png')
    }


    const enableSubTool = () => {
        setToolTip(false)
        setEnableSub(true)
    }

    const disableSecond = () => {
        setEnableSub(false)
        setEnableThird(true)
    }

    


    return (
        <CurvedBottomBar.Navigator
            type="DOWN"
            style={styles.bottomBar}
            shadowStyle={styles.shawdow}
            height={70}
            circleWidth={50}
            // bgColor="#F3FFF5"
            bgColor={
                pandaContext?.active === "green" ?
                    '#F3FFF5' :
                    pandaContext?.active === "panda" ?
                        "#F3FFF5" :
                        pandaContext?.active === "fashion" ?
                            "#FFE1E7" :
                            "#F3FFF5"
            }
            initialRouteName="title1"
            screenOptions={{
                headerShown: false,
                unmountOnBlur: true
            }}
            renderCircle={({ selectedTab, navigate }) => (
                <>
                    {pandaContext?.active === "green" &&
                        <Animated.View style={styles.btnCircleUp}>
                            {showSwitch && <View style={{ position: 'absolute', bottom: 70, flexDirection: 'row', width: 120, justifyContent: 'space-between' }}>
                                <Tooltip
                                    isVisible={enableSub}
                                    content={<Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Switch to Panda!</Text>}
                                    placement="top"
                                    onClose={disableSecond}
                                    contentStyle={{
                                        backgroundColor: '#329D9C'
                                    }}
                                >
                                    <CustomAnimated
                                        onpress={gotoPanda}
                                        imageswitch={imageswitch?.panda}
                                        colors={['#7BE495', '#329D9C']}
                                    />
                                </Tooltip>
                                <Tooltip
                                    isVisible={enableThird}
                                    content={<Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Switch to Fashion!</Text>}
                                    placement="top"
                                    onClose={() => setEnableThird(false)}
                                    contentStyle={{
                                        backgroundColor: '#FF5757'
                                    }}
                                >
                                    <CustomAnimated
                                        onpress={goToFashion}
                                        imageswitch={imageswitch?.fashion}
                                        colors={['#FF41F2', '#FF5757']}
                                    />
                                </Tooltip>
                            </View>}
                            <Tooltip
                                isVisible={tooltip}
                                content={<View>
                                    <Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Click here to switch Panda/Fashion!</Text>
                                </View>}
                                placement="top"
                                onClose={enableSubTool}
                                contentStyle={{
                                    padding: 10,
                                    height: 100,
                                    borderRadius: 5,
                                    backgroundColor: '#8BC852',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CustomMainAnimated
                                    enableSwitch={enableSwitch}
                                    imageswitch={imageswitch?.green}
                                    colors={['#8BC852', '#9BFF58']}
                                />
                            </Tooltip>
                        </Animated.View>}

                    {
                        pandaContext?.active === "panda" &&
                        <Animated.View style={styles.btnCircleUp}>
                            {showSwitch && <View style={{ position: 'absolute', bottom: 70, flexDirection: 'row', width: 120, justifyContent: 'space-between' }}>
                                <Tooltip
                                    isVisible={enableSub}
                                    content={<Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Switch to Green!</Text>}
                                    placement="top"
                                    onClose={disableSecond}
                                    contentStyle={{
                                        backgroundColor: '#8BC852'
                                    }}
                                >
                                    <CustomAnimated
                                        onpress={goTogreen}
                                        imageswitch={imageswitch?.green}
                                        colors={['#8BC852', '#9BFF58']}
                                    />
                                </Tooltip>
                                <Tooltip
                                    isVisible={enableThird}
                                    content={<Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Switch to Fashion!</Text>}
                                    placement="top"
                                    onClose={() => setEnableThird(false)}
                                    contentStyle={{
                                        backgroundColor: '#FF5757'
                                    }}
                                >
                                    <CustomAnimated
                                        onpress={goToFashion}
                                        imageswitch={imageswitch?.fashion}
                                        colors={['#FF41F2', '#FF5757']}
                                    />
                                </Tooltip>
                            </View>}
                            <Tooltip
                                isVisible={tooltip}
                                content={<View>
                                    <Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Click here to switch Green/Fashion!</Text>
                                </View>}
                                placement="top"
                                onClose={enableSubTool}
                                contentStyle={{
                                    padding: 10,
                                    height: 100,
                                    borderRadius: 5,
                                    backgroundColor: '#329D9C',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CustomMainAnimated
                                    enableSwitch={enableSwitch}
                                    imageswitch={imageswitch?.panda}
                                    colors={['#7BE495', '#329D9C']}
                                />
                            </Tooltip>
                        </Animated.View>
                    }
                    {pandaContext?.active === "fashion" &&
                        <Animated.View style={styles.btnCircleUp}>
                            {showSwitch && <View style={{ position: 'absolute', bottom: 70, flexDirection: 'row', width: 120, justifyContent: 'space-between' }}>
                                <Tooltip
                                    isVisible={enableSub}
                                    content={<Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Switch to Green!</Text>}
                                    placement="top"
                                    onClose={disableSecond}
                                    contentStyle={{
                                        backgroundColor: '#8BC852'
                                    }}
                                >
                                    <CustomAnimated
                                        onpress={goTogreen}
                                        imageswitch={imageswitch?.green}
                                        colors={['#8BC852', '#9BFF58']}
                                    />
                                </Tooltip>
                                <Tooltip
                                    isVisible={enableThird}
                                    content={<Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Switch to Panda!</Text>}
                                    placement="top"
                                    onClose={() => setEnableThird(false)}
                                    contentStyle={{
                                        backgroundColor: '#329D9C'
                                    }}
                                >
                                    <CustomAnimated

                                        onpress={gotoPanda}
                                        imageswitch={imageswitch?.panda}
                                        colors={['#7BE495', '#329D9C']}
                                    />
                                </Tooltip>
                            </View>}
                            <Tooltip
                                isVisible={tooltip}
                                content={<View>
                                    <Text style={{ fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#fff' }}>Click here to switch Panda/Green!</Text>
                                </View>}
                                placement="top"
                                onClose={enableSubTool}
                                contentStyle={{
                                    padding: 10,
                                    height: 100,
                                    borderRadius: 5,
                                    backgroundColor: '#FF6184',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CustomMainAnimated
                                    enableSwitch={enableSwitch}
                                    imageswitch={imageswitch?.fashion}
                                    colors={['#FF41F2', '#FF5757']}
                                />
                            </Tooltip>
                        </Animated.View>
                    }

                </>
            )}
            // screenListeners={({ navigation, route }) => ({
            //     tabPress: (e) => {
            //         e.preventDefault()
            //         if(route?.state?.index > 0){
            //             navigation.popToTop()
            //         }
            //         else{

            //         }
            //     },
                
            // })}
            tabBar={renderTabBar}
        >
            <CurvedBottomBar.Screen
                name="home"
                position="LEFT"
                component={HomeNav}
                // listeners={({ navigation, route }) => ({
                //     tabPress: (e) => {
                //         e.preventDefault()
                //         if(route?.state?.index > 0){
                //             navigation.popToTop()
                //         }
                //     },
                    
                // })}
            />
            <CurvedBottomBar.Screen
                name="cart"
                position="LEFT"
                component={CartScreen}
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
            <CurvedBottomBar.Screen name="OrderPlaced" component={OrderPlaced}/>
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
        width: 70,
        height: 70,
        borderRadius: 35,
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