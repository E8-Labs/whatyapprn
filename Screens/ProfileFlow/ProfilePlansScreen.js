import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { screenHeight, screenWidth } from "../../res/Constants";
import { CustomFonts } from "../../assets/font/Fonts";
import React, { useState, useEffect } from "react";
import { Colors } from "../../res/Colors";
import { ScreenNames } from "../../res/ScreenNames";
import Purchases from "react-native-purchases";
import usePurchases from "../../res/hooks/usePurchases";
import { ApiKeys } from "../../Api/keys";
// import { ApiKeys } from "../../Api/keys";

const RevenueCatApiKey = ApiKeys.RevenueCatApiKey; //"appl_xmLtPRVaCdpCrklyeHGUMguQRlb";
const ProfilePlansScreen = ({ navigation }) => {
  const plans = [
    {
      id: 1,
      name: "YEARLY",
      price: "$499/yr",
      disc: "12 Months at $50/Month",
      identifier: "Monthly_Premium_1118",
      oldPrice: '$999'
    },
    {
      id: 2,
      name: "MONTHLY",
      price: "$49/m",
      disc: "",
      identifier: "Yearly_Premium_1118",
      oldPrice: '$99'
    },
  ];
  //   const [products, setProducts] = useState([]);
  //   const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlan, setselectedPlan] = useState(plans[0]);
  const { loading, products, fetchProducts, buyProduct } =
    usePurchases(RevenueCatApiKey);

  const selectedImage = require("../../assets/Images/selectedIcon.png");
  const unSelectedImage = require("../../assets/Images/unSelectedIcon.png");

  const billingHistory = [
    {
      id: 1,
      date: "01/10/2023",
      plan: "Monthly",
      amount: "$7.99",
    },
    {
      id: 2,
      date: "01/10/2023",
      plan: "Monthly",
      amount: "$7.99",
    },
    {
      id: 3,
      date: "01/10/2023",
      plan: "Monthly",
      amount: "$7.99",
    },
    {
      id: 4,
      date: "01/10/2023",
      plan: "Monthly",
      amount: "$7.99",
    },
    {
      id: 5,
      date: "01/10/2023",
      plan: "Monthly",
      amount: "$7.99",
    },
    {
      id: 6,
      date: "01/10/2023",
      plan: "Monthly",
      amount: "$7.99",
    },
  ];

  //   useEffect(() => {
  //     initializePurchases();
  //   }, []);

  //   const fetchProducts = async () => {
  //     try {
  //       setLoading(true);
  //       console.log("Loading products...");
  //       const offerings = await Purchases.getOfferings();
  //       // console.log("Offerings:", offerings);
  //       setLoading(false);

  //       if (offerings.current && offerings.current.availablePackages.length > 0) {
  //         const availableProducts = offerings.current.availablePackages.map(
  //           (pkg) => pkg.product
  //         );
  //         console.log("Available products:", availableProducts);
  //         setProducts(availableProducts);
  //       } else {
  //         console.log("No available products found");
  //       }
  //     } catch (e) {
  //       console.log("Error getting offerings:", e);
  //     }
  //   };

  //   const initializePurchases = async () => {
  //     Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

  //     try {
  //       if (Platform.OS === "ios") {
  //         const data = await AsyncStorage.getItem("USER");
  //         let user = null;
  //         if (data) {
  //           let d = JSON.parse(data);
  //           user = d.user;
  //           await Purchases.configure({
  //             apiKey: RevenueCatApiKey,
  //             appUserID: `${user.id}`,
  //           });
  //           console.log("Initialized user with id:", user.id);

  //           try {
  //             const customerInfo = await Purchases.getCustomerInfo();
  //             // console.log("Customer ", customerInfo.entitlements.active["premium"])
  //             if (
  //               typeof customerInfo.entitlements.active["premium"] != "undefined"
  //             ) {
  //               console.log(
  //                 "User subscribed to plan ",
  //                 customerInfo.entitlements.active["premium"]
  //               );
  //             }
  //             // access latest customerInfo
  //           } catch (e) {
  //             // Error fetching customer info
  //           }
  //           fetchProducts();
  //         }
  //       } else if (Platform.OS === "android") {
  //         await Purchases.configure({ apiKey: RevenueCatApiKey });
  //         fetchProducts();
  //       }
  //     } catch (error) {
  //       console.error("Failed to initialize purchases:", error);
  //     }
  //   };

  //   const buyProduct = async (product) => {
  //     setLoading2(product.identifier);
  //     try {
  //       console.log("Subscribing to", product.identifier);
  //       const { customerInfo } = await Purchases.purchaseProduct(
  //         product.identifier
  //       );
  //       if (customerInfo.entitlements.active["premium"]) {
  //         console.log("User subscribed to premium");
  //         let p = customerInfo.entitlements.active["premium"];
  //         let date = p.originalPurchaseDateMillis;
  //         console.log("Original date ", date);
  //         await UpdateProfile(JSON.stringify({ originalPurchaseDate: date }));
  //         console.log("Profile updated");
  //         setLoading2(null);
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: "TabBarContainer" }],
  //         });
  //       }
  //     } catch (e) {
  //       setLoading2(null);
  //       console.log("Exception during purchase:", e);
  //       setSelectedProduct(null);
  //       if (!e.userCancelled) {
  //         // Handle other errors
  //       }
  //     }
  //   };
  return (
    <SafeAreaView style={GlobalStyles.container}>
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

          <Text style={GlobalStyles.text14}>Plans</Text>
          <View></View>
        </View>
        <View style={{ height: 0.85 * screenHeight, alignItems: "center" }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: (20 / 930) * screenHeight }}>
              {loading ? (
                <View
                  style={{
                    width: screenWidth,
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text> Loading products...</Text>
                </View>
              ) : (
                plans.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setselectedPlan(item);
                    }}
                  >
                    {item.id === 1 && (
                      <Image
                        source={require("../../assets/Images/recommendedImage.png")}
                        style={{
                          height: (30 / 930) * screenHeight,
                          width: (164 / 430) * screenWidth,
                          resizeMode: "contain",
                          zIndex: 2,
                          alignSelf: "center",
                          marginRight: (30 / 430) * screenWidth,
                          marginBottom: (-45 / 930) * screenHeight,
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
                            alignItems: "center",
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
                            {item.price} <Text style={{
                              fontSize: 17,
                              fontFamily: CustomFonts.PoppinsMedium,
                              fontWeight: "700",
                              color: "black",
                              textDecorationLine: 'line-through'
                            }}>
                              {item.oldPrice}
                            </Text>
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 15,
                            justifyContent: "center",
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
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: CustomFonts.InterRegular,
                              color: "#000000",
                            }}
                          >
                            {item.disc}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {!loading && (
              <TouchableOpacity
                style={GlobalStyles.capsuleBtn}
                onPress={() => {
                  buyProduct(selectedPlan);
                  // navigation.push(ScreenNames.BuyCreditScreen);
                }}
              >
                <Text style={GlobalStyles.BtnText}>Upgrade Plan</Text>
              </TouchableOpacity>
            )}

            <View
              style={{
                width: screenWidth - 20,
                alignItems: "flex-start",
                paddingVertical: (15 / 930) * screenHeight,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#EAEAEA",
                marginTop: (50 / 930) * screenHeight,
              }}
            >
              <Text
                style={[
                  GlobalStyles.text17,
                  { paddingLeft: (20 / 430) * screenWidth },
                ]}
              >
                Billing History
              </Text>

              <View
                style={{
                  width: (370 / 430) * screenWidth,
                  height: (60 / 930) * screenHeight,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  backgroundColor: "#F5F5F5",
                  paddingHorizontal: (20 / 430) * screenWidth,
                  marginTop: (25 / 930) * screenHeight,
                  alignSelf: "center",
                }}
              >
                <Text style={GlobalStyles.text17}>Plan</Text>

                <Text style={GlobalStyles.text17}>Date</Text>

                <Text style={GlobalStyles.text17}>Amount</Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: (10 / 930) * screenHeight,
                  marginTop: (25 / 930) * screenHeight,
                }}
              >
                {billingHistory.map((item, index) => (
                  <>
                    <View
                      key={item.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: (370 / 430) * screenWidth,
                        paddingHorizontal: (20 / 430) * screenWidth,
                        marginTop: (10 / 930) * screenHeight,
                      }}
                    >
                      <Text style={GlobalStyles.text17}>{item.plan}</Text>

                      <Text style={GlobalStyles.text17}>{item.date}</Text>

                      <Text style={GlobalStyles.text17}>{item.amount}</Text>
                    </View>
                    {index + 1 !== billingHistory.length && (
                      <View
                        style={[
                          GlobalStyles.divider,
                          { width: screenWidth - 20, paddingLeft: -20 },
                        ]}
                      ></View>
                    )}
                  </>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={{
                marginTop: (60 / 930) * screenHeight,
                alignSelf: "center",
              }}
            >
              <Text style={[GlobalStyles.BtnText, { color: "red" }]}>
                Cancel Subscription
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePlansScreen;
