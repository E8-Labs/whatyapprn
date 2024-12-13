import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { CustomFonts } from '../../assets/font/Fonts'
import { Colors } from '../../res/Colors'

const ResourcesDetailScreen = () => {

    const profileImage = require('../../assets/Images/profileImage.png')

    const comments = [
        {
            id: 1,
            image: profileImage,
            name: 'David Nick',
            comment: 'Reading this article was an eye-opener for me. I realized I need to work on my listening skills to truly connect with my partner. Thank you for these valuable insights!'
        }, {
            id: 2,
            image: profileImage,
            name: 'David Nick',
            comment: 'Reading this article was an eye-opener for me. I realized I need to work on my listening skills to truly connect with my partner. Thank you for these valuable insights!'
        }, {
            id: 3,
            image: profileImage,
            name: 'David Nick',
            comment: 'Reading this article was an eye-opener for me. I realized I need to work on my listening skills to truly connect with my partner. Thank you for these valuable insights!'
        }, {
            id: 4,
            image: profileImage,
            name: 'David Nick',
            comment: 'Reading this article was an eye-opener for me. I realized I need to work on my listening skills to truly connect with my partner. Thank you for these valuable insights!'
        },
    ]
    return (
        <SafeAreaView style={{ alignItems: 'center' }}>
            <View style={{ width: screenWidth - 40, alignItems: 'center', flexDirection: 'column', gap: 15 / 930 * screenHeight }}>
                <Image source={require('../../assets/Images/logo.png')}
                    style={GlobalStyles.logoImage}
                />
                <View style = {{height:screenHeight*0.85}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ alignItems: 'center', flexDirection: 'column', gap: 15 / 930 * screenHeight }}>
                            <Image source={require('../../assets/Images/slideImage.png')}
                                style={{ width: screenWidth - 40, height: 277 / 930 * screenHeight, borderRadius: 10, marginTop: 10 }}
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: screenWidth - 40 }}>
                                <Image source={require('../../assets/Images/profileImage.png')}
                                    style={{ height: 50 / 930 * screenHeight, width: 50 / 930 * screenHeight, resizeMode: 'contain', borderRadius: 25 }}
                                />

                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 / 930 * screenHeight }}>
                                    <Text style={[GlobalStyles.text17, { width: 218 / 430 * screenWidth }]}>
                                        Dr. Emily Richardson
                                    </Text>

                                    <Text style={{ fontSize: 13, fontFamily: CustomFonts.InterMedium }}>
                                        Jan 12 . 4 min read
                                    </Text>
                                </View>

                                <TouchableOpacity>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 / 430 * screenWidth }}>
                                        <Text style={GlobalStyles.text14}>
                                            Share
                                        </Text>
                                        <Image source={require('../../assets/Images/shareIcon.png')}
                                            style={GlobalStyles.image24}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={[GlobalStyles.heading24, { width: screenWidth - 40 }]}>
                                The Art of Constructive Criticism
                            </Text>
                            <Text style={[GlobalStyles.text17, { color: '#00000090' }]}>
                                Writing a business review can feel like a balancing act. On one hand, you want to share your honest experience to help other consumers make informed decisions. On the other hand, your feedback can significantly impact a business’s reputation and operations. Mastering the art of constructive criticism can ensure your review is both helpful and fair.
                            </Text>

                            <Text style = {{fontSize:18,fontFamily:CustomFonts.PoppinsMedium,alignSelf:'flex-start'}}>
                                Comments ({comments.length})
                            </Text>

                            {
                                comments.map((item) => (
                                    <View key={item.id} style={{
                                        flexDirection: 'column', alignItems: 'center', backgroundColor: "white", borderWidth: 1,
                                        borderRadius: 10, borderColor: Colors.grayColor, padding: 15, width: screenWidth - 40, gap: 15 / 930 * screenHeight
                                    }}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', gap: 12 / 430 * screenWidth, alignItems: 'center' }}>
                                            <Image source={item.image}
                                                style={{ height: 46 / 930 * screenHeight, width: 46 / 930 * screenHeight, borderRadius: 25 }}
                                            />
                                            <Text style={GlobalStyles.text17}>
                                                {item.name}
                                            </Text>
                                        </View>

                                        <Text style={GlobalStyles.text14}>
                                            {item.comment}
                                        </Text>
                                    </View>
                                ))
                            }

                            <View style = {{flexDirection:'row',alignItems:'center',gap:10/430*screenWidth}}>
                                <TextInput 
                                    placeholder='Leave comment'
                                    style = {[GlobalStyles.input,{width:310/430*screenWidth}]}
                                />
                                <TouchableOpacity>
                                    <Image source={require('../../assets/Images/orangeSendIcon.png')} 
                                        style = {{height:52/930*screenHeight,width:52/930*screenHeight,resizeMode:'contain'}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ResourcesDetailScreen