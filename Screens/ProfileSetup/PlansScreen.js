import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import { screenHeight, screenWidth } from "../../res/Constants";
import { Colors } from "../../res/Colors";
import { CustomFonts } from "../../assets/font/Fonts";
import { ScreenNames } from "../../res/ScreenNames";
import { ApiKeys } from "../../Api/ApiKeys";
import usePurchases from "../../res/hooks/usePurchases";

const PlansScreen = ({ navigation }) => {
  const plans = [
    {
      id: 1,
      name: "YEARLY",
      price: "$499/yr",
      // disc: "$50/Month",
      identifier: "Yearly_Premium_1118",
      oldPrice: "$999",
    },
    {
      id: 2,
      name: "MONTHLY",
      price: "$49/m",
      disc: "",
      identifier: "Monthly_Premium_1118",
      oldPrice: "$99",
    },
  ];
  const RevenueCatApiKey = ApiKeys.RevenueCatApiKey; //"appl_xmLtPRVaCdpCrklyeHGUMguQRlb";
  const [selectedPlan, setselectedPlan] = useState(plans[0]);
  const { loading, products, fetchProducts, buyProduct, loading2 } =
    usePurchases(RevenueCatApiKey);

  const selectedImage = require("../../assets/Images/selectedIcon.png");
  const unSelectedImage = require("../../assets/Images/unSelectedIcon.png");

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={[GlobalStyles.container, { alignItems: "center" }]}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            height: screenHeight - 100,
          }}
        >
          <Image
            source={require("../../assets/Images/logo.png")}
            style={{
              height: 50,
              width: 250,
              alignSelf: "center",
              marginTop: (100 / 930) * screenHeight,
            }}
          />
          <View style={{ position: "absolute", bottom: 50 }}>
            <View style={{ width: screenWidth, alignItems: "center" }}>
              <Text style={GlobalStyles.heading}>Subscription Plan</Text>
              <Text
                style={[
                  GlobalStyles.subheading14,
                  { marginTop: 10, marginBottom: (50 / 930) * screenHeight },
                ]}
              >
                Choose the right plan for your business
              </Text>

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
                          alignSelf: "flex-end",
                          marginRight: (30 / 430) * screenWidth,
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
                            alignItems: "start",
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
                            {item.price}{" "}
                            <Text
                              style={{
                                fontSize: 17,
                                fontFamily: CustomFonts.PoppinsMedium,
                                fontWeight: "700",
                                color: "black",
                                textDecorationLine: "line-through",
                              }}
                            >
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
                              fontSize: 17,
                              fontFamily: CustomFonts.InterRegular,
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
              {
                loading2 ? (
                  <ActivityIndicator color={Colors.orangeColor} />
                ) : (
                  <TouchableOpacity
                    style={GlobalStyles.capsuleBtn}
                    onPress={() => {
                      buyProduct(selectedPlan)
                    }}
                  >
                    <Text style={GlobalStyles.BtnText}>Subscribe</Text>
                  </TouchableOpacity>

                )
              }

              <Text
                style={{
                  width: screenWidth - 40,
                  fontSize: 13,
                  fontFamily: CustomFonts.InterRegular,
                  marginTop: 30,
                  textAlign: "center",
                }}
              >
                This subscription automically renews unless auto-renew is turn
                off ateast 24hrs before current period eands. Payment is charged
                to your iTunes Account.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlansScreen;
