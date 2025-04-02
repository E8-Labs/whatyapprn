import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { CustomFonts } from '../../assets/font/Fonts'
import { screenHeight, screenWidth } from '../../res/Constants'
import { Colors } from '../../res/Colors'

const LearnMore = ({ navigation }) => {
  return (
    <SafeAreaView>

      <View style={{
        alignSelf: "center", flexDirection: 'column', alignItems: 'center', gap: 20,
        marginTop: 20, width: screenWidth - 40,

      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{ alignSelf: 'flex-start',marginBottom:20 }}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Image source={require('../../assets/Images/backArrow.png')}

              style={GlobalStyles.image24}
            />
          </TouchableOpacity>

          <View style={{
            width: '100%', alignItems: 'flex-start', textAlign: 'left', flexDirection: 'column',
            gap: 20,
          }}>
            <Text style={styles.heading}>
              🏆 How to Rank Higher on WhatYap: A Guide for Business Users
            </Text>

            <Text style={styles.body}>
              Want your business to stand out on WhatYap? The higher your rank, the more visibility, trust, and engagement you’ll earn. Here’s how to boost your business ranking on WhatYap:

            </Text>


            <Text style={styles.subHeading}>
              ✅ 1. Post Reviews of Your Customers
            </Text>

            <Text style={styles.body}>
              Your voice matters! Businesses that share feedback on their customer experiences demonstrate transparency and active participation in the community. Posting reviews shows you're engaged, professional, and fair—which builds trust and improves your ranking.
            </Text>

            <Text style={styles.subHeading}>
              👥 2. Add Your Customers to the Platform
            </Text>

            <Text style={styles.body}>
              The more verified interactions your business has on WhatYap, the stronger your presence becomes. This not only builds credibility, but also helps create a full picture of your customer relationships.
            </Text>

            <Text style={styles.subHeading}>
              🏢 3. Complete Your Business Profile
            </Text>

            <Text style={styles.body}>
              An incomplete profile can hold your business back. Make sure your profile includes all your details
            </Text>

            <Text style={styles.body}>
              A full profile signals professionalism and increases the chances of ranking higher in search results.
            </Text>

            <Text style={styles.subHeading}>
              📸 4. Add Media Files to Your Profile
            </Text>

            <Text style={styles.body}>
              Photos and videos make your business more relatable and real. Upload media that showcases your products, services, team, or customer interactions. This helps both customers and the platform trust your authenticity.
            </Text>


          </View>
        </ScrollView>

      </View>
    </SafeAreaView >
  )
}

export default LearnMore

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: CustomFonts.InterBold,
  }, subHeading: {
    fontSize: 18,
    fontFamily: CustomFonts.InterMedium,
  }, body: {
    fontSize: 15,
    fontFamily: CustomFonts.InterRegular,
    color: Colors.lightBlack
  }
})