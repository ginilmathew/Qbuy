import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import HeaderWithTitle from '../../Components/HeaderWithTitle'
import Lottie from 'lottie-react-native';
import CommonTexts from '../../Components/CommonTexts';
import CustomButton from '../../Components/CustomButton';
import CartItemCard from '../Cart/CartItemCard';
import PandaContext from '../../contexts/Panda';
import CartContext from '../../contexts/Cart';
import CartCard from './CartCard';


const index = () => {
    const contextPanda = useContext(PandaContext)
    const cartContext = useContext(CartContext)

    let active = contextPanda.active


    return (
        <View style={ { height: height - 50, paddingBottom: 50, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' } } >
            <HeaderWithTitle title={ 'Cart' } />

            <ScrollView
                style={ { flex: 1, backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff' } }>
                { cartContext?.products?.length <= 0 ? <View
                    style={ { backgroundColor: active === 'green' ? '#F4FFE9' : active === 'fashion' ? '#FFF5F7' : '#fff', borderBottomWidth: 2, borderColor: '#0C256C21', } }
                >
                    <View style={ { height: active === 'green' ? 250 : 170 } }>
                        <Lottie
                            source={ active === 'green' ? require('../../Lottie/emptyGrocery.json') : active === 'fashion' ? require('../../Lottie/shirtss.json') : require('../../Lottie/empty.json') }
                            autoPlay
                        />
                    </View>
                    <CommonTexts
                        label={ 'Oh! Your cart is currently empty!' }
                        color='#A9A9A9'
                        textAlign={ 'center' }
                        mt={ active === 'green' ? -70 : 10 }
                    />
                    <CustomButton
                        onPress={ goHome }
                        bg={ active === 'green' ? '#FF9C0C' : '#5871D3' }
                        label='Add Products'
                        width={ 150 }
                        alignSelf='center'
                        mt={ 20 }
                        mb={ 20 }
                    />
                </View> :
                    <>
                        { cartContext?.products?.map((item, index) => <CartCard item={ item } key={ index } index={ index } refreshCart={ refreshCart } />) }
                    </> }


                { cartItemsList?.length > 0 &&
                    <CustomButton
                        onPress={ gotoCheckout }
                        label={ 'Proceed To Checkout' }
                        bg={ active === 'green' ? '#8ED053' : active === 'fashion' ? '#FF7190' : '#58D36E' }
                        mt={ 20 }
                        mx={ 10 }
                    /> }
                {/* <CommonTexts label={'Panda Suggestions'} fontSize={13} ml={15} mb={5} mt={15} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ flexDirection: 'row', paddingLeft: 7, }}
                >
                    {pandaSuggestion?.map((item) =>
                        <CommonItemCard
                            key={item?._id}
                            item={item}
                            width={width / 2.5}
                            marginHorizontal={5}
                        />
                    )}
                </ScrollView> */}
                {/* <CommonTexts label={'Trending Sales'} fontSize={13} ml={ 15} mb={5} mt={15}/>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', paddingLeft: 7,  }}
            >
                {trend.map((item) =>
                    <CommonItemCard
                        key={item?._id}
                        item={item}
                        width={ width/2.5 }
                        marginHorizontal={5}
                    />
                )}
            </ScrollView> */}
            </ScrollView>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})