import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { screenWidth } from './res/Constants';

export default function Testfile2() {
  const [imageUri, setImageUri] = useState(null);
  const [scannedText, setScannedText] = useState('');
  const [licenseDetails, setLicenseDetails] = useState(null); // Store license details as an object
  const [isValidLicense, setIsValidLicense] = useState(false);

  const takePicture = async (camera) => {
    try {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setImageUri(data.uri);
      extractText(data.uri);
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Please allow camera access to complete profile');
      return;
    }
    console.log('trying to open gallery');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const ImageUrl = result.assets[0].uri;
      console.log('Image url received is', ImageUrl);
      setImageUri(ImageUrl);
      extractText(ImageUrl);
      console.log(result.assets[0].uri);
    }
  };

  const extractText = async (uri) => {
    try {
      const recognizedText = await TextRecognition.recognize(uri);
      const text = recognizedText.join(' ');
      const validDetails = validateLicenseDetails(text);
      setLicenseDetails(validDetails);
      setScannedText(text);
    } catch (error) {
      console.error('Failed to extract text', error);
      Alert.alert('Error', 'Failed to extract text from the image');
    }
  };

  const validateLicenseDetails = (text) => {
    // Regex Patterns
    const nameRegex = /(?:Name|NOM|NAME):?\s*([A-Z\s]+)/i; // Matches "Name: John Doe" or "NOM: John Doe"
    const dobRegex = /(?:DOB|Date of Birth|Birth Date):?\s*(\d{2}[/-]\d{2}[/-]\d{4})/i; // Matches "DOB: 01/01/1990"
    const usDlRegex = /(?:DL|ID|License|LIC|No|Number):?\s*([A-Z\d]{1,9})/i; // US DL pattern (varies by state)
    const canadaDlRegex = /(?:Licence No|Numéro de permis|Permis):?\s*([A-Z\d\s\-]+)/i; // Canada DL pattern

    // Matching Patterns
    const nameMatch = text.match(nameRegex);
    const dobMatch = text.match(dobRegex);
    const usDlMatch = text.match(usDlRegex);
    const canadaDlMatch = text.match(canadaDlRegex);

    return {
      name: nameMatch ? nameMatch[1].trim() : 'Name not found',
      dateOfBirth: dobMatch ? dobMatch[1].trim() : 'DOB not found',
      driverLicense: usDlMatch ? usDlMatch[1].trim() : (canadaDlMatch ? canadaDlMatch[1].trim() : 'DL not found'),
    };
  };

  return (
    <View style={styles.container}>
      {/* Render image or camera */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.placeholderText}>No image selected</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setImageUri(null)}>
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Render extracted text or license details */}
      {scannedText && (
        <View style={styles.textContainer}>
          {/* Render license details */}
          {licenseDetails && (
            <View>
              <Text style={styles.textResult}>Name: {licenseDetails.name}</Text>
              <Text style={styles.textResult}>Date of Birth: {licenseDetails.dateOfBirth}</Text>
              <Text style={styles.textResult}>Driver License: {licenseDetails.driverLicense}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  captureContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6347',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    width: screenWidth - 40,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreview: {
    width: '90%',
    height: 300,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  textContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  textResult: {
    fontSize: 16,
    color: '#333',
  },
});
