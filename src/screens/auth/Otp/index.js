/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, ScrollView, Platform, SafeAreaView, ToastAndroid, TouchableOpacity, PermissionsAndroid, Keyboard } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonAuthBg from '../CommonAuthBg';
import CustomButton from '../../../Components/CustomButton';
import CommonTitle from '../../../Components/CommonTitle';
import OtpInput from '../../../Components/OtpInput';
import CommonTexts from '../../../Components/CommonTexts';
import AuthContext from '../../../contexts/Auth';
import LoaderContext from '../../../contexts/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';
import reactotron from 'reactotron-react-native';
import { NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import CommonUpdateModal from '../../../Components/CommonUpdateModal';
import CartContext from '../../../contexts/Cart';
const { mode } = NativeModules.RNENVConfig;

const Otp = ({ navigation }) => {
	const DeviceVersion = DeviceInfo.getVersion();
	const user = useContext(AuthContext);
	const loadingg = useContext(LoaderContext);
	const cartContext = useContext(CartContext)
	let loader = loadingg?.loading;
	const [location, setLocation] = useState(null);
	let mobileNo = user?.login?.mobile;




	const [versionUpdate, setversionUpdate] = useState(false);
	const [forceUpdate, setForceUpdate] = useState(false);


	const schema = yup.object({
		otp: yup.number().required('OTP is required'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema),
	});

	var cardnumber = mobileNo;
	var first2 = cardnumber?.substring(0, 2);
	var last1 = cardnumber?.substring(cardnumber.length - 1);

	let mask = cardnumber?.substring(2, cardnumber.length - 1).replace(/\d/g, '*');
	let phoneNum = first2 + mask + last1;

	const onSubmit = async (data) => {
		Keyboard.dismiss()
		loadingg.setLoading(true);
		//getCurrentLocation();
		let datas = {
			mobile: mobileNo,
			otp: data?.otp,
			location: user?.location,
			type: mode,
			os: Platform?.OS,

		};
		await customAxios.post('auth/customerlogin', datas)
			.then(async response => {
				user.setUserData(response?.data?.user);
				AsyncStorage.setItem('token', response?.data?.access_token);
				AsyncStorage.setItem('user', JSON.stringify(response?.data?.user));
				getAddressList()
				if (DeviceVersion * 1 < response?.data?.current_version * 1) {
					if (DeviceVersion * 1 < response?.data?.current_version * 1 && response?.data?.update) {
						setversionUpdate(true);
						setForceUpdate(true);
		
					} else if (DeviceVersion * 1 < data?.current_version * 1 && !data?.update) {
						setversionUpdate(true);
		
					}
				} 

				//getAddressList()

				//VersionManagement(response?.data);
				loadingg.setLoading(false);
				// navigation.navigate(mode)
				// navigation.navigate('NewUserDetails')
			})
			.catch(async error => {
				Toast.show({
					type: 'error',
					text1: error,
				});
				loadingg.setLoading(false);
			});
	};

	const getAddressList = async () => {
        //loadingContext.setLoading(true)
        await customAxios.get('customer/address/list')
            .then(async response => {
                if (response?.data?.data?.length > 0) {
                    if (response?.data?.data?.length === 1) {
                        user.setLocation([response?.data?.data?.[0]?.area?.latitude, response?.data?.data?.[0]?.area?.longitude])
                        user?.setCurrentAddress(response?.data?.data?.[0]?.area?.address)
						cartContext.setDefaultAddress(response?.data?.data?.[0])
                    }
                    else {
                        let defaultAdd = response?.data?.data?.find(add => add?.default === true)
                        if (defaultAdd) {
							cartContext.setDefaultAddress(defaultAdd)
                            user.setLocation([defaultAdd?.area?.latitude, defaultAdd?.area?.longitude])
                            user?.setCurrentAddress(defaultAdd?.area?.address)
                        }
                        else {
							cartContext.setDefaultAddress(response?.data?.data?.[0])
                            user.setLocation([response?.data?.data?.[0]?.area?.latitude, response?.data?.data?.[0]?.area?.longitude])
                            user?.setCurrentAddress(response?.data?.data?.[0]?.area?.address)
                        }
                    }

					navigation.dispatch(CommonActions.reset({
						index: 0,
						routes: [
							{ name: 'green' },
						],
					}));

					//navigation.navigate('NewUserDetails')

                    //setInitialScreen('green');
                }
                else {
                    // navigation.dispatch(CommonActions.reset({
					// 	index: 0,
					// 	routes: [
					// 		{ name: 'AddNewLocation' },
					// 	],
					// }));
					navigation.push('AddNewLocation', { mode: 'home' })
                }

            })
            .catch(async error => {
                //getAddressFromCoordinates()
                Toast.show({
                    type: 'error',
                    text1: error,
                });

            })
    }

	const onClickResendOtp = async () => {
		loadingg.setLoading(true);
		await customAxios.post('auth/customerloginotp', { mobile: mobileNo })
			.then(async response => {
				Toast.show({
					type: 'success',
					text1: response?.data?.message,
				});
				loadingg.setLoading(false);
			})
			.catch(async error => {
				Toast.show({
					type: 'error',
					text1: error,
				});
				loadingg.setLoading(false);
			});

	};




	

	




	



	

	const NavigationToBack = useCallback(() => { navigation.goBack(); }, [navigation]);


	const ColoseUpdateModal = useCallback(() => {
		setversionUpdate(false);
		navigation.dispatch(CommonActions.reset({
			index: 0,
			routes: [
				{ name: 'green' }
			],
		}))
	}, [versionUpdate])

	const VersionManagement = (data) => {
		if (DeviceVersion * 1 < data?.current_version * 1) {
			if (DeviceVersion * 1 < data?.current_version * 1 && data?.update) {
				setversionUpdate(true);
				setForceUpdate(true);

			} else if (DeviceVersion * 1 < data?.current_version * 1 && !data?.update) {
				setversionUpdate(true);

			}
		} else {
			navigation.dispatch(CommonActions.reset({
				index: 0,
				routes: [
					{ name: 'green' },
				],
			}));
			// setversionUpdate(true);
		}
	};

	return (
		<CommonAuthBg>
			<ScrollView style={ { flex: 1, paddingHorizontal: 40 } } keyboardShouldPersistTaps="always">
				<SafeAreaView>
					<CommonTitle goBack={ NavigationToBack } mt={ 40 } />
					<CommonTexts
						label={ 'Enter the 4 - digit code we sent to your registered mobile number' }
						mt={ 40 }
						fullLabel={true}
					/>
					<CommonTexts
						label={ phoneNum }
						mt={ 40 }
						textAlign="center"
					/>
					<OtpInput
						onchange={ (text) => {
							setValue('otp', text);
						} }
					/>
					{ errors?.otp && <Text style={ { color: 'red', fontSize: 10 } } > { errors?.otp?.message }</Text> }
					<TouchableOpacity onPress={ onClickResendOtp }>
						<CommonTexts
							label={ 'Resend OTP' }
							mt={ 10 }
							textAlign="right"
							color={ '#5871D3' }
						/>
					</TouchableOpacity>

					<CustomButton
						onPress={ !loader ? handleSubmit(onSubmit) : null }
						bg={ mode === 'fashion' ? '#FF7190' : '#58D36E' }
						label={ 'Confirm' }
						my={ 20 }
						width={ 100 }
						alignSelf="center"
						loading={ loader }
					/>
				</SafeAreaView>
			</ScrollView>
			{ versionUpdate && <CommonUpdateModal isopen={ versionUpdate } CloseModal={ ColoseUpdateModal } ForceUpdate={ forceUpdate } /> }
		</CommonAuthBg>
	);
};

export default Otp;

const styles = StyleSheet.create({

	logo: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		marginTop: 100,
		alignSelf: 'center',
	},
});
