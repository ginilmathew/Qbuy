/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, ScrollView, Platform, SafeAreaView, ToastAndroid, TouchableOpacity, PermissionsAndroid } from 'react-native';
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
const { mode } = NativeModules.RNENVConfig;

const Otp = ({ navigation }) => {
	const DeviceVersion = DeviceInfo.getVersion();
	const user = useContext(AuthContext);
	const loadingg = useContext(LoaderContext);
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
		loadingg.setLoading(true);
		getCurrentLocation();
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
				VersionManagement(response?.data);
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

	const onClickResendOtp = async () => {
		loadingg.setLoading(true);
		await customAxios.post('auth/customerloginotp', { mobile: mobileNo })
			.then(async response => {
				// setData(response?.data?.data)
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




	function getAddressFromCoordinates (lat, lng) {
		if (lat && lng) {
			axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`).then(response => {
				user.setCurrentAddress(response?.data?.results[0]?.formatted_address);
				//setLocation
			})
				.catch(err => {
				});
		}

	}

	useEffect(() => {
		if (location) {
			getAddressFromCoordinates();
		}
	}, [location]);




	const getCurrentLocation = useCallback(async () => {
		if (Platform.OS === 'ios') {
			const status = await Geolocation.requestAuthorization('whenInUse');
			if (status === 'granted') {
				getPosition();
			} else {
				Toast.show({
					type: 'error',
					text1: 'Location permission denied by user.',
				});

				navigation.navigate('AddNewLocation');
			}

		}
		else {
			const hasPermission = await PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

			);

			if ((Platform.OS === 'android' && Platform.Version < 23) || hasPermission) {
				getPosition();
			} else {
				const status = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

				);

				if (status === PermissionsAndroid.RESULTS.GRANTED) {
					getPosition();


				} else if (status === PermissionsAndroid.RESULTS.DENIED || status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {


					navigation.navigate('AddNewLocation');
					Toast.show({
						type: 'error',
						text1: 'Location permission denied by user.',
					});
				}

			}
		}

	}, []);



	const getPosition = async () => {
		await Geolocation.getCurrentPosition(
			position => {

				getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude);
				user.setLocation([position?.coords?.latitude, position.coords?.longitude]);
				setLocation(position?.coords);

			},
			async error => {
				navigation.navigate('AddNewLocation');
				Toast.show({
					type: 'error',
					text1: error.message,
				});
				// checkLogin();
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

	const NavigationToBack = useCallback(() => { navigation.goBack(); }, [navigation]);


	// const ColoseUpdateModal = useCallback(() => {
	// 	setversionUpdate(false);
	// 	navigation.dispatch(CommonActions.reset({
	// 		index: 0,
	// 		routes: [
	// 			{ name: 'green' }
	// 		],
	// 	}))
	// }, [versionUpdate])

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
			<ScrollView style={ { flex: 1, paddingHorizontal: 40 } }>
				<SafeAreaView>
					<CommonTitle goBack={ NavigationToBack } mt={ 40 } />
					<CommonTexts
						label={ 'Enter the 4 - digit code we sent to your registered mobile number' }
						mt={ 40 }
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
