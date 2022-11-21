import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native'
import React from 'react'
import { HEIGHT, WIDTH } from '../utils/dimension'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { APP_DARK_THEME } from '../utils/Colors';

const statusBarHeight = StatusBar.currentHeight;

const CommonHeader = ({ leftComp, righComp }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.pageDetailsContainer}>
                {leftComp}
                {righComp}
            </View>
        </View>
    )
}

export default CommonHeader

const styles = StyleSheet.create({
    overlay: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: APP_DARK_THEME,
        ...StyleSheet.absoluteFillObject,
    },
    pageDetailsContainer: {
        width: '100%',
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.select({
            ios:hp(5),
            android:0
        }),
        zIndex:1
    },
})