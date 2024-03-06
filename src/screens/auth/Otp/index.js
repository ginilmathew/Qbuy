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
import { NativeModules } from 'react-native';
import CommonUpdateModal from '../../../Components/CommonUpdateModal';
import CartContext from '../../../contexts/Cart';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { MAPS_KEY } from '../../../config/constants';

const { mode } = NativeModules.RNENVConfig;

const Otp = ({ navigation }) => {
	const user = useContext(AuthContext);
	const loadingg = useContext(LoaderContext);

	const { getCartDetails } = useContext(CartContext)

	let loader = loadingg?.loading;
	let mobileNo = user?.login?.mobile;




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

	const [timer, setTimer] = useState(0);
	const [disableResend, setDisableResend] = useState(false);
	const resendTimeout = 5; // 60 seconds timeout before allowing resend

	useEffect(() => {
		let interval;

		if (timer > 0) {
			interval = setInterval(() => {
				setTimer(prevTimer => prevTimer - 1);
			}, 1000);
		} else {
			setDisableResend(false); // Enable the Resend OTP button when timer reaches 0
		}

		return () => clearInterval(interval);
	}, [timer]);



	

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
				await getCartDetails();
				currentPosition()
				// navigation.dispatch(CommonActions.reset({
				// 	index: 0,
				// 	routes: [
				// 		{ name: 'Location' },
				// 	],
				// }));
			})
			.catch(async error => {
				Toast.show({
					type: 'error',
					text1: error,
				});
				
			})
			.finally(() => {
				loadingg.setLoading(false);
			});
	};


	const currentPosition = async() => {
		loadingg.setLoading(true);
		await Geolocation.getCurrentPosition(
			position => {

				getAddressFromCoordinates(position?.coords?.latitude, position.coords?.longitude)

			},
			error => {
				loadingg.setLoading(false);
				navigation.dispatch(CommonActions.reset({
					index: 0,
					routes: [
						{ name: 'Location' },
					],
				}));

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
	}

	async function getAddressFromCoordinates(latitude, longitude) {
        let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${MAPS_KEY}`);

        let Value = {
            location: response?.data?.results[0]?.formatted_address,
            city: response?.data?.results[0]?.address_components?.filter(st =>
                st.types?.includes('locality')
            )[0]?.long_name,
            latitude: latitude,
            longitude: longitude,
        };


        //addressContext.setCurrentAddress(Value);

        let location = {
            latitude: latitude,
            longitude: longitude,
            address: Value?.location
        }


        await AsyncStorage.setItem("location", JSON.stringify(location))
        user.setLocation([latitude, longitude]);
        user.setCurrentAddress(response?.data?.results[0]?.formatted_address)
		loadingg.setLoading(false);
        navigation.dispatch(CommonActions.reset({
			index: 0,
			routes: [
				{ name: 'home' },
			],
		}));

    }

	

	

	const onClickResendOtp = async () => {
		loadingg.setLoading(true);
		await customAxios.post('auth/customerloginotp', { mobile: mobileNo })
			.then(async response => {
				Toast.show({
					type: 'success',
					text1: response?.data?.message,
				});
				setTimer(resendTimeout); // Start the timer for resend timeout
				setDisableResend(true);
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
					<TouchableOpacity onPress={ onClickResendOtp } disabled={disableResend}>
						<CommonTexts
								label={timer ? "Try Again in " + timer : "Resend OTP"}
							mt={ 10 }
							textAlign="right"
							color={disableResend ? "#C8C8C8" : "#5871D3"}
						/>
					</TouchableOpacity>

					<CustomButton
						onPress={ !loader ? handleSubmit(onSubmit) : null }
						bg={ mode === 'fashion' ? '#FF7190' : '#58D36E' }
						label={ 'Confirm' }
						my={ 20 }
						width={ 100 }
						alignSelf="center"
						//loading={ loader }
					/>
				</SafeAreaView>
			</ScrollView>
			{/* { versionUpdate && <CommonUpdateModal isopen={ versionUpdate } CloseModal={ ColoseUpdateModal } ForceUpdate={ forceUpdate } /> } */}
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
