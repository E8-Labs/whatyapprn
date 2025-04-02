import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../res/Constants'
import { Colors } from '../res/Colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AddressPicker from './AddressPicker';


const FilterPoopup = ({ role, close }) => {

    // console.log('role', role)

    const [showAddressPicker, setShowAddressPicker] = useState(false)
    const [minTransaction, setMinTransaction] = useState(500);       // Lower range value
    const [maxTransaction, setMaxTransaction] = useState(50000);
    const [transactionValue, setTransactionValue] = useState([500, 50000]);
    const [yapScore, setYapScore] = useState([1, 999]);

    const [selectedIndustry, setSelectedIndustry] = useState("")

    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    const industries = [
        {
            id: 1,
            name: 'Finance'
        },
        {
            id: 2,
            name: 'Management'
        },
        {
            id: 3,
            name: 'Information & Technology'
        },
        {
            id: 4,
            name: 'Service'
        },
        {
            id: 5,
            name: 'Sales'
        },

    ]

    const handleTransactionChange = (values) => {
        setTransactionValue(values);
    };

    const handleYapChange = (values) => {
        setYapScore(values);
    };

    const handleIndustrySelect = (item) => {
        setSelectedIndustry((prevSelected) => {
            if (prevSelected.includes(item.name)) {
                // Remove industry if already selected
                return prevSelected.filter((industry) => industry !== item.name);
            } else {
                // Add industry if not selected
                return [...prevSelected, item.name];
            }
        });
    };
    const handleApplyPress = () => {
        const filters = {
            city,
            state,
            minYapScore: yapScore[0],
            maxYapScore: yapScore[1],
        };

        if (role === 'business') {
            filters.minTransaction = transactionValue[0];
            filters.maxTransaction = transactionValue[1];
        } else {
            filters.industry = selectedIndustry.join(",");
        }

        console.log('filters', filters)
        close(filters)
    }
    return (
        <View style={[GlobalStyles.container, { backgroundColor: '#00000055', justifyContent: 'flex-end' }]}>
            <View style={{
                width: screenWidth, backgroundColor: '#ffffff', padding: 30
            }}>
                <View style={{ width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[GlobalStyles.text17, { alignSelf: 'center' }]}>
                        Filter
                    </Text>
                    <TouchableOpacity
                        onPress={close}
                    >
                        <Image source={require('../assets/Images/crossIcon.png')}
                            style={GlobalStyles.image24}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        setShowAddressPicker(true)
                    }}
                >
                    <View style={[GlobalStyles.input, {
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight
                    }]}>
                        <Text style={GlobalStyles.text14}>
                            {city ? (city) : 'City, State'} {state ? `,${state}` : ""}
                        </Text>
                        <Image source={require('../assets/Images/locationIcon.png')}
                            style={GlobalStyles.image24}
                        />
                    </View>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={showAddressPicker}
                    animationType='slide'
                >
                    <AddressPicker closeModal={() => {
                        setShowAddressPicker(false)

                    }}
                        PickAddress={(address) => {
                            console.log('picked address is', address)
                            setState(address.longState)
                            setCity(address.city)
                        }}

                    />
                </Modal>

                <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>Number of reviews</Text>

                <View style={styles.sliderBackground}>
                    <MultiSlider
                        values={[yapScore[0], yapScore[1]]}
                        min={1}
                        max={999}
                        // step={999}
                        selectedStyle={{ backgroundColor: '#FF5700' }}  // In-range track color (orange)
                        unselectedStyle={{ backgroundColor: '#FF570050' }} // Make outer transparent, handled by background
                        trackStyle={styles.trackStyle}                  // Adjust track height
                        markerStyle={styles.markerStyle}                // Customize knob (thumb) size and color
                        onValuesChange={handleYapChange}
                        containerStyle={styles.sliderContainer}         // Adjusting slider container
                    />
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>{yapScore[0]}</Text>
                    <Text style={styles.valueText}>{yapScore[1]}</Text>
                </View>

                {
                    role !== "customer" ? (

                        <>
                            <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>Transaction Range</Text>

                            <View style={styles.sliderBackground}>
                                <MultiSlider
                                    values={[transactionValue[0], transactionValue[1]]}
                                    min={500}
                                    max={50000}
                                    // step={400}
                                    selectedStyle={{ backgroundColor: '#FF5700' }}  // In-range track color (orange)
                                    unselectedStyle={{ backgroundColor: '#FF570030' }} // Make outer transparent, handled by background
                                    trackStyle={styles.trackStyle}                  // Adjust track height
                                    markerStyle={styles.markerStyle}                // Customize knob (thumb) size and color
                                    onValuesChange={handleTransactionChange}
                                    containerStyle={styles.sliderContainer}         // Adjusting slider container
                                />
                            </View>
                            <View style={styles.valueContainer}>
                                <Text style={styles.valueText}>${transactionValue[0]}</Text>
                                <Text style={styles.valueText}>${transactionValue[1]}</Text>
                            </View>

                        </>
                    ) : (
                        <>
                            <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>
                                Business Industry
                            </Text>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', gap: 15, width: screenWidth - 40, flexWrap: 'wrap',
                                marginTop: 32 / 930 * screenHeight
                            }}>
                                {
                                    industries.map((item) => (
                                        <TouchableOpacity key={item.id} style={{
                                            padding: 15, borderRadius: 50,
                                            backgroundColor: selectedIndustry.includes(item.name) ? Colors.orangeColor : "transparent",
                                            borderWidth: 1, borderColor: Colors.grayColor
                                        }}
                                            onPress={() => { handleIndustrySelect(item) }}
                                        >
                                            <Text style={[GlobalStyles.text17, { color: selectedIndustry.includes(item.name) ? "white" : "black" }]}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </>
                    )
                }

                <TouchableOpacity style={[GlobalStyles.capsuleBtn, { alignSelf: 'center' }]}
                    onPress={handleApplyPress}
                >
                    <Text style={GlobalStyles.BtnText}>
                        Apply Filter
                    </Text>
                </TouchableOpacity>


            </View>
        </View>
    )
}

export default FilterPoopup

const styles = StyleSheet.create({
    container: {
        width: screenWidth - 40, // Width of the slider
        marginVertical: 20,
    },
    label: {

    },
    sliderBackground: {
        backgroundColor: '#FF570010',               // Light background color similar to your image
        borderRadius: 20,                         // Makes the outer background rounded
        paddingVertical: 0,                               // Add padding so that the track is properly inside
        width: 310 / 430 * screenWidth,
        marginTop: 15 / 930 * screenHeight,
        alignSelf: 'center'
    },
    sliderContainer: {
        height: 30,                               // Ensures enough space for the track and markers
        justifyContent: 'center',                 // Vertically centers the slider track and markers
        alignItems: 'center'
    },
    trackStyle: {
        height: 18,                                // Set the height of the track
        borderRadius: 20,                          // Make the track edges rounded

    },
    markerStyle: {
        height: 24,                               // Marker (thumb) height
        width: 24,                                // Marker (thumb) width
        borderRadius: 12,                         // Make the marker circular
        backgroundColor: '#ffffff',               // Light off-white color for the marker
        marginTop: 13 / 930 * screenHeight
    },
    valueContainer: {
        width: 330 / 430 * screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10 / 930 * screenHeight,
        alignSelf: 'center'
    },
    valueText: {
        fontSize: 16,
        fontWeight: 'meduim',
    },
});

