import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../../assets/styles/GlobalStyles'
import { Image } from 'expo-image'
import { BarChart } from 'react-native-chart-kit'
import { placeholderImage, screenHeight, screenWidth } from '../../../res/Constants'
import { CustomFonts } from '../../../assets/font/Fonts'
import { ScreenNames } from '../../../res/ScreenNames'
import { Colors } from '../../../res/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Apipath } from '../../../Api/Apipaths'
import { Dropdown } from 'react-native-element-dropdown';


const AdminAnalyticsMainScreen = () => {
  const image = require('../../../assets/Images/profileImage.png')


  const [selectedMenu, setSelectedMenu] = useState({
    id: 1,
    name: "Revenue",
  })
  const [analyticsData, setAnalyticsData] = useState(null)
  const [recentBusinesses, setRecentBusinesses] = useState([])
  const [recentCustomers, setRecentCustomers] = useState([])
  const [revValue, setRevValue] = useState("1")
  const [businessValue, setBusinessValue] = useState("1")
  const [customerValue, setCustomerValue] = useState("1")
  const [reviewValue, setReviewValue] = useState("1")

  let opened = 30
  let closed = 70
  let totalDisputes = 100

  const openedPercentage = (opened / totalDisputes) * 100;
  const closedPercentage = (closed / totalDisputes) * 100;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


  const menue = [
    {
      id: 1,
      name: "Revenue",
    }, {
      id: 2,
      name: "Business",
    }, {
      id: 3,
      name: "Customers",
    }, {
      id: 4,
      name: "Past",
    },
  ]

  const revDuration = [
    {
      value: '1',
      lable: 'Monthly',
    },
    {
      value: '2',
      lable: 'Weekly',
    },
    {
      value: '3',
      lable: 'Daily',
    },
  ]

  useEffect(() => {
    getAnalyticsData()
  }, [])

  const getAnalyticsData = async () => {
    const data = await AsyncStorage.getItem("USER")
    if (data) {
      let u = JSON.parse(data)
      try {
        const response = await axios.get(Apipath.getAdminAnalyticsData, {
          headers: {
            "Authorization": "Bearer " + u.token
          }
        })
        if (response.data) {
          if (response.data.status === true) {
            console.log('analytics data is', response.data.data)
            setAnalyticsData(response.data.data)
            setRecentBusinesses(response.data.data.recentBusinesses)
            setRecentCustomers(response.data.data.recentCustomers)
          } else {
            console.log('darshboard api message is', response.data.message)
          }
        }
      } catch (e) {
        console.log('error in dashboard api ', e)
      }
    }
  }


  const formatData = (data, type) => {
    if (type === "monthly") {
      const labels = monthNames;
      const monthlyData = Array(12).fill(0);

      data.forEach((entry) => {
        const monthIndex = entry.month - 1;
        monthlyData[monthIndex] = entry.count;
      });

      return {
        labels,
        datasets: [{ data: monthlyData }],
      };
    } else if (type === "weekly") {
      const labels = ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5"];
      const weeklyData = Array(5).fill(0);

      data.forEach((entry) => {
        const weekIndex = entry.week - 1;
        weeklyData[weekIndex] = entry.count;
      });

      return {
        labels,
        datasets: [{ data: weeklyData }],
      };
    } else if (type === "daily") {
      const labels = data.map((entry) => entry.date.slice(5)); // MM-DD format
      const dailyData = data.map((entry) => entry.count);

      return {
        labels,
        datasets: [{ data: dailyData }],
      };
    }
  };

  const getChartData = (dataType, value) => {
    if (!analyticsData) return { labels: [], datasets: [{ data: [] }] };
  
    // console.log('Data type is:', dataType);
    // console.log('Value type is:', value);
  
    let data;
    let type;
  
    switch (dataType) {
      case "Revenue":
        if (value === "1" && analyticsData.mauCustomer) { data = analyticsData.mauCustomer; type = "monthly"; }
        else if (value === "2" && analyticsData.wauCustomer) { data = analyticsData.wauCustomer; type = "weekly"; }
        else if (value === "3" && analyticsData.dauCustomer) { data = analyticsData.dauCustomer; type = "daily"; }
        break;
      case "Business":
        if (value === "1" && analyticsData.mauBusiness) { data = analyticsData.mauBusiness; type = "monthly"; }
        else if (value === "2" && analyticsData.wauBusiness) { data = analyticsData.wauBusiness; type = "weekly"; }
        else if (value === "3" && analyticsData.dauBusiness) { data = analyticsData.dauBusiness; type = "daily"; }
        break;
      case "Customers":
        if (value === "1" && analyticsData.mauCustomer) { data = analyticsData.mauCustomer; type = "monthly"; }
        else if (value === "2" && analyticsData.wauCustomer) { data = analyticsData.wauCustomer; type = "weekly"; }
        else if (value === "3" && analyticsData.dauCustomer) { data = analyticsData.dauCustomer; type = "daily"; }
        break;
      case "Reviews":
        if (value === "1" && analyticsData.mauReviews) { data = analyticsData.mauReviews; type = "monthly"; }
        else if (value === "2" && analyticsData.wauReviews) { data = analyticsData.wauReviews; type = "weekly"; }
        else if (value === "3" && analyticsData.dauReviews) { data = analyticsData.dauReviews; type = "daily"; }
        break;
      default:
        data = analyticsData.mauCustomer || []; // Fallback to empty array if undefined
        type = "monthly";
    }
  
    // Log the selected data for debugging
    // console.log('Selected data is:', data);
  
    // If data is still undefined, return an empty chart dataset to avoid errors
    if (!data) {
      // console.log(`No data available for ${dataType} with value type ${value}. Returning default empty data.`);
      return { labels: [], datasets: [{ data: [] }] };
    }
  
    return formatData(data, type);
  };
  

  const revenueData = getChartData("Revenue", revValue);
  const businessData = getChartData("Business", businessValue);
  const customerData = getChartData("Customers", customerValue);
  const reviewData = getChartData("Reviews", reviewValue);


  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    fillShadowGradient: Colors.orangeColor, // Solid fill for bars (tomato color)
    fillShadowGradientOpacity: 1, // Solid color with full opacity
    color: (opacity = 1) => `rgba(255, 87, 0, ${opacity})`, // Orange color for labels and other elements
    barPercentage: 0.7, // Wider bars
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeDasharray: "", // Solid lines for grid
      stroke: "#ECECEC", // Set grid lines color to gray
      strokeWidth: 1,
    },
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };



  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
      <View style={[GlobalStyles.container, { backgroundColor: '#F9F9F9' }]}>
        <View style={{
          width: screenWidth - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 20 / 930 * screenHeight
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 / 430 * screenWidth }}>
            <Image source={require('../../../assets/Images/mainIcon.png')}
              style={GlobalStyles.image37}
            />
            <View>
              <Text style={{ fontSize: 24, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                Analytics
              </Text>
              <Text style={{ fontSize: 13, color: 'black', fontFamily: CustomFonts.PoppinsMedium }}>
                Welcome
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.MessagesListScreen)
              }}
            >
              <Image source={require('../../../assets/Images/messageIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push(ScreenNames.NotificationsScreen)
              }}
            >
              <Image source={require('../../../assets/Images/notificationIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{
          width: screenWidth - 60, flexDirection: 'row', justifyContent: 'space-between',
          marginTop: 33 / 930 * screenHeight
        }}>
          {
            menue.map((item) => (
              <TouchableOpacity key={item.id}
                onPress={() => {
                  setSelectedMenu(item)
                }}
              >
                <Text style={[GlobalStyles.text17, { color: selectedMenu.id === item.id ? "black" : '#00000040' }]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))
          }
        </View>
        <View style={{ height: screenHeight * 0.71, width: screenWidth - 30 }}>
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* revenu chart */}

            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              width: screenWidth - 30, marginTop: 50 / 930 * screenHeight
            }}>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#828282' }}>
                  Revenue
                </Text>
                <Text style={{ fontSize: 24, fontFamily: CustomFonts.InterMedium, color: '#000' }}>
                  $40,103.02
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>
                <TouchableOpacity>
                  <View style={{
                    padding: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', alignItems: 'center',
                    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, gap: 7
                  }}>
                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#1E1E1E' }}>
                      Type
                    </Text>
                    <Image source={require('../../../assets/Images/downArrow.png')}
                      style={GlobalStyles.image24}
                    />
                  </View>
                </TouchableOpacity>


                <Dropdown
                  style={[styles.dropdown,]}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  itemTextStyle={{ fontSize: 14 }}
                  //   imageStyle={styles.imageStyle}
                  iconStyle={styles.iconStyle}
                  maxHeight={200}
                  value={revValue}
                  data={revDuration}
                  valueField="value"
                  labelField="lable"
                  //   imageField="image"
                  placeholder=""
                  //   searchPlaceholder="Search..."
                  onChange={e => {
                    setRevValue(e.value);
                  }}
                />
              </View>

            </View>

            <Text style={{
              fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#4F4F4F', alignSelf: 'flex-start',
              marginTop: 10 / 930 * screenHeight
            }}>
              Jan - Jun 2024
            </Text>

            <View style={GlobalStyles.divider}></View>

            <BarChart
              style={{ marginVertical: 8 }}
              data={revenueData}
              width={screenWidth - 50}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={false} // Hide values on top of bars
            />

            {/* business chart  */}

            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              width: screenWidth - 30, marginTop: 50 / 930 * screenHeight
            }}>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#828282' }}>
                  Total Businesses
                </Text>
                <Text style={{ fontSize: 24, fontFamily: CustomFonts.InterMedium, color: '#000' }}>
                  40,103.02
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>

                <Dropdown
                  style={[styles.dropdown,]}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  itemTextStyle={{ fontSize: 14 }}
                  //   imageStyle={styles.imageStyle}
                  iconStyle={styles.iconStyle}
                  maxHeight={200}
                  value={businessValue}
                  data={revDuration}
                  valueField="value"
                  labelField="lable"
                  //   imageField="image"
                  placeholder=""
                  //   searchPlaceholder="Search..."
                  onChange={e => {
                    setBusinessValue(e.value);
                  }}
                />
              </View>

            </View>

            <Text style={{
              fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#4F4F4F', alignSelf: 'flex-start',
              marginTop: 10 / 930 * screenHeight
            }}>
              Jan - Jun 2024
            </Text>

            <View style={GlobalStyles.divider}></View>

            <BarChart
              style={{ marginVertical: 8 }}
              data={businessData}
              width={screenWidth - 50}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={false} // Hide values on top of bars
            />

            <View style={{ marginTop: 30, width: screenWidth - 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#828282', }}>
                Recently Added
              </Text>

              <TouchableOpacity style={{}}>
                <Text style={[GlobalStyles.text12, { color: Colors.orangeColor }]}>
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              style={{ marginTop: 30 / 930 * screenHeight }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recentBusinesses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity >
                  <View style={{
                    height: 108 / 930 * screenHeight, width: 154 / 430 * screenWidth, backgroundColor: 'white',
                    borderRadius: 16, paddingVertical: 13 / 930 * screenHeight, paddingHorizontal: 9 / 430 * screenWidth, marginLeft: 10,
                    flexDirection: 'column', gap: 10 / 930 * screenHeight
                  }}>
                    <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage}
                      style={GlobalStyles.image24}
                    />
                    <Text style={GlobalStyles.text17}>
                      {item.name}
                    </Text>
                    <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                      {item.city ? item.city : ''} {item.state ? ` ,${item.state}` : 'N/A'}
                    </Text>


                  </View>
                </TouchableOpacity>
              )}

            />

            {/* Customer chart */}


            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              width: screenWidth - 30, marginTop: 50 / 930 * screenHeight
            }}>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#828282' }}>
                  Total Customers
                </Text>
                <Text style={{ fontSize: 24, fontFamily: CustomFonts.InterMedium, color: '#000' }}>
                  40,103.02
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>

                <Dropdown
                  style={[styles.dropdown,]}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  itemTextStyle={{ fontSize: 14 }}
                  //   imageStyle={styles.imageStyle}
                  iconStyle={styles.iconStyle}
                  maxHeight={200}
                  value={customerValue}
                  data={revDuration}
                  valueField="value"
                  labelField="lable"
                  //   imageField="image"
                  placeholder=""
                  //   searchPlaceholder="Search..."
                  onChange={e => {
                    setCustomerValue(e.value);
                  }}
                />
              </View>

            </View>

            <Text style={{
              fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#4F4F4F', alignSelf: 'flex-start',
              marginTop: 10 / 930 * screenHeight
            }}>
              Jan - Jun 2024
            </Text>

            <View style={GlobalStyles.divider}></View>

            <BarChart
              style={{ marginVertical: 8 }}
              data={customerData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={false} // Hide values on top of bars
            />

            <View style={{ marginTop: 30, width: screenWidth - 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#828282', }}>
                Recently Registered
              </Text>

              <TouchableOpacity style={{}}>
                <Text style={[GlobalStyles.text12, { color: Colors.orangeColor }]}>
                  View all
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              style={{ marginTop: 30 / 930 * screenHeight }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recentCustomers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity >
                  <View style={{
                    height: 108 / 930 * screenHeight, width: 154 / 430 * screenWidth, backgroundColor: 'white',
                    borderRadius: 16, paddingVertical: 13 / 930 * screenHeight, paddingHorizontal: 9 / 430 * screenWidth, marginLeft: 10,
                    flexDirection: 'column', gap: 10 / 930 * screenHeight
                  }}>
                    <Image source={item.profile_image ? { uri: item.profile_image } : placeholderImage}
                      style={GlobalStyles.image24}
                    />
                    <Text style={GlobalStyles.text17}>
                      {item.name}
                    </Text>
                    <Text style={[GlobalStyles.text12, { color: '#00000050' }]}>
                      {item.city ? item.city : ''} {item.state ? ` ,${item.state}` : 'N/A'}
                    </Text>


                  </View>
                </TouchableOpacity>
              )}

            />


            {/* Review chart */}

            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              width: screenWidth - 30, marginTop: 50 / 930 * screenHeight
            }}>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#828282' }}>
                  Reviews Stat
                </Text>
                <Text style={{ fontSize: 24, fontFamily: CustomFonts.InterMedium, color: '#000' }}>
                  40,103.02
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 / 430 * screenWidth }}>

                <Dropdown
                  style={[styles.dropdown,]}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholderStyle={styles.placeholderStyle}
                  itemTextStyle={{ fontSize: 14 }}
                  //   imageStyle={styles.imageStyle}
                  iconStyle={styles.iconStyle}
                  maxHeight={200}
                  value={reviewValue}
                  data={revDuration}
                  valueField="value"
                  labelField="lable"
                  //   imageField="image"
                  placeholder=""
                  //   searchPlaceholder="Search..."
                  onChange={e => {
                    setReviewValue(e.value);
                  }}
                />
              </View>

            </View>

            <Text style={{
              fontSize: 13, fontFamily: CustomFonts.InterMedium, color: '#4F4F4F', alignSelf: 'flex-start',
              marginTop: 10 / 930 * screenHeight
            }}>
              Jan - Jun 2024
            </Text>

            <View style={GlobalStyles.divider}></View>

            <BarChart
              style={{ marginVertical: 8 }}
              data={reviewData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={false} // Hide values on top of bars
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', width: screenWidth - 30, justifyContent: 'space-between', marginTop: 50 / 930 * screenHeight }}>

              <Text style={[GlobalStyles.text12, { color: '#828282' }]}>Average Yap Score</Text>
              <Text style={{ fontSize: 32, fontFamily: CustomFonts.InterMedium, }}>700</Text>


            </View>




            <Text style={[GlobalStyles.text12, { color: '#828282', marginTop: 30 / 930 * screenHeight }]}>Total Disputes</Text>
            <Text style={styles.totalCount}>{totalDisputes}</Text>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={[styles.legendItem, { backgroundColor: Colors.orangeColor }]} />
              <Text style={[GlobalStyles.text14]}>Opened</Text>
              <View style={[styles.legendItem, { backgroundColor: "#222222", marginLeft: 20 }]} />
              <Text style={[GlobalStyles.text14]}>Closed</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${openedPercentage}%`, backgroundColor: Colors.orangeColor }]} />
              <View style={[styles.progressBar, { width: `${closedPercentage}%`, backgroundColor: "#222222" }]} />
            </View>

            {/* Opened and Closed Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Total Opened</Text>
                <Text style={styles.summaryCount}>{opened}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Total Closed</Text>
                <Text style={styles.summaryCount}>{closed}</Text>
              </View>
            </View>




            <Text style={[GlobalStyles.text12, { color: '#828282', marginTop: 30 / 930 * screenHeight }]}
            >Total Settlements
            </Text>
            <Text style={styles.totalCount}>{totalDisputes}</Text>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={[styles.legendItem, { backgroundColor: Colors.orangeColor }]} />
              <Text style={[GlobalStyles.text14]}>Opened</Text>
              <View style={[styles.legendItem, { backgroundColor: "#222222", marginLeft: 20 }]} />
              <Text style={[GlobalStyles.text14]}>Closed</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${openedPercentage}%`, backgroundColor: Colors.orangeColor }]} />
              <View style={[styles.progressBar, { width: `${closedPercentage}%`, backgroundColor: "#222222" }]} />
            </View>

            {/* Opened and Closed Summary */}
            <View style={[styles.summaryContainer, { marginBottom: 100 }]}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Total Opened</Text>
                <Text style={styles.summaryCount}>{opened}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Total Closed</Text>
                <Text style={styles.summaryCount}>{closed}</Text>
              </View>
            </View>

          </ScrollView>
        </View>


      </View>
    </SafeAreaView>

  )
}

export default AdminAnalyticsMainScreen

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  totalDisputesText: {
    fontSize: 16,
    color: 'gray',
  },
  totalCount: {
    marginTop: 10,
    fontSize: 24,
    fontFamily: CustomFonts.InterSemibold,
    color: '#000',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  legendItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 25,
    // borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  summaryBox: {
    backgroundColor: '#00000006',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
  },
  summaryTitle: {
    fontSize: 14,
    color: 'gray',
    fontFamily: CustomFonts.InterMedium,
    marginBottom: 5,
  },
  summaryCount: {
    fontSize: 24,
    fontFamily: CustomFonts.InterSemibold,
    color: '#000',
  },
  Input: {
    color: 'red',
  },
  dropdown: {
    // marginTop: 10,
    height: 40,
    width: 100 / 430 * screenWidth,
    // backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6'
  },
  //currently not using placeholder
  // placeholderStyle: {
  //     fontSize: 10,
  //     color: 'red'
  // },
  selectedTextStyle: {
    fontSize: 14 / 930 * screenHeight,
    fontWeight: '500',
    fontFamily: CustomFonts.InterMedium
    // marginLeft: 8,
    // backgroundColor: 'red'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
