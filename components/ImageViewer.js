import ImageView from "react-native-image-viewing";


export const ImageViewer = ({visible,close,url}) => {
// console.log("Image Url in viewer ", url)
    return (


        <ImageView
            images={[{uri: url}]}
            imageIndex={0}
            visible={visible}
            onRequestClose={close}
            swipeToCloseEnabled = {true}
            doubleTapToZoomEnabled = {true}
        />
    )
}
