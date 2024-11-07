import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyles } from '../../assets/styles/GlobalStyles'
import { screenHeight, screenWidth } from '../../res/Constants'
import { Colors } from '../../res/Colors'



const AddReviewMainScreen = ({ visible, closeModal ,handleBtnPress}) => {


  return (
  //   <Modal
  //     transparent={true}
  //     visible={visible}
  //     animationType='slide'
  //   >
      // <View style={[GlobalStyles.container, { backgroundColor: '#00000055', justifyContent: 'flex-end' }]}>
        <View style={{
          width: screenWidth, alignItems: 'center', backgroundColor: 'transparent', alignItems:'flex-start',
          height:310/930*screenHeight,//backgroundColor:'green',
        }}>
          <View style  = {{
            backgroundColor:'white',width:screenWidth,alignItems:'center',borderTopStartRadius: 30,
            height: 200/930*screenHeight, padding: 30, borderTopEndRadius: 30,justifyContent:'flex-start'
            }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }}
              onPress={() => {
                closeModal()
              }}
            >
              <Image source={require('../../assets/Images/crossIcon.png')}
                style={GlobalStyles.image24}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handleBtnPress("customer")}>
              <Text style={[GlobalStyles.BtnText, { color: 'black', marginTop: 20 / 930 * screenHeight }]}>
                Add New Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handleBtnPress("review")}>
              <Text style={[GlobalStyles.BtnText, { color: Colors.orangeColor, marginTop: 50 / 930 * screenHeight }]}>
                New Review
              </Text>
            </TouchableOpacity>
          </View>
        </View>


      // </View>
    // </Modal>
  )
}

export default AddReviewMainScreen