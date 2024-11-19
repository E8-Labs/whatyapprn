import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../res/Constants'
import { Colors } from '../res/Colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AddressPicker from './AddressPicker';
import { CustomFonts } from '../assets/font/Fonts';
import { ReviewTypes } from '../res/ReviewsTypes'

const AdminResolutionFilterPopup = ({ close }) => {


    const selectedImage = require('../assets/Images/selectedIcon.png')
    const unselectedImage = require('../assets/Images/unSelectedIcon.png')


    const [showAddressPicker, setShowAddressPicker] = useState(false)
    const [minTransaction, setMinTransaction] = useState(500);       // Lower range value
    const [maxTransaction, setMaxTransaction] = useState(5000);
    const [amount, setamount] = useState([500, 5000]);
    const [yapScore, setYapScore] = useState([1, 1000]);
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [selected, setSelected] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")


    const handleTransactionChange = (values) => {
        setamount(values);
    };

    const handleYapChange = (values) => {
        setYapScore(values);
    };

    const handleApplyPress = () => {
        const filters = {
            disputeStatus: selected === ReviewTypes.disputeStatus ? true : false,
            settlementOffer:selected === ReviewTypes.Settlement ? true : false,
            active:selectedStatus === ReviewTypes.Active ? true : false,
            resolved:selectedStatus === ReviewTypes.Resolved ? true : false,
            minAmount:amount[0],
            maxAmount:amount[1],
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
                        if (selectedStatus === ReviewTypes.Resolved) {
                            setSelectedStatus("")
                        }
                        setSelected(ReviewTypes.Disputed)

                    }}
                >
                    <View style={{
                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                        padding: 20, flexDirection: 'row'
                    }}>
                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                            Dispute
                        </Text>
                        <Image source={selected === ReviewTypes.Disputed ? selectedImage : unselectedImage}
                            style={{
                                height: 30 / 930 * screenHeight,
                                width: 30 / 930 * screenHeight
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setSelected(ReviewTypes.Settlement)
                    }}
                >
                    <View style={{
                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                        padding: 20, flexDirection: 'row'
                    }}>
                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                            Settlement
                        </Text>
                        <Image source={selected === ReviewTypes.Settlement ? selectedImage : unselectedImage}
                            style={{
                                height: 30 / 930 * screenHeight,
                                width: 30 / 930 * screenHeight
                            }}
                        />
                    </View>
                </TouchableOpacity>



                <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>Amount</Text>

                <View style={styles.sliderBackground}>
                    <MultiSlider
                        values={[amount[0], amount[1]]}
                        min={500}
                        max={5000}
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
                    <Text style={styles.valueText}>{`<$${amount[0]}`}</Text>
                    <Text style={styles.valueText}>${amount[1]}</Text>
                </View>

                <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>Status</Text>

                <TouchableOpacity
                    onPress={() => {
                        setSelectedStatus(ReviewTypes.Active)
                    }}
                >
                    <View style={{
                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                        padding: 20, flexDirection: 'row'
                    }}>
                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                            Active
                        </Text>
                        <Image source={selectedStatus === ReviewTypes.Active ? selectedImage : unselectedImage}
                            style={{
                                height: 30 / 930 * screenHeight,
                                width: 30 / 930 * screenHeight
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (selected === ReviewTypes.Disputed) {
                            setSelected("")
                        }
                        setSelectedStatus(ReviewTypes.Resolved)
                    }}
                >
                    <View style={{
                        width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between',
                        padding: 20, flexDirection: 'row'
                    }}>
                        <Text style={{ fontSize: 17, fontFamily: CustomFonts.InterMedium }}>
                            Resolved
                        </Text>
                        <Image source={selectedStatus === ReviewTypes.Resolved ? selectedImage : unselectedImage}
                            style={{
                                height: 30 / 930 * screenHeight,
                                width: 30 / 930 * screenHeight
                            }}
                        />
                    </View>
                </TouchableOpacity>


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

export default AdminResolutionFilterPopup

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

