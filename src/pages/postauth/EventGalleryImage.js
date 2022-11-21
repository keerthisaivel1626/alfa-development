import { StyleSheet, View, Platform, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import { getFocusedRouteNameFromRoute, useFocusEffect } from '@react-navigation/native';
import ProgressiveImage from '../../components/ProgressiveImage';
import { BASE_BLACK, WHITE } from '../../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const statusBarHeight = StatusBar.currentHeight;

const EventGalleryImage = ({ navigation, route }) => {
    const { imageUrl } = route.params;
    const { width, height } = Dimensions.get('screen');
    const goBack = () => navigation.goBack();
    return (
        <View style={{ backgroundColor: BASE_BLACK }}>
            <View style={styles.header}>
                <Feather onPress={goBack} name='chevron-left' size={hp(8)} color={WHITE} />
            </View>
            <ProgressiveImage
                remoteUrl={imageUrl}
                height={height}
                width={width}
                customImageStyle={{
                    borderRadius: 0,
                    resizeMode: 'contain'
                }}
            />
        </View>

        // <View style={styles.container}>
        //     {/* <Image resizeMode='contain' source={{ uri: imageUrl }} style={styles.imageStyle} /> */}
        //     <ProgressiveImage 
        //         remoteUrl={imageUrl}
        //         height={height}
        //         width={width}
        //     />
        // </View>
    )
}

export default EventGalleryImage

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageStyle: {
        width: null,
        height: null,
        flex: 1
    },
    header: {
        top: Platform.select({
            ios: hp(5),
            android: statusBarHeight
        }),
        position: 'absolute',
        zIndex: 999
    }
})