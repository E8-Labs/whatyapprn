import * as React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { screenHeight,screenWidth } from '../res/Constants';
import { GlobalStyles } from '../assets/styles/GlobalStyles';

const GOOGLE_PLACES_API_KEY = 'AIzaSyAvhNXgMGSYcFIHLkRmZkDta_U7yWdgQQI'; // never save your real api key in a snack!
const AddressPicker = ({ closeModal, PickAddress, }) => {

    let useinputRef = useRef(null);

    const [CityName, setCityName] = useState('');
    const [StateName, setStateName] = useState('');
    const [stateName2, setStateName2] = useState('');
    const [Latitude, setLatitude] = useState('');
    const [Longitude, setLongitude] = useState('');
    const [Route, setRoute] = useState('');
    const [countryName, setCountryName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [streetNumber, setStreetNumber] = useState('');

    useEffect(() => {
        if (useinputRef.current) {
            useinputRef.current.focus();
        }
    }, []);

    const handlePlaceSelect = async (data, details) => {
        try {
            const placeDetailsResponse = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${details.place_id}&fields=geometry,address_components&key=${GOOGLE_PLACES_API_KEY}`
            );
            const placeDetails = await placeDetailsResponse.json();

            const geometry = placeDetails.result.geometry;
            const addressComponents = placeDetails.result.address_components;
            console.log('Place details are :', JSON.stringify(addressComponents));
            // Extract latitude and longitude
            const lat = geometry.location.lat;
            const lon = geometry.location.lng;
            setLatitude(lat);
            setLongitude(lon);

            let city = '';
            let state = '';
            let country = '';
            let Addresspostal_Code = '';
            let addressRoute = '';
            let street = '';
            let state2 = '';

            // Find city and state in address components
            addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                    console.log('city from component name is :', city);
                    setCityName(city);
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                    console.log('State from component :', state);
                    setStateName(state);
                }
                if (component.types.includes('administrative_area_level_2')) {
                    state2 = component.long_name;
                    console.log('State2 from component :', state2);
                    setStateName2(state2);
                }
                if (component.types.includes('country')) {
                    country = component.long_name;
                    console.log('Country name from components is :', country);
                    setCountryName(country);
                }
                if (component.types.includes('postal_code')) {
                    Addresspostal_Code = component.long_name;
                    console.log('Postal code from component is :', Addresspostal_Code);
                    setPostalCode(Addresspostal_Code);
                }
                if (component.types.includes('street_number')) {
                    street = component.long_name;
                    console.log('Street number from component is :', street);
                    setStreetNumber(street);
                }
                if (component.types.includes('route')) {
                    addressRoute = component.long_name;
                    console.log('Route from component is :', addressRoute);

                }
            });

            let address = {
                lat: lat,
                lang: lon,
                city: city,
                shortState: state,
                streetNo: street,
                postalCodeNo: Addresspostal_Code,
                country: country,
                route: addressRoute,
                longState: state2
            }
            console.log('Address sending back screen is :', address);
            // console.warn('Values are selected');
            PickAddress(address)
            closeModal()
            // navigation.pop()
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ alignSelf: 'flex-start', marginBottom: 20 / 430 * screenHeight, marginTop: 20 / 930 * screenHeight }}
                onPress={() => {
                    closeModal()
                }}
            >
                <Image source={require('../assets/Images/backArrow.png')}
                    style={GlobalStyles.image24}
                />
            </TouchableOpacity>
            <GooglePlacesAutocomplete
                ref={useinputRef}
                placeholder="Search"
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en', // language of the results
                }}
                fetchDetails = {true}
                onPress={handlePlaceSelect}
                onFail={(error) => console.error(error)}
                enablePoweredByContainer={false}

            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: Constants.statusBarHeight + 10,
        backgroundColor: '#ecf0f1',
    },
});

export default AddressPicker;
