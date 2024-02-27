/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { Image, StyleSheet, Text, View, ScrollView, useWindowDimensions, Modal, TouchableOpacity, Linking, Alert } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import CommonTexts from '../../Components/CommonTexts';
import ListCard from './ListCard';
import CustomButton from '../../Components/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import HeaderWithTitle from '../../Components/HeaderWithTitle';
import { CommonActions, useNavigation } from '@react-navigation/native';
import PandaContext from '../../contexts/Panda';
import LogoutModal from './LogoutModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../contexts/Auth';
import customAxios from '../../CustomeAxios';
import Toast from 'react-native-toast-message';
import CartContext from '../../contexts/Cart';
import { IMG_URL } from '../../config/constants';
import reactotron from '../../ReactotronConfig';
import DeleteUserModal from '../../Components/CustomDeleteModal';
import AddressContext from '../../contexts/Address';



const MyAccount = ({ navigation }) => {


    const { height, width } = useWindowDimensions();
    const contextPanda = useContext(PandaContext);
    const cartContext = useContext(CartContext);
    const userContext = useContext(AuthContext);
    const addressContext = useContext(AddressContext)
    let active = contextPanda.active;

    const user = useContext(AuthContext);
    let userData = user?.userData;

    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const gotoMyAddress = useCallback(() => {
        navigation.navigate('MyAddresses', { mode: 'MyAcc' });
    }, [navigation]);

    const gotoPandaCoins = useCallback(() => {
        navigation.navigate('PandaCoins');
    }, [navigation]);

    const gotoAffiliateBonus = useCallback(() => {
        navigation.navigate('AffiliateBonus');
    }, [navigation]);


    const onClose = useCallback(() => {
        setShowModal(false);
    }, [navigation]);

    const OpenDelete = useCallback(() => {
        setDeleteModal(true);
    }, [navigation]);

    const CloseDelete = useCallback(() => {
        setDeleteModal(false);
    }, [navigation]);


    const getPosition = async () => {
        await Geolocation.getCurrentPosition(
            position => {
                userContext.setLocation([position?.coords?.latitude, position.coords?.longitude]);
            },
            error => {
                Toast.show({
                    type: 'error',
                    text1: error,
                });

            },
            {
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 0,
                forceRequestLocation: true,
                forceLocationManager: false,
                showLocationDialog: true,
            },
        );
    };

    const onClickDelete = async () => {
        try {
            await customAxios.get('/customer/customer-account-delete');
            cartContext.setCart(null);
            cartContext.setAddress(null);
            cartContext.setDefaultAddress(null);
            userContext.setCurrentAddress(null);
            userContext.setUserLocation(null);
            userContext.setCity(null);
            userContext.setLocation(null);
            await AsyncStorage.clear();
            setDeleteModal(false);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Login' },
                    ],
                })
            );
            userContext.setUserData(null);
        } catch (err) {

        }
    };


    const onClick = async () => {
        cartContext.setCart(null);
        cartContext.setAddress(null);
        cartContext.setDefaultAddress(null);
        userContext.setLocation(null);
        userContext.setCurrentAddress(null);
        userContext.setUserLocation(null);
        userContext.setCity(null);
        addressContext.setCurrentAddress(null)
        await AsyncStorage.clear();
        setShowModal(false);
        Toast.show({
            type: 'success',
            text1: 'Logout successfully',
        });
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Login' },
                ],
            })
        );
        userContext.setUserData(null);

    };

    const onEdit = useCallback(() => {
        navigation.navigate('EditProfile');
    }, [navigation]);


    const aboutPress = useCallback(() => {
        Linking.openURL('https://qbuypanda.com/usage/about')
    }, [])

    const termsPress = useCallback(() => {
        Linking.openURL('https://qbuypanda.com/usage/toc')
    }, [])


    const privacyPress = useCallback(() => {
        Linking.openURL('https://qbuypanda.com/usage/privacy')
    }, [])

    const cancelPress = useCallback(() => {
        Linking.openURL('https://qbuypanda.com/usage/cancel')
    }, [])

    const shippingPress = useCallback(() => {
        Linking.openURL('https://qbuypanda.com/usage/shipping')
    }, [])

    const whatPress = useCallback(() => {
        Linking.canOpenURL('whatsapp://send?text=&phone=8137009905')
            .then(supported => {
                if (!supported) {
                    Alert.alert(
                        'Please install whats app to send direct message to Qbuy support via whatsapp'
                    );
                } else {
                    return Linking.openURL('whatsapp://send?text=&phone=8137009905');
                }
            })
            .catch(err => console.error('An error occurred', err));
        // Linking.openURL('whatsapp://send?text=&phone=8137009905')
        // .then()
        // .catch(err => {
        //     Alert.alert('Please install whats app to send direct message to Qbuy support via whats app');
        // })
    }, [])

    return (
        // <>
        //     {active === 'fashion' || active === 'panda' ? <>
        //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20 }}>Coming Soon!!!</Text></View>
        //     </> :
        <>
            <HeaderWithTitle title={'My Account'} noBack />
            <ScrollView style={{ flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' }}>
                <View style={{ alignItems: 'center' }}>
                    <View>
                        <Image
                            style={styles.logo}

                            source={userData?.image ? { uri: `${IMG_URL}${userData?.image}` } : require('../../Images/drawerLogo.png')}
                        />
                        <TouchableOpacity
                            onPress={onEdit}
                            style={{ width: 25, height: 25, borderRadius: 15, backgroundColor: active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginTop: -25 }}
                        >
                            <MaterialIcons name="edit" size={15} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <CommonTexts
                        label={userData?.name}
                        color="#23233C"
                        fontSize={13}
                        mt={3}
                    />
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#A9A9A9',
                            fontSize: 9,
                        }}
                    >{userData?.email}</Text>
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#A9A9A9',
                            fontSize: 9,
                            marginTop: 1,
                        }}
                    >{userData?.mobile}</Text>
                </View>
                <View style={{ marginHorizontal: 20 }}>
                    <ListCard
                        onPress={gotoMyAddress}
                        img={active === 'green' ? require('../../Images/addressOrange.png') : active === 'fashion' ? require('../../Images/fashionAddress.png') : require('../../Images/address.png')}
                        label={'My Addresses'}
                    />
                    {/* <ListCard
                                onPress={
                                    // gotoPandaCoins
                                    null
                                }
                                img={active === 'green' ? require('../../Images/Orangepanda.png') : active === 'fashion' ? require('../../Images/fashionPanda.png') : require('../../Images/panda.png')}
                                label={'Panda Coins'}
                                pandaCoin=''
                            /> */}
                    {/* {!active === 'fashion' || !active === 'green' ? null : <ListCard
                                onPress={
                                    // gotoAffiliateBonus
                                null
                                }
                                img={active === 'green' ? require('../../Images/affiliateOrange.png') : require('../../Images/affiliate.png')}
                                label={'Affiliate Bonus'}
                            />} */}
                    <ListCard
                        onPress={aboutPress}
                        img={active === 'green' ? require('../../Images/buildingOrange.png') : active === 'fashion' ? require('../../Images/fashionBuilding.png') : require('../../Images/building.png')}
                        label={'About Us'}
                    />
                    <ListCard
                        onPress={termsPress}
                        img={active === 'green' ? require('../../Images/fileOrange.png') : active === 'fashion' ? require('../../Images/fashionFile.png') : require('../../Images/file.png')}
                        label={'Terms & Conditions'}
                    />
                    <ListCard
                        onPress={privacyPress}
                        img={active === 'green' ? require('../../Images/fileOrange.png') : active === 'fashion' ? require('../../Images/fashionFile.png') : require('../../Images/file.png')}
                        label={'Privacy Policy'}
                    />
                    <ListCard
                        onPress={cancelPress}
                        img={active === 'green' ? require('../../Images/fileOrange.png') : active === 'fashion' ? require('../../Images/fashionFile.png') : require('../../Images/file.png')}
                        label={'Cancellation & Refund Policy'}
                    />
                    <ListCard
                        onPress={shippingPress}
                        img={active === 'green' ? require('../../Images/fileOrange.png') : active === 'fashion' ? require('../../Images/fashionFile.png') : require('../../Images/file.png')}
                        label={'Shipping Policy'}
                    />
                    {/* <ListCard
                        img={active === 'green' ? require('../../Images/fileOrange.png') : active === 'fashion' ? require('../../Images/fashionFile.png') : require('../../Images/file.png')}
                        label={'Panda Coins Terms'}
                    /> */}
                    <ListCard
                        onPress={whatPress}
                        icon={<MaterialCommunityIcons name='whatsapp' color='#21AD37' size={24} />}
                        label={'Help and Support'}
                        DntshowRightArrow
                        noBorder
                    />

                </View>

                <View style={{ flexDirection: 'row', gap: 5, width: width, justifyContent: 'space-around' }}>
                    <CustomButton
                        width={width / 2.5}
                        onPress={() => setShowModal(true)}
                        label={'Logout'}
                        bg={active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E'}
                        mb={100}
                        mt={20}
                    />
                    <CustomButton
                        width={width / 2.5}
                        onPress={OpenDelete}
                        label={'Delete'}
                        bg={'red'}
                        mb={100}
                        mt={20}
                    />
                </View>

                {showModal && <LogoutModal
                    visible={showModal}
                    onDismiss={onClose}
                    onPress={onClick}
                    label={'Are you sure to logout?'}
                />}
                {deleteModal && <DeleteUserModal
                    visible={deleteModal}
                    onDismiss={CloseDelete}
                    onPress={onClickDelete}
                    label={'Are you sure you want to delete your account?'}
                />}
            </ScrollView>
        </>
        // </>
    );
};

export default MyAccount;

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: 20,
        borderRadius: 50,
    },
});
