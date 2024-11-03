import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native'
import React, { useState } from 'react'
import { screenWidth, screenHeight } from '../res/Constants'
import { GlobalStyles } from '../assets/styles/GlobalStyles'
import { Colors } from '../res/Colors'
import { CustomFonts } from '../assets/font/Fonts'
import { ScreenNames } from '../res/ScreenNames'

const ResourcesContainer = ({ navigation }) => {

    const resImage = require('../assets/Images/slideImage.png')

    const [currentIndex, setCurrentIndex] = useState(0)


    const slideImages = [
        {
            id: 1,
            banner: 'Sliding Banner Description content here',
            image: resImage
        },
        {
            id: 2,
            banner: 'Sliding Banner Description content here',
            image: resImage
        },
        {
            id: 3,
            banner: 'Sliding Banner Description content here',
            image: resImage
        },
        {
            id: 4,
            banner: 'Sliding Banner Description content here',
            image: resImage
        },
    ]


    const resources = [
        {
            id: 1,
            image: resImage,
            name: 'The Art of Constructive Criticism',
            desc: 'How to Write a Business Review That Helps Both Consumers and Owners',
            date: 'Jan 12 . 4 min read'
        },
        {
            id: 2,
            image: resImage,
            name: 'The Art of Constructive Criticism',
            desc: 'How to Write a Business Review That Helps Both Consumers and Owners',
            date: 'Jan 12 . 4 min read'
        },
        {
            id: 3,
            image: resImage,
            name: 'The Art of Constructive Criticism',
            desc: 'How to Write a Business Review That Helps Both Consumers and Owners',
            date: 'Jan 12 . 4 min read'
        },
        {
            id: 4,
            image: resImage,
            name: 'The Art of Constructive Criticism',
            desc: 'How to Write a Business Review That Helps Both Consumers and Owners',
            date: 'Jan 12 . 4 min read'
        },
        {
            id: 5,
            image: resImage,
            name: 'The Art of Constructive Criticism',
            desc: 'How to Write a Business Review That Helps Both Consumers and Owners',
            date: 'Jan 12 . 4 min read'
        },
        {
            id: 6,
            image: resImage,
            name: 'The Art of Constructive Criticism',
            desc: 'How to Write a Business Review That Helps Both Consumers and Owners',
            date: 'Jan 12 . 4 min read'
        },
    ]

    const getItemlayout = (index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index: index
    })

    return (
        <View style = {{height:screenHeight*0.59}}>
            <ScrollView showsVerticalScrollIndicator = {false}>
                <View style={{ height: 200 / 930 * screenHeight, }}>
                    <ScrollView

                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        getItemlayout={getItemlayout}
                        onScroll={(event) => {
                            const { x } = event.nativeEvent.contentOffset;
                            // setCurrentIndex(Math.round(x / width));
                            // console.log('x value is', Math.round(x / screenWidth))
                            setCurrentIndex(Math.round(x / screenWidth))
                        }}
                    >

                        {
                            slideImages.map((item) => (
                                <View key={item.id}>
                                    <ImageBackground key={item.id} source={item.image}
                                        style={{
                                            width: screenWidth - 40, height: 200 / 930 * screenHeight, borderRadius: 20,
                                            padding: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'
                                        }}>

                                        <Text style={[GlobalStyles.text17, { color: 'white', width: 230 / 430 * screenWidth }]}>
                                            {
                                                item.banner
                                            }
                                        </Text>
                                        <View style={{ flexDirection: 'row', gap: 5 }}>
                                            {
                                                slideImages.map((item) => (
                                                    <View key={item.id} style={{ height: 6, width: 6, borderRadius: 4, backgroundColor: currentIndex + 1 === item.id ? "white" : 'gray' }}></View>
                                                ))
                                            }
                                        </View>

                                    </ImageBackground>
                                </View>

                            ))
                        }

                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'column', gap: 10, }}>
                    {
                        resources.map((item) => (
                            <TouchableOpacity key={item.id}
                                onPress={() => {
                                    navigation.push(ScreenNames.ResourcesDetailScreen)
                                }}
                            >
                                <View style={{
                                    marginTop: 15 / 930 * screenHeight, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row',
                                    borderWidth: 1, borderRadius: 10, borderColor: Colors.grayColor, padding: 20
                                }}>
                                    <Image source={item.image}
                                        style={{ height: 110 / 930 * screenHeight, width: 110 / 930 * screenHeight, borderRadius: 6 }}
                                    />
                                    <View style={{ alignItems: 'center', flexDirection: 'column', gap: 8, width: 214 / 430 * screenWidth }}>
                                        <Text style={[GlobalStyles.text17]}>
                                            {item.name}
                                        </Text>
                                        <Text numberOfLines={3} style={[GlobalStyles.text14, { color: '#00000090' }]}>
                                            {item.desc}
                                        </Text>
                                        <Text style={{ fontSize: 12, fontFamily: CustomFonts.InterMedium, alignSelf: 'flex-start' }}>
                                            {item.date}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        ))
                    }

                </View>
            </ScrollView>
        </View>

    )
}

export default ResourcesContainer