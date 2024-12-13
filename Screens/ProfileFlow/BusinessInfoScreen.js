import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  TextInput,
  Keyboard,
  Platform
} from "react-native";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { CustomFonts } from "../../assets/font/Fonts";
import { Colors } from "../../res/Colors";
import React, { useEffect, useState } from "react";
import { placeholderImage } from "../../res/Constants";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import AddressPicker from "../../components/AddressPicker";

import GaleryCamPopup from "../../components/GaleryCamPopup";

import LoadingAnimation from "../../components/LoadingAnimation";

import { screenWidth, screenHeight } from "../../res/Constants";
import { updateProfile } from "../../components/UpdateProfile";
import { ScreenNames } from "../../res/ScreenNames";
import { getProfile } from "../../components/GetProfile";
import { useFocusEffect } from "@react-navigation/native";

const BusinessInfoScreen = ({ navigation, route }) => {
  const [user, setUser] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showpass, setShowpass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showAddressPicker, setShowAddressPicker] = useState(false);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const getUserProfile = async () => {
        setLoading(true);
        let u = await getProfile();
        setLoading(false);
        setUser(u);
      };
      getUserProfile();
    }, [])
  );

  useEffect(() => {
    let u = user;
    const setValues = () => {
      console.log("user profile_image is", u.profile_image);
      setCity(u.city);
      setState(u.state);
      setEmail(u.email);
      setPassword(u.password);
      setName(u.name);
      setImage(u.profile_image);
    };
    setValues();
  }, [user]);


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow Whatyap camera access to complete profile");
      return;
    }
    console.log("trying to open galery");
    // setError(null)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const ImageUrl = result.assets[0].uri;
      console.log("Image url recieved is", ImageUrl);
      setShowPopup(false);
      setImage(ImageUrl);
      console.log(result.assets[0].uri);
    } else {
      // alert('You did not select any image.');
    }
  };

  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow Whatyap camera access to complete profile");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const ImageUrl = result.assets[0].uri;
      // console.log("Base 64 image ", result.assets[0].base64)
      console.log("Image url recieved is", ImageUrl);
      setShowPopup(false);
      setImage(ImageUrl);
      // generateThumbnail(ImageUrl)
      console.log(result.assets[0].uri);
    } else {
      // setPopup(false)
      // alert('You did not select any video.');
    }
  };

  const saveChanges = async () => {
    Keyboard.dismiss()
    let data = new FormData();
    console.log("image", image);
    // return
    data.append("name", name);
    // data.append("media", image);

    data.append("media", {
      name: "image",
      type: "JPEG",
      uri: image,
    });

    data.append("city", city);
    data.append("state", state);
    // data.append("profile_image",image)
    console.log("data", data);
    // return
    setLoading(true);
    let response = await updateProfile(data);
    console.log("response is", response);
    setLoading(false);
    navigation.goBack();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        console.log('keryboard open')
        setIsKeyboardOpen(true)
      }
    );

    const KeyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event) => {
        console.log('keybord hide')
        setIsKeyboardOpen(false)
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      KeyboardDidHideListener.remove();
    };
  }, []);

  const getMediaName = (url) => {
    const lastPart = url ? url.split('/').pop() : '';
    console.log(lastPart);
    return lastPart
}


  return (
    <SafeAreaView style={GlobalStyles.container}>
      {loading && <LoadingAnimation visible={loading} />}
      <View style={GlobalStyles.container}>
        <View style={GlobalStyles.completeProfileTopBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../assets/Images/backArrow.png")}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>

          <Text style={[GlobalStyles.text14, { color: "#00000080" }]}>
            Business Information
          </Text>
          <View></View>
        </View>
        <View style={{ height: isKeyboardOpen ? screenHeight * 0.5 : screenHeight * 0.86 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: screenWidth - 50,
                marginTop: (30 / 930) * screenHeight,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <TouchableOpacity onPress={() => {
                  setShowPopup(true);
                }}>
                  <Image
                    source={image ? { uri: image } : placeholderImage}
                    style={{
                      height: (88 / 930) * screenHeight,
                      width: (88 / 430) * screenWidth,
                      resizeMode: "cover",
                      borderRadius: 50,
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "column",
                    gap: (10 / 930) * screenHeight,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontFamily: CustomFonts.InterMedium,
                    }}
                  >
                    {user && user.name}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setShowPopup(true);
                }}
              >
                <Image
                  source={require("../../assets/Images/cameraImage.png")}
                  style={{
                    width: (40 / 430) * screenWidth,
                    height: (40 / 930) * screenHeight,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: screenWidth - 40,
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: (30 / 930) * screenHeight,
                flexDirection: "row",
              }}
            >
              <Text style={[GlobalStyles.text14, { color: "#00000080" }]}>
                Media
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.push(ScreenNames.UploadMediaScreen, {
                    from: "profile",
                    media:user.media
                  });
                }}
              >
                <Text
                  style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {user.media ? (
              user.media.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: screenWidth - 40,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: (20 / 430) * screenWidth,
                    marginTop: (20 / 930) * screenHeight,
                  }}
                >
                  <Image
                    source={item.type === "image" ? item.url : item.thumb_url}
                    style={{
                      height: (75 / 930) * screenHeight,
                      width: (73 / 430) * screenWidth,
                      resizeMode: "cover",
                      borderRadius: 10,
                    }}
                  />

                  <View
                    style={{
                      width: (270 / 430) * screenWidth,
                      alignItems: "flex-start",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: CustomFonts.InterMedium,
                        color: Colors.lightBlack,
                        opacity: 0.7,
                      }}
                    >
                      {getMediaName(item.url)}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={[
                        GlobalStyles.text17,
                        { width: (250 / 430) * screenWidth },
                      ]}
                    >
                      {item.caption}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[GlobalStyles.text12, { marginTop: 10 }]}>
                No media
              </Text>
            )}

            <View
              style={{
                width: screenWidth - 40,
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: (30 / 930) * screenHeight,
                flexDirection: "row",
              }}
            >
              <Text style={[GlobalStyles.text14, { color: "#00000080" }]}>
                Industry
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.push(ScreenNames.BusinessIndustryScreen, {
                    from: "profile",
                  });
                }}
              >
                <Text
                  style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                GlobalStyles.text17,
                {
                  alignSelf: "flex-start",
                  marginTop: (15 / 930) * screenHeight,
                },
              ]}
            >
              {user.business_industry}
            </Text>

            <View
              style={{
                width: screenWidth - 40,
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: (30 / 930) * screenHeight,
                flexDirection: "row",
              }}
            >
              <Text style={[GlobalStyles.text14, { color: "#00000080" }]}>
                Number of Employee
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.push(ScreenNames.EmployeesScreen, {
                    user: {
                      from: "profile",
                    },
                  });
                }}
              >
                <Text
                  style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                GlobalStyles.text17,
                {
                  alignSelf: "flex-start",
                  marginTop: (15 / 930) * screenHeight,
                },
              ]}
            >
              {user.business_employees}
            </Text>

            <View
              style={{
                width: screenWidth - 40,
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: (30 / 930) * screenHeight,
                flexDirection: "row",
              }}
            >
              <Text style={[GlobalStyles.text14, { color: "#00000080" }]}>
                About Business
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.push(ScreenNames.BusinessDetailsScreen, {
                    user: {
                      from: "profile",
                    },
                  });
                }}
              >
                <Text
                  style={[GlobalStyles.BtnText, { color: Colors.orangeColor }]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                GlobalStyles.text17,
                {
                  alignSelf: "flex-start",
                  marginTop: (15 / 930) * screenHeight,
                  width: screenWidth - 60,
                },
              ]}
            >
              {user.about_business}
            </Text>

            <TextInput
              style={[
                GlobalStyles.input,
                { marginTop: (20 / 930) * screenHeight },
              ]}
              placeholder="Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
            />

            <TouchableOpacity
              style={[
                GlobalStyles.input,
                { marginTop: (20 / 930) * screenHeight },
              ]}
              onPress={() => {
                setShowAddressPicker(true);
              }}
            >
              <Text>
                {city ? city : "City"} {state ? state : ", State"}
              </Text>
            </TouchableOpacity>

            <View
              style={[
                GlobalStyles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: (20 / 930) * screenHeight,
                },
              ]}
            >
              <TextInput
                style={{ width: (280 / 430) * screenWidth }}
                placeholder="Email"
                value={email}
                editable={false}
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
              <Image
                source={require("../../assets/Images/emailIcon.png")}
                style={GlobalStyles.image24}
              />
            </View>

            <View
              style={[
                GlobalStyles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: (20 / 930) * screenHeight,
                },
              ]}
            >
              <TextInput
                style={{ width: (280 / 430) * screenWidth }}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                editable={false}
              // onChangeText={(text)=>{
              //     email(text)
              // }}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowpass(!showpass);
                }}
              >
                <Image
                  source={
                    showpass
                      ? require("../../assets/Images/eye.png")
                      : require("../../assets/Images/eye-slash.png")
                  }
                  style={GlobalStyles.image24}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={GlobalStyles.capsuleBtn}
              onPress={() => {
                saveChanges();
              }}
            >
              <Text style={GlobalStyles.BtnText}>Save Updates</Text>
            </TouchableOpacity>

            {/* Gallery popup */}

            <Modal visible={showPopup} transparent={true} animationType="slide">
              <GaleryCamPopup
                close={() => {
                  setShowPopup(false);
                }}
                handleBtnPress={(value) => {
                  console.log("button pressed", value);
                  if (value === "galery") {
                    pickImage();
                  } else if (value === "camera") {
                    captureImage();
                  }
                }}
              />
            </Modal>

            {/* address picker popup */}

            <Modal
              transparent={true}
              visible={showAddressPicker}
              animationType="slide"
            >
              <AddressPicker
                closeModal={() => {
                  setShowAddressPicker(false);
                }}
                PickAddress={(address) => {
                  console.log("picked address is", address);
                  setState(address.shortState);
                  setCity(address.city);
                }}
              />
            </Modal>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BusinessInfoScreen;
