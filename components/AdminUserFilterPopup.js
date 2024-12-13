import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../res/Constants'
import { Colors } from '../res/Colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AddressPicker from './AddressPicker';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';


const AdminFilterPopup = ({ close }) => {

    const date = new Date()


    const [showAddressPicker, setShowAddressPicker] = useState(false)
    const [reviewCount, setreviewCount] = useState([100, 1000]);
    const [yapScore, setYapScore] = useState([1, 1000]);
    const [showCalender, setShowCalender] = useState(false)
    const [selectedFromDate, setSelcetedFromDate] = useState("")
    const [selectedToDate, setSelcetedToDate] = useState("")
    const [selectedCalender, setSelectedCalender] = useState("")
    const [error,setError] = useState("")

    const [city, setCity] = useState("")
    const [state, setState] = useState("")

    const handleTransactionChange = (values) => {
        setreviewCount(values);
    };

    const handleYapChange = (values) => {
        setYapScore(values);
    };

    const handleApplyPress = () =>{
        let date1 = selectedFromDate
        let date2 = selectedToDate

        if(date1>date2){
            setError("From date must be smaller to the To date")
            return
        }

        const filters = {
            city:city,
            state:state,
            fromDate:selectedFromDate,
            toDate:selectedToDate,
            minYapScore:yapScore[0],
            maxYapScore:yapScore[1],
            minReviewCount:reviewCount[0],
            maxReviewCount:reviewCount[1],
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
                            setState(address.shortState)
                            setCity(address.city)
                        }}

                    />
                </Modal>

                <View style={{ flexDirection: 'row', width: screenWidth - 40, alignItems: 'center', justifyContent: 'space-between', marginTop: 30 / 930 * screenHeight }}>
                    <View style={{ flexDirection: "column", alignItems: 'flex-start', gap: 10 }}>
                        <Text style={GlobalStyles.text12}>
                            From
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShowCalender(true)
                                setError("")
                                setSelectedCalender("from")
                            }}
                        >
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 173 / 430 * screenWidth,
                                height: 54, padding: 15 / 430 * screenWidth, backgroundColor: Colors.lightGray
                            }}>
                                <Text style={GlobalStyles.text12}>
                                    {selectedFromDate ? selectedFromDate : "Start Date"}
                                </Text>
                                <Image source={require('../assets/Images/calenderIcon.png')}
                                    style={GlobalStyles.image24}
                                />
                            </View>

                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "column", alignItems: 'flex-start', gap: 10 }}>
                        <Text style={GlobalStyles.text12}>
                            To
                        </Text>
                        <TouchableOpacity
                            onPress={()=>{
                                setShowCalender(true)
                                setError("")
                                setSelectedCalender("to")
                            }}
                        >
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 173 / 430 * screenWidth,
                                height: 54, padding: 15 / 430 * screenWidth, backgroundColor: Colors.lightGray
                            }}>
                                <Text style={GlobalStyles.text12}>
                                    {selectedToDate ? selectedToDate : "End Date"}
                                </Text>
                                <Image source={require('../assets/Images/calenderIcon.png')}
                                    style={GlobalStyles.image24}
                                />
                            </View>

                        </TouchableOpacity>
                    </View>
                </View>

                {
                    error && <Text style = {GlobalStyles.errorText}>{error}</Text>
                }

                <DatePicker
                    modal
                    open={showCalender}
                    maximumDate={date}
                    date={date}
                    mode='date'
                    onConfirm={(date) => {
                        setShowCalender(false)
                        console.log('date is', date)
                        let d = moment(date).format("MM/DD/YYYY")
                        if (selectedCalender === "from") {
                            setSelcetedFromDate(d)
                        } else if (selectedCalender === "to") {
                            setSelcetedToDate(d)
                        }
                    }}
                    onCancel={() => {
                        setShowcalender(false)
                    }}
                />



                <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>Yap Score</Text>

                <View style={styles.sliderBackground}>
                    <MultiSlider
                        values={[yapScore[0], yapScore[1]]}
                        min={1}
                        max={999}
                        // step={999}
                        selectedStyle={{ backgroundColor: '#FF5700' }}
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

                <Text style={[GlobalStyles.text14, { marginTop: 32 / 930 * screenHeight }]}>Reviews Count</Text>

                <View style={styles.sliderBackground}>
                    <MultiSlider
                        values={[reviewCount[0], reviewCount[1]]}
                        min={100}
                        max={1000}
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
                    <Text style={styles.valueText}>{`<${reviewCount[0]}`}</Text>
                    <Text style={styles.valueText}>{`<${reviewCount[1]}`}</Text>
                </View>


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

export default AdminFilterPopup

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
