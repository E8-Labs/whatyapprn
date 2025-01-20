import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "../../assets/styles/GlobalStyles";
import {
  placeholderImage,
  screenHeight,
  screenWidth,
} from "../../res/Constants";
import { CustomFonts } from "../../assets/font/Fonts";
import { Colors } from "../../res/Colors";
import FilterPoopup from "../../components/FilterPoopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Apipath } from "../../Api/Apipaths";
import LoadingAnimation from "../../components/LoadingAnimation";
import { ScreenNames } from "../../res/ScreenNames";
import NoResults from "../../components/NoResults";
import calculateSpent from "../../res/CalculateSpent";

const profileImage = require("../../assets/Images/profileImage.png");

const SearchScreen = ({ hideAnimation, from = "discover", navigation }) => {

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [loading, setloading] = useState(false);
  const [pastSearch, setPastSearch] = useState([]);


  useEffect(() => {
    if (from === "filter") {
      setShowFilterPopup(true)
    }
    console.log('from', from)
  }, [from])

  useEffect(() => {
    setCustomers([]);
    let timer = setTimeout(() => {
      if (searchQuery != null) {
        console.log("timer finished");
        searchCustomers(0);
      } else {
        setCustomers([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    getPastSearches();
  }, []);

  const getPastSearches = async () => {
    console.log("trying to gt past searches");

    const data = await AsyncStorage.getItem("USER");
    if (data) {
      let u = JSON.parse(data);
      let path = Apipath.searchHistory;
      console.log("Auth token is", u.token);
      console.log("path is", path);
      try {
        const response = await axios.get(path, {
          headers: {
            Authorization: "Bearer " + u.token,
            "Content-Type": "application/json",
          },
        });
        console.log("trying to gt past searches 3");

        if (response.data) {
          if (response.data.status === true) {
            console.log("search history is", response.data.data);

            let his = response.data.data

            let firstSearches = []

            // his.forEach((item, index) => {
            //   if (index < 4) {
            //     firstSearches.push(item)
            //   }
            // });

            // console.log('first searches are', firstSearches)
            setPastSearch(his)

          } else {
            console.log("search history messsage is", response.data.message);
          }
        }
      } catch (e) {
        console.log("error in past sarch api", e);
      }
    }
  };

  const deleteSearch = async (item) => {
    console.log('trying to delete',item)
    const data = await AsyncStorage.getItem("USER")
    if (data) {
      let u = JSON.parse(data)

      let apidata = {
        searchId: item.id
      }
      try {
        const response = await axios.post(Apipath.deleteSearch, apidata, {
          headers: {
            'Authorization': 'Bearer ' + u.token,
            'Content-Type': 'application/json'
          }
        })

        if (response.data) {

          if (response.data.status === true) {
            console.log('search deleted')

            let searchId = item.id

            let filteredSearches = pastSearch.filter(item => item.id != searchId)

            setPastSearch(filteredSearches)

          } else {
            console.log('search delete message is', response.data.message)
          }

        }
      } catch (e) {
        console.log('error in delete search ', e)
      }
    }
  }

  const searchCustomers = async (offset = -1, filters) => {
    if (offset == -1) {
      offset = customers.length;
    }
    try {
      console.log("trying to search customer");
      const data = await AsyncStorage.getItem("USER");
      if (data) {
        let u = JSON.parse(data);

        let path = Apipath.searchCustomers;
        if (searchQuery != null) {
          path =
            `${path}?searchQuery=${searchQuery}` +
            "&offset=" +
            offset;
        } else {
          path = `${path}?` + "offset=" + offset;
        }

        if (filters) {
          if (filters.city != "") {
            path = path + "&city=" + filters.city
          }
          if (filters.state) {
            path = path + "&state=" + filters.state
          }
          if (filters.minYapScore) {
            path = path + "&minYapScore=" + filters.minYapScore
          }
          if (filters.maxYapScore) {
            path = path + "&maxYapScore=" + filters.maxYapScore
          }
          if (filters.minTransaction) {
            path = path + "&minTransaction=" + filters.minTransaction
          }
          if (filters.maxTransaction) {
            path = path + "&maxTransaction=" + filters.maxTransaction
          }
        }
        console.log("path is", path);
        // setloading(true) 
        const response = await axios.get(path, {
          headers: {
            Authorization: "Bearer " + u.token,
          },
        });
        if (response.data) {
          setloading(false);
          // if(response.data.data.status === true ){}
          console.log("search response is", response.data);
          setCustomers(response.data.data || []);
        }
      }
    } catch (e) {
      setloading(false);
      console.log("error in search customers", e);
    } finally {
      setloading(false);
    }
  };

  const handleOnpress = (item) => {
    console.log("item is", item);
    if (from === "tabbar") {
      navigation.push(ScreenNames.YapServiceScreen, {
        user: item,
      });
    } else {
      navigation.push(ScreenNames.CustomerProfileDetails, {
        user: item,
        from: 'User'
      });
    }
  };

  const closeModal = (filters) => {
    setShowFilterPopup(false)
    if (filters) {
      setCustomers([])
      searchCustomers(0, filters)
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss(); // Dismiss the keyboard only when tapping outside elements
      }}>
      <SafeAreaView style={GlobalStyles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {loading ?
            <LoadingAnimation visible={loading}
            />
            :
            <View style={[GlobalStyles.container, { width: screenWidth - 40 }]}>
              <View
                style={[
                  GlobalStyles.input,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: screenWidth - 40,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      hideAnimation();
                    }}
                  >
                    <Image
                      source={require("../../assets/Images/backArrow.png")}
                      style={GlobalStyles.image24}
                    />
                  </TouchableOpacity>
                  <TextInput
                    value={searchQuery}
                    autoFocus={true}
                    placeholder="Search by name, diver/state license"
                    onChangeText={(text) => {
                      setSearchQuery(text)
                    }}
                    width={(300 / 430) * screenWidth}
                    placeholderTextColor={"black"}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setShowFilterPopup(true);
                  }}
                >
                  <Image
                    source={require("../../assets/Images/filterIcon.png")}
                    style={GlobalStyles.image24}
                  />
                </TouchableOpacity>
              </View>

              {/* Filter popup*/}
              <Modal
                visible={showFilterPopup}
                animationType="slide"
                transparent={true}
              >
                <FilterPoopup
                  close={closeModal}
                />
              </Modal>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  alignSelf: "flex-start",
                  marginTop: (15 / 930) * screenHeight,
                }}
              >
              </View>
              <View style={{ height: screenHeight * 0.7 }}>
                <ScrollView showsVerticalScrollIndicator={false} style={{}}>
                  {/* {searchCatigories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor:
                  item.id === selectedCat.id ? "#FF570010" : "transparent",
                padding: 10,
                borderRadius: 30,
              }}
              onPress={() => {
                setSelectedCat(item);
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 12,
                  fontFamily: CustomFonts.PoppinsMedium,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))} */}
                  <View style={{ width: screenWidth - 40, alignItems: "center" }}>
                    {
                      pastSearch.length > 0 && (
                        <>
                          <Text
                            style={[
                              GlobalStyles.text14,
                              {
                                alignSelf: "flex-start",
                                marginTop: (20 / 930) * screenHeight,
                              },
                            ]}
                          >
                            Past Search
                          </Text>
                          <View style = {{height:screenHeight*0.25}}>
                            <ScrollView>
                              <View style={{ flexDirection: "column", gap: 20, marginTop: 20 }}>
                                {pastSearch.map((item) => (
                                  <View
                                    key={item.id}
                                    style={{
                                      width: screenWidth - 40,
                                      alignItems: "center",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <TouchableOpacity onPress={() => {
                                      setSearchQuery(item.searchQuery)
                                    }}>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          gap: (10 / 430) * screenWidth,
                                        }}
                                      >
                                        <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage} style={GlobalStyles.image24} />
                                        <Text style={GlobalStyles.text14}>{item.searchQuery}</Text>
                                      </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => deleteSearch(item)}
                                    >
                                      <Image
                                        source={require("../../assets/Images/crossIcon.png")}
                                        style={GlobalStyles.image24}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ))}
                              </View>
                            </ScrollView>
                          </View>
                        </>
                      )
                    }

                    <View style={{ marginTop: 40, flexDirection: "column", gap: 30 }}>
                      {
                        // customers.map((item) => (
                        customers.length > 0 ?
                          !loading && (
                            <FlatList
                              scrollEnabled={false}
                              data={customers}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  onPress={() => {
                                    Keyboard.dismiss();
                                    handleOnpress(item);
                                  }}
                                >
                                  <View
                                    key={item.id}
                                    style={{
                                      width: screenWidth - 40,
                                      alignItems: "flex-start",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      marginTop: (20 / 930) * screenHeight,
                                    }}
                                  >
                                    <Image
                                      source={
                                        item.profile_image
                                          ? { uri: item.profile_image }
                                          : placeholderImage
                                      }
                                      style={{
                                        height: (30 / 930) * screenHeight,
                                        width: (30 / 430) * screenWidth,
                                        resizeMode: "cover",
                                        borderRadius: 20,
                                      }}
                                    />
                                    <View
                                      style={{
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        gap: (15 / 930) * screenHeight,
                                      }}
                                    >
                                      <Text
                                        style={[GlobalStyles.text17, { color: "black" }]}
                                      >
                                        {item.name}
                                      </Text>
                                      <Text
                                        style={[
                                          GlobalStyles.text17,
                                          { color: "#00000080" },
                                        ]}
                                      >
                                        {item.city ? item.city : ""}
                                      </Text>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          width: (200 / 430) * screenWidth,
                                        }}
                                      >
                                        <View style={{ flexDirection: "column", gap: 5 }}>
                                          <View style={{ flexDirection: "row" }}>
                                            <Image
                                              source={require("../../assets/Images/yIcon.png")}
                                              style={GlobalStyles.yIcon}
                                            />
                                            <Text
                                              style={{
                                                fontSize: 14,
                                                fontFamily: CustomFonts.InterMedium,
                                                color: "#00000080",
                                              }}
                                            >
                                              ap score
                                            </Text>
                                          </View>
                                          <Text
                                            style={{
                                              fontSize: 20,
                                              fontFamily: CustomFonts.IntriaBold,
                                            }}
                                          >
                                            {item.yapScore3Digit}
                                          </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", gap: 5 }}>
                                          <Text
                                            style={{
                                              fontSize: 13,
                                              fontFamily: CustomFonts.InterRegular,
                                            }}
                                          >
                                            Total Reviews
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize: 20,
                                              fontFamily: CustomFonts.IntriaBold,
                                            }}
                                          >
                                            {item.totalReviews}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        alignItems: "flex-end",
                                        height: (110 / 930) * screenHeight,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          fontFamily: CustomFonts.InterMedium,
                                        }}
                                      >
                                        Spent over {calculateSpent(item.totalSpent)}
                                      </Text>

                                      {/* <TouchableOpacity> */}
                                      <Image
                                        source={require("../../assets/Images/farwordBtn.png")}
                                        style={GlobalStyles.image37}
                                      />
                                      {/* </TouchableOpacity> */}
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              )}

                            // onEndReached={searchCustomers}
                            // onEndReachedThreshold={.1}
                            />
                          ) : (
                            searchQuery &&
                            <NoResults navigation={navigation} />
                          )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          }
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>

  );
};


export default SearchScreen;
