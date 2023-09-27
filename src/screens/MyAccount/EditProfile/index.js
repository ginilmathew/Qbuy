import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CommonInput from '../../../Components/CommonInput'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// import ChooseAddressType from '../MyAddresses/LocationScreen/AddDeliveryAddress/ChooseAddressType'
// import CommonTexts from '../../../Components/CommonTexts'
// import CommonSwitch from '../../../Components/CommonSwitch'
import AuthContext from '../../../contexts/Auth'
import CustomButton from '../../../Components/CustomButton'
import HeaderWithTitle from '../../../Components/HeaderWithTitle'
import PandaContext from '../../../contexts/Panda'
import { launchImageLibrary } from 'react-native-image-picker';
import CartContext from '../../../contexts/Cart';
import customAxios from '../../../CustomeAxios';
import reactotron from '../../../ReactotronConfig';
import Toast from 'react-native-toast-message'
import { IMG_URL } from '../../../config/constants';
const EditProfile = ({ navigation }) => {

    const contextPanda = useContext(PandaContext)
    let active = contextPanda.active
    const [loading, setLoading] = useState(false)
    const cartContext = useContext(CartContext)


    const user = useContext(AuthContext)

    let userdata = user?.userData


    const [filePath, setFilePath] = useState(null);



    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    const schema = yup.object({
        name: yup.string().max(30, "Name must be less than 30 characters").matches(
            /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
            'Name can only contain alphabets letters.'
        )
            // .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.')
            .required('Name is Required'),
        email: yup.string().email().matches(regexEmail, 'Not a Valid Email Address').typeError('Not a Valid Email Address').required('Email is required'),
        // address: yup.string().required('Address is required'),
        // pincode: yup.string().required('Pincode is required'),
    }).required();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mobile: userdata?.mobile,
            email: userdata?.email ? userdata?.email : '',
            name: userdata?.name ? userdata?.name : '',
            id: userdata?._id
        }
    });



    const onSubmit = useCallback(async (data) => {


        setLoading(true)

        const formData = new FormData();
        if (filePath) {
            formData.append('image', {
                name: filePath?.assets?.[0]?.fileName,
                type: filePath?.assets?.[0]?.type,
                uri: filePath?.assets?.[0]?.uri
            });
        }
        formData.append('name', data?.name);
        formData.append('email', data?.email);
        formData.append('id', data?.id);


        await customAxios.post(`auth/profile-update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(async response => {
                user.setUserData(response?.data?.data)
                Toast.show({
                    type: 'success',
                    text1: 'Profile updated successfully'
                })
                navigation.goBack()
                setLoading(false)
            })
            .catch(async error => {
                Toast.show({
                    type: 'error',
                    text1: error
                })
                setLoading(false)
            });

    }, [filePath])


    const imageGalleryLaunch = useCallback(() => {
        let options = {

            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
        };

        launchImageLibrary(options, (res) => {

            let format = ['image/png', 'image/jpeg','image/jpg']

            let image = res?.assets?.some(obj => format.includes(obj.type))

            if (image) {
                setFilePath(res)
            } else {
                setFilePath(null)
                Toast.show({
                    type: 'info',
                    text1: 'unsupported format'
                })
                return;
            }





            // if (res.didCancel) {
            //     // console.log('User cancelled image picker');
            // } else if (res.error) {
            //     setFilePath(null)
            // } else if (res.customButton) {
            //     // console.log('User tapped custom button: ', res.customButton);
            //     // alert(res.customButton);
            // } else {
            //     setFilePath(res)
            // }
            // reactotron.log({ filePath })
        });
    }, [])

    return (

        <>
            <HeaderWithTitle
                title={'Edit Profile'}
            // onPress={mode === 'header' ?}
            />


            <ScrollView style={{ paddingHorizontal: 30, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', }}>

                <View style={{ alignSelf: 'center' }}>
                    <Image
                        style={styles.image}
                        source={filePath ? { uri: filePath?.assets?.[0]?.uri } : userdata.image ? { uri: `${IMG_URL}${userdata?.image}` } : require('../../../Images/drawerLogo.png')}
                    />
                    <TouchableOpacity
                        onPress={imageGalleryLaunch}
                        style={{ width: 25, height: 25, borderRadius: 15, backgroundColor: active === "green" ? '#8ED053' : active === "fashion" ? '#FF7190' : '#58D36E', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginTop: -25 }}
                    >
                        <MaterialIcons name='photo-camera' size={15} color='#fff' />
                    </TouchableOpacity>
                </View>
                <CommonInput
                    control={control}
                    error={errors.name}
                    fieldName="name"
                    topLabel={'Name'}
                    top={10}
                />
                <CommonInput
                    control={control}
                    error={errors.email}
                    fieldName="email"
                    topLabel={'Email'}
                    top={10}

                />
                <CommonInput
                    control={control}
                    error={errors.mobile}
                    fieldName="mobile"
                    topLabel={'Phone Number'}
                    top={10}
                    editable={false}
                />

                {/* <View style={styles.headerView}>
                        <View style={{ flexDirection: 'row' }}>
                            {datas.map((item, index) =>
                                <ChooseAddressType
                                    item={item}
                                    key={index}
                                    selected={selected}
                                    setSelected={setSelected}
                                    color='#58D36E'
                                />
                            )}
                        </View>
                        <View>
                            <CommonTexts label={'Default'} fontSize={12} />
                            <CommonSwitch isEnabled={isEnabled} toggleSwitch={toggleSwitch} color={'#58D36E'}/>
                        </View>
                    </View>

                    <CommonInput
                        control={control}
                        error={errors.area}
                        fieldName="area"
                        backgroundColor='#fff'
                        topLabel={'Area'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    />

                    <CommonInput
                        control={control}
                        error={errors.address}
                        fieldName="address"
                        backgroundColor='#fff'
                        topLabel={'Address'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    />
                    <CommonInput
                        control={control}
                        error={errors.comments}
                        fieldName="comments"
                        backgroundColor='#fff'
                        topLabel={'Comments'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    />
                    <CommonInput
                        control={control}
                        error={errors.pincode}
                        fieldName="pincode"
                        backgroundColor='#fff'
                        topLabel={'Pincode'}
                        top={10}
                        shadowOpacity={0.1}
                        elevation={2}
                    /> */}

                <CustomButton
                    label={'Submit'}
                    bg={active === 'green' ? '#FF9C0C' : active === 'fashion' ? '#2D8FFF' : '#5871D3'}
                    my={30}
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                />
            </ScrollView>


        </>


    )
}

export default EditProfile

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 20,
        borderRadius: 50
    },
})