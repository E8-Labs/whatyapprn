import { CustomFonts } from "../font/Fonts"
import { screenHeight, screenWidth } from "../../res/Constants"
import { Colors } from "../../res/Colors"

export const GlobalStyles = {
    container: {
        height: screenHeight,
        width: screenWidth,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    rectButton: {
        backgroundColor: Colors.orangeColor,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15

    },
    capsuleBtn: {
        backgroundColor: Colors.orangeColor,
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderRadius: 15,
        width: screenWidth - 40,
        alignItems: 'center',
        marginTop: 30 / 930 * screenHeight
    },
    BtnText: {
        fontSize: 17 / 930 * screenHeight,
        fontFamily: CustomFonts.InterMedium
        , color: 'white'
    },
    heading: {
        fontSize: 30 / 930 * screenHeight,
        marginTop: 20 * screenHeight / 930,
        width: screenWidth - 50,
        fontFamily: CustomFonts.PoppinsMedium,
        textAlign: 'left'
    },
    heading24: {
        fontSize: 24 / 930 * screenHeight,
        marginTop: 20 * screenHeight / 930,
        width: screenWidth - 50,
        fontFamily: CustomFonts.PoppinsMedium,
        textAlign: 'left',
        color: "#000"

    },
    subheading: {
        fontSize: 17 / 930 * screenHeight,
        marginTop: 20 * screenHeight / 930,
        width: screenWidth - 50,
        fontFamily: CustomFonts.InterMedium,
        color: Colors.lightBlack,
        textAlign: 'left',

    },
    subheading14: {
        fontSize: 14 / 930 * screenHeight,
        // marginTop: 20 * screenHeight / 930,
        width: screenWidth - 50,
        fontFamily: CustomFonts.InterMedium,
        color: Colors.lightBlack,
        textAlign: 'left',

    },
    text17: {
        fontSize: 17 / 930 * screenHeight,
        // marginTop: 20 * screenHeight / 930,
        // width: screenWidth - 50,
        fontFamily: CustomFonts.InterMedium,
        color: Colors.lightBlack,
        textAlign: 'left',
    },
    input: {
        backgroundColor: Colors.lightGray,
        paddingVertical: 16 / 930 * screenHeight,
        paddingHorizontal: 10 / 430 * screenWidth,
        width: screenWidth - 40

    },
    image24: {
        height: 24 / 930 * screenHeight,
        width: 24 / 930 * screenHeight,
        resresizeMode: 'contain',
    },
    image37: {
        height: 37 / 930 * screenHeight,
        width: 37 / 930 * screenHeight,
        resresizeMode: 'contain',
        borderRadius:20
    },
    completeProfileTopBar: {
        width: screenWidth - 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10 / 930 * screenHeight

    },
    popupBtn: {
        height: 135 / 930 * screenHeight,
        width: 135 / 430 * screenWidth,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grayColor,
        borderRadius: 10,
        justifyContent: 'center'
    }, text14: {
        fontSize: 14,
        fontFamily: CustomFonts.InterMedium
    },
    text14Intria: {
        fontSize: 14,
        fontFamily: CustomFonts.IntriaRegular
    },
    divider: {
        width: screenWidth - 40,
        height: 1,
        backgroundColor: '#EAEAEA',
        marginTop: 15 / 930 * screenHeight
    },
    yIcon: {
        height: 14, width: 8
    }, errorText: {
        fontFamily: CustomFonts.InterMedium,
        fontSize: 15,
        color: 'red',
        alignSelf:'flex-start'
    }, logoImage: {
        height: 28 / 930 * screenHeight,
        width: 140 / 430 * screenWidth,
        alignSelf: 'flex-start',
    },
    text12:{
        fontSize:12,
        fontFamily:CustomFonts.InterMedium,
        color:'#00000090'
    }

}