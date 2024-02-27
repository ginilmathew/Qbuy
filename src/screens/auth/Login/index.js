/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, ToastAndroid, useWindowDimensions, PermissionsAndroid, Platform, Keyboard } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CommonAuthBg from '../CommonAuthBg';
import CommonInput from '../../../Components/CommonInput';
import CommonAuthHeading from '../CommonAuthHeading';
import TermsAndPrivacyText from './TermsAndPrivacyText';
import CustomButton from '../../../Components/CustomButton';
import HelpAndSupportText from './HelpAndSupportText';
import CommonTexts from '../../../Components/CommonTexts';
import FastImage from 'react-native-fast-image';
import AuthContext from '../../../contexts/Auth';
import LoaderContext from '../../../contexts/Loader';
import customAxios from '../../../CustomeAxios';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
import reactotron from 'reactotron-react-native';
import { NativeModules } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressContext from '../../../contexts/Address';
import LoadingModal from '../../../Components/LoadingModal';

const { env, mode } = NativeModules.RNENVConfig;

const Login = ({ navigation }) => {
	const userContext = useContext(AuthContext);
    const addressContext = useContext(AddressContext)

	const { width } = useWindowDimensions();

	useEffect(() => {
		//reactotron.log("in")
		if(Platform.OS === 'android'){
			getPermissions()
		}
		
		//SplashScreen.hide();
	}, []);

	const getPermissions = async() => {
		const status = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]);


		// if(status?.['android.permission.ACCESS_FINE_LOCATION'] === "granted"){
		// 	getPosition()
		// }
	}

	const [location, setLocation] = useState(null);

	const loginUser = useContext(AuthContext);
	const loadingg = useContext(LoaderContext);

	const [data, setData] = useState('');


	let loader = loadingg?.loading;


	const phone = /^(\+\d{1,3}[- ]?)?\d{10}$/;
	const schema = yup.object({
		mobile: yup.string().required('Phone number is required').max(10, 'Phone Number must be 10 digits').min(10, 'Phone Number must be 10 digits').matches(phone, 'Not a valid number'),
	}).required();

	const { control, handleSubmit, formState: { errors }, setValue } = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = useCallback(async (data) => {
		Keyboard.dismiss()
		// navigation.navigate('Otp')

		loginUser.setLogin(data);
		loadingg.setLoading(true);
		await customAxios.post('auth/customerloginotp', data)
			.then(async response => {
				setData(response?.data?.data);
				loadingg.setLoading(false);
				navigation.navigate('Otp');
			})
			.catch(async error => {
				Toast.show({
					type: 'error',
					text1: error,
				});
				loadingg.setLoading(false);
			});
	}, []);

	const imageURl = {
		panda: require('../../../Images/pandaLogo.png'),
		green: require('../../../Images/loginLogo.png'),
		fashion: require('../../../Images/FashionloginLogo.png'),
	};

	async function getAddressFromCoordinates(latitude, longitude) {
        let response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=AIzaSyBBcghyB0FvhqML5Vjmg3uTwASFdkV8wZY`);



            let Value = {
                location: response?.data?.results[0]?.formatted_address,
                city: response?.data?.results[0]?.address_components?.filter(st =>
                    st.types?.includes('locality')
                )[0]?.long_name,
                latitude: latitude,
                longitude: longitude,
            };


            addressContext.setCurrentAddress(Value);

            let location = {
                latitude: latitude,
                longitude: longitude,
                address: Value?.location
            }


            AsyncStorage.setItem("location", JSON.stringify(location))
            userContext.setLocation([latitude, longitude]);
            userContext.setCurrentAddress(Value?.location)
			loadingg.setLoading(false);
			navigation.navigate('home')
            //navigation.navigate('LocationScreen', { mode: 'home' });

    }

	




	



	

	const NaviagteToGuest = useCallback(async() => {
		loadingg.setLoading(true);
		await Geolocation.getCurrentPosition(
			position => {

				getAddressFromCoordinates(position?.coords?.latitude, position?.coords?.longitude);
			},
			error => {
				loadingg.setLoading(false);
				navigation.navigate('Location')

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


	}, [navigation]);

	return (
		<CommonAuthBg>
			<ScrollView style={ { flex: 1, paddingHorizontal: 20 } } keyboardShouldPersistTaps="always">
				<FastImage
					style={ styles.logo }
					source={ imageURl[mode] }
					resizeMode="contain"
				/>
				<CommonAuthHeading
					label={ 'Welcome' }
					mt={ 20 }
				/>
				<CommonTexts
					label={ 'Sign in with your mobile for an OTP' }
					mt={ 2 }
					fullLabel={true}
				/>
				<CommonInput
					leftElement
					control={ control }
					error={ errors.mobile }
					fieldName="mobile"
					placeholder="Mobile Number"
					inputMode={ 'numeric' }
					mt={ 40 }
					backgroundColor="#fff"
					shadowOpacity={ 0.1 }
					elevation={ 2 }
				/>
				<TermsAndPrivacyText />

				<View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
					<CustomButton
						width={ width / 2.5 }
						onPress={ handleSubmit(onSubmit) }
						bg={ mode === 'fashion' ? '#FF7190' : '#58D36E' }
						label={ 'Sign In' }
						mt={ 20 }
						//loading={ loader }
					/>
					<CustomButton
						width={ width / 2.5 }
						onPress={ NaviagteToGuest }
						bg={ 'blue' }
						label={ 'Guest' }
						mt={ 20 }

					/>

				</View>


				<Text style={ styles.textStyle }>{ 'Need Support to Login?' }</Text>
				<HelpAndSupportText />

			</ScrollView>
			<LoadingModal isVisible={loader} />
		</CommonAuthBg>
	);
};

export default Login;

const styles = StyleSheet.create({

	logo: {
		width: 130,
		height: 130,
		marginTop: 100,
		alignSelf: 'center',
	},
	textStyle: {
		fontFamily: 'Poppins-Light',
		color: '#8D8D8D',
		fontSize: 11,
		textAlign: 'center',
		marginTop: 70,
	},

});
