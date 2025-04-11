import React, { useState, useRef } from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { screenHeight, screenWidth } from '../../res/Constants';
import { GlobalStyles } from '../../assets/styles/GlobalStyles';
import { Colors } from '../../res/Colors';
import { CustomFonts } from '../../assets/font/Fonts';
import { ScreenNames } from '../../res/ScreenNames';

const LicenseScreen = ({ navigation, route }) => {
    const [imageUri, setImageUri] = useState(null);
    const [scannedText, setScannedText] = useState('');
    const [licenseDetails, setLicenseDetails] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false); // Control camera view

    const cameraRef = useRef(null); // Reference for camera

    const user = route.params.user;
    user.licenseDetails = licenseDetails;
    user.licenseImage = imageUri;

    // console.log('user on license screen is', user);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const options = { quality: 0.5, base64: true };
                const data = await cameraRef.current.takePictureAsync(options);
                setImageUri(data.uri);
                extractText(data.uri);
                setIsCameraActive(false); // Hide camera after taking picture
            } catch (error) {
                console.error(error);
            }
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Please allow camera access to complete profile');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.5,
        });

        if (!result.canceled) {
            const ImageUrl = result.assets[0].uri;
            setIsCameraActive(false)
            setImageUri(ImageUrl);
            extractText(ImageUrl);
        }
    };

    const extractText = async (uri) => {
        try {
            const recognizedText = await TextRecognition.recognize(uri);
            const text = recognizedText.join(' ');
            console.log('extracted text is', text)

            const validDetails = validateLicenseDetails(text);
            setLicenseDetails(validDetails);
            setScannedText(text);
        } catch (error) {
            console.error('Failed to extract text', error);
            Alert.alert('Error', 'Failed to extract text from the image');
        }
    };
    const validateLicenseDetails = (text) => {
        // First extract a candidate using your OCR techniques.
        // For instance, assume you extract the substring after "DL" up to "DOB":
        const dlRegexExtraction = /DL\s+([\w\s\-]+?)(?=\s+DOB)/i;
        const dlMatch = text.match(dlRegexExtraction);
        const candidateDL = dlMatch ? dlMatch[1].trim() : '';
      
        // Choose which validation to use (composite or generic)
        const isValid = isValidDriverLicenseComposite(candidateDL);
        // Alternatively: const isValid = isValidDriverLicenseGeneric(candidateDL);
      
        // For demonstration, we’ll return the candidate and whether it’s valid:
        return {
          driverLicense: isValid ? candidateDL : 'Invalid DL format',
          // You can add extraction for the name and other details here as well
        };
      };
      
      const isValidDriverLicenseComposite = (licenseNumber) => {
        const normalized = licenseNumber.replace(/[\s\-]/g, '');
        const dlRegexComposite = /^(?:[A-Za-z]\d{7}|\d{9}|\d{8}|[A-Za-z]\d{12})$/;
        return dlRegexComposite.test(normalized);
      };
      
      const isValidDriverLicenseGeneric = (licenseNumber) => {
        const normalized = licenseNumber.trim();
        const dlRegexGeneric = /^(?=[A-Za-z0-9\- ]{5,16}$)(?=.*\d)[A-Za-z0-9\- ]+$/;
        return dlRegexGeneric.test(normalized);
      };
      
      
    const handleContinuePress = () => {
        if (user.role === 'business') {
            navigation.push(ScreenNames.LicenseDetailsScreen, {
                user: {
                    user: user,
                    from: 'AddCustomer'
                }
            });
        } else {
            navigation.push(ScreenNames.LicenseDetailsScreen, {
                user: {
                    user: user,
                    from: 'RegisterCustomer'
                }
            });
        }
    };

    return (
        isCameraActive ? (
            <View style={styles.cameraContainer}>
                <RNCamera
                    ref={cameraRef}
                    style={styles.camera}
                    captureAudio={false}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                >
                    {/* Scan Box Overlay */}
                    <View style={styles.overlay}>
                        <View style={styles.topLeftCorner} />
                        <View style={styles.topRightCorner} />
                        <View style={styles.bottomLeftCorner} />
                        <View style={styles.bottomRightCorner} />
                    </View>

                    <View style={styles.bottomControls}>
                        <View style={styles.actionButtonsContainer}>

                            <TouchableOpacity style={[styles.actionButtons, { opacity: 0 }]} //onPress={takePicture}
                            >
                                <Text style={styles.actionText}>SCAN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                <Image source={require('../../assets/Images/captureBtn.png')}
                                    style={{ height: 76 / 930 * screenHeight, width: 76 / 930 * screenHeight }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButtons} onPress={pickImage}
                            >
                                <Text style={styles.actionText}>UPLOAD</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </RNCamera>
            </View>
        ) : (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.container}>
                    <View style={GlobalStyles.completeProfileTopBar}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/Images/backArrow.png')} style={GlobalStyles.image24} />
                        </TouchableOpacity>

                        <Text style={GlobalStyles.text14}>
                            {user.role === 'customer' ? 'Verify  Identity' : 'New Customer'}
                        </Text>
                        <View></View>
                    </View>

                    <View style={{ flexDirection: 'column', alignItems: 'center', width: screenWidth - 40 }}>
                        <Text style={[GlobalStyles.heading24, { marginTop: 50 / 930 * screenHeight }]}>
                            Driving License
                        </Text>

                        <View style={styles.uploadContainer}>
                            <TouchableOpacity onPress={pickImage}>
                                {imageUri ? (
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.licenseImage}
                                    />
                                ) : (
                                    <View style={styles.uploadPlaceholder}>
                                        <Image source={require('../../assets/Images/uploadBtn.png')} style={styles.uploadIcon} />
                                        <Text style={[GlobalStyles.text14, { color: Colors.lightBlack }]}>
                                            Upload License
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            {imageUri && (
                                <View style={styles.scanOptions}>
                                    <Text style={GlobalStyles.text17}>Does this look ok?</Text>
                                    <TouchableOpacity onPress={() => setIsCameraActive(true)}>
                                        <Text style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>RE-SCAN</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={pickImage}>
                                        <Text style={GlobalStyles.text17}>UPLOAD INSTEAD</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {!imageUri && (
                            <TouchableOpacity onPress={() => setIsCameraActive(true)} style={{ alignSelf: 'center', marginTop: 8 }}>
                                <Text style={[GlobalStyles.text17, { color: Colors.orangeColor }]}>SCAN</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={GlobalStyles.capsuleBtn} onPress={handleContinuePress}>
                            <Text style={GlobalStyles.BtnText}>Continue</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        )
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: screenWidth,
        height: screenHeight,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topLeftCorner: {
        position: 'absolute',
        top: screenHeight * 0.2,
        left: screenWidth * 0.1,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        width: 40,
        height: 40,
        borderColor: 'white',
    },
    topRightCorner: {
        position: 'absolute',
        top: screenHeight * 0.2,
        right: screenWidth * 0.1,
        borderTopWidth: 3,
        borderRightWidth: 3,
        width: 40,
        height: 40,
        borderColor: 'white',
    },
    bottomLeftCorner: {
        position: 'absolute',
        bottom: screenHeight * 0.3,
        left: screenWidth * 0.1,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        width: 40,
        height: 40,
        borderColor: 'white',
    },
    bottomRightCorner: {
        position: 'absolute',
        bottom: screenHeight * 0.3,
        right: screenWidth * 0.1,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        width: 40,
        height: 40,
        borderColor: 'white',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        paddingTop: 30 / 930 * screenHeight,
        paddingBottom: 30 / 930 * screenHeight
    },
    captureButton: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    innerCaptureButton: {
        backgroundColor: 'red',
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
    },
    actionButtons: {
        backgroundColor: "#00000020",
        padding: 20,
        borderRadius: 40
    },

    actionText: {
        color: 'black',
        fontSize: 18,
    },
    uploadContainer: {
        width: screenWidth - 40,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#050A0820',
        borderStyle: 'dashed',
        marginTop: 32 / 930 * screenHeight,
    },
    licenseImage: {
        height: 202 / 930 * screenHeight,
        width: screenWidth - 40,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    uploadPlaceholder: {
        backgroundColor: '#050A0810',
        height: 195 / 930 * screenHeight,
        width: screenWidth - 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    uploadIcon: {
        height: 59 / 930 * screenHeight,
        width: 59 / 430 * screenWidth,
        resizeMode: 'contain',
    },
    scanOptions: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15 / 930 * screenHeight,
    },
});

export default LicenseScreen;
