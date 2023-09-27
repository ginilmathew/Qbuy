import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useContext, useState } from 'react'
import CommonCounter from './CommonCounter'
import CommonSelectDropdown from './CommonSelectDropdown'
import PandaContext from '../contexts/Panda'

const ItemAddedFromSuggtnCard = memo(({item}) => {


    const contextPanda = useContext(PandaContext)
    let fashion = contextPanda.pinkPanda

    const [count, setCount] = useState(1)

    const [valueColor, setValueColor] = useState(null);
    const [valueSize, setValueSize] = useState(null);

    const color = [
        { label: 'Red', value: '1' },
        { label: 'Blue', value: '2' },
        { label: 'Green', value: '3' },
    ];
    const size = [
        { label: 'M', value: '1' },
        { label: 'L', value: '2' },
        { label: 'XL', value: '3' },
    ];




    const addItem = () => {
        setCount(count + 1)
    }

    const removeItem = () => {
        if (count !== 1) {
            setCount(count - 1)
        }
    }

    return (
        <View style={{borderColor: '#0D4E810D', borderBottomWidth: 1, paddingBottom:10}}>

            <View style={styles.itemContainer}>
                <Text style={styles.itemNameText} >{item?.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.itemRateText}>₹ {item?.price * count}</Text>
                    <CommonCounter
                        count={count}
                        addItem={addItem}
                        removeItem={removeItem}
                    />
                </View>
            </View>
            {/* {fashion&&<View style={{flexDirection:'row', justifyContent:'space-between' }}>
                <CommonSelectDropdown
                    placeholder='Color'
                    data={color}
                    value={valueColor}
                    setValue={setValueColor}
                    height={35}
                    width={'45%'}
                />
                <CommonSelectDropdown
                    placeholder='Size'
                    data={size}
                    value={valueSize}
                    setValue={setValueSize}
                    height={35}
                    width={'45%'}
                />
            </View>} */}

        </View>
        
    )
})

export default ItemAddedFromSuggtnCard

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    itemNameText: {
        fontFamily: 'Poppins-Medium',
        color: '#23233C',
        fontSize: 12,

    },
    itemRateText: {
        fontFamily: 'Poppins-ExtraBold',
        color: '#089321',
        fontSize: 18,
    },
})