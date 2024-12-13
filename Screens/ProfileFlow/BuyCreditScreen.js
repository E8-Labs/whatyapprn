import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { screenHeight, screenWidth } from "../../res/Constants";
import { CustomFonts } from "../../assets/font/Fonts";
import React, { useState, useEffect } from "react";
import { Colors } from "../../res/Colors";
import { ScreenNames } from "../../res/ScreenNames";
import Purchases from "react-native-purchases";
import { ApiKeys } from "../../Api/keys";
import { Apipath } from "../../Api/Apipaths";

const BuyCreditScreen = ({ navigation }) => {
  const [selectedPlan, setselectedPlan] = useState({});

  const [loading, setLoading] = useState(null);
  const [loading2, setLoading2] = useState(null);
  const selectedImage = require("../../assets/Images/selectedIcon.png");
  const unSelectedImage = require("../../assets/Images/unSelectedIcon.png");

  const plans = [
    {
      id: 1,
      name: "10 CREDITS",
      price: "$5",
      identifier: "Credits_10x",
      points: 10,
    },
    {
      id: 2,
      name: "25 CREDITS",
      price: "$9.99",
      identifier: "Credits_25x",
      points: 25,
    },
    {
      id: 3,
      name: "UNLIMITED",
      price: "$20",
      identifier: "Credit_Unlimitedx",
      points: 10000000,
    },
  ];

  useEffect(() => {
    initializePurchases();
  }, []);

  const notifyServer = async (points, productid) => {
    try {
      let userData = await AsyncStorage.getItem("USER");
      let user = JSON.parse(userData);
      const response = await fetch(Apipath.PurchaseCredits, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          points: points,
          productId: productid,
        }),
      });

      const data = await response.json();
      console.log("data is ", data);
      setLoading(null);
      //stop loading
      if (data.status) {
        Alert.alert(`Purchase successfull`);
      } else {
        Alert.alert(
          "Purchase validation failed",
          "The server could not validate your purchase."
        );
      }
    } catch (error) {
      console.error("Error notifying server:", error);
    }
  };

  const initializePurchases = async () => {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    try {
      if (Platform.OS === "ios") {
        const data = await AsyncStorage.getItem("USER");
        let user = null;
        if (data) {
          let d = JSON.parse(data);
          user = d.user;
          await Purchases.configure({
            apiKey: ApiKeys.RevenueCatApiKey,
            appUserID: `${user.id}`,
          });
          console.log("Initialized user with id:", user.id);

          try {
            const customerInfo = await Purchases.getCustomerInfo();
            // console.log("Customer ", customerInfo.entitlements.active["premium"])
            if (
              typeof customerInfo.entitlements.active["premium"] != "undefined"
            ) {
              console.log(
                "User subscribed to plan ",
                customerInfo.entitlements.active["premium"]
              );
            }
            // access latest customerInfo
          } catch (e) {
            // Error fetching customer info
          }
          // fetchProducts();
        }
      } else if (Platform.OS === "android") {
        await Purchases.configure({ apiKey: ApiKeys.RevenueCatApiKey });
        fetchProducts();
      }
    } catch (error) {
      console.error("Failed to initialize purchases:", error);
    }
  };

  const buyProduct = async (product) => {
    setLoading(product.id);
    // setLoading2(product.identifier);
    const productId = product.identifier;
    try {
      console.log("Subscribing to", product.identifier);

      const { customerInfo, productIdentifier } =
        await Purchases.purchaseProduct(productId);
      console.log(`Purchased product: ${productIdentifier}`);

      if (productIdentifier === productId) {
        // Send the purchase data to the server
        // const receiptInfo = await Purchases.getPurchaserInfo();

        // const receipt = customerInfo.entitlements.active[productId];

        // const latestTransaction = customerInfo.nonSubscriptionTransactions
        //   .filter((txn) => txn.productId === productId)
        //   .reduce((latest, current) => {
        //     // console.log("Latest")
        //     // console.log(latest)
        //     // console.log("Current")
        //     // console.log(current)
        //     return current.purchaseDateMillis > latest.purchaseDateMillis
        //       ? current
        //       : latest;
        //   });
        // const receipt = latestTransaction.purchaseDateMillis;
        // console.log("#####################################");
        // console.log(receipt);
        // console.log("#####################################");
        await notifyServer(product.points, product.productId);
        // setLoading2(null);
      }
    } catch (e) {
      console.log("Exception during purchase:", e);
      setLoading(null);
      // setLoading2(null);
      if (!e.userCancelled) {
        // Handle other errors
      }
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={GlobalStyles.container}>
        <View style={GlobalStyles.completeProfileTopBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              // buyProduct(selectedPlan);
            }}
          >
            <Image
              source={require("../../assets/Images/backArrow.png")}
              style={GlobalStyles.image24}
            />
          </TouchableOpacity>

          <Text style={GlobalStyles.text14}>Buy More Credit</Text>
          <View></View>
        </View>
        <View style={{ height: 0.85 * screenHeight, alignItems: "center" }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[
                GlobalStyles.heading,
                { marginTop: (30 / 930) * screenHeight },
              ]}
            >
              Buy Credit
            </Text>

            <Text
              style={[
                GlobalStyles.text17,
                { marginTop: (20 / 930) * screenHeight },
              ]}
            >
              You get free 5 credit renewed every month
            </Text>

            <View style={{ marginTop: (50 / 930) * screenHeight }}>
              {plans.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setselectedPlan(item);
                  }}
                >
                  {item.id === 2 && (
                    <Image
                      source={require("../../assets/Images/recommendedImage.png")}
                      style={{
                        height: (30 / 930) * screenHeight,
                        width: (164 / 430) * screenWidth,
                        resizeMode: "contain",
                        zIndex: 2,
                        alignSelf: "flex-end",
                        marginRight: (0 / 430) * screenWidth,
                        marginBottom: (-45 / 930) * screenHeight,
                        // position: 'relative', top: 0, bottom: 50,
                      }}
                    />
                  )}
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor:
                        selectedPlan.id === item.id
                          ? Colors.orangeColor
                          : Colors.grayColor,
                      borderRadius: 5,
                      alignItems: "center",
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      marginTop: (30 / 930) * screenHeight,
                      zIndex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: screenWidth - (80 / 430) * screenWidth,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 15,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            fontFamily: CustomFonts.PoppinsSemiBold,
                            fontWeight: "700",
                            color: Colors.orangeColor,
                          }}
                        >
                          {item.name}
                        </Text>

                        <Text
                          style={{
                            fontSize: 17,
                            fontFamily: CustomFonts.PoppinsSemiBold,
                            fontWeight: "700",
                            color: "black",
                          }}
                        >
                          {item.price}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 15,
                          justifyContent: "center",
                          alignSelf: "flex-start",
                          marginTop: 5,
                        }}
                      >
                        <Image
                          source={
                            selectedPlan.id === item.id
                              ? selectedImage
                              : unSelectedImage
                          }
                          style={GlobalStyles.image24}
                        />
                        {loading === item.id && (
                          <ActivityIndicator
                            size={"small"}
                            color={Colors.orangeColor}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={GlobalStyles.capsuleBtn}
              onPress={() => {
                buyProduct(selectedPlan);
                // navigation.push(ScreenNames.BuyCreditScreen)
              }}
            >
              <Text style={GlobalStyles.BtnText}>Buy Now</Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 13,
                fontFamily: CustomFonts.InterRegular,
                alignSelf: "center",
                marginTop: 20,
                color: "#00000090",
              }}
            >
              Payment is charged to your iTunes Account.
            </Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BuyCreditScreen;
