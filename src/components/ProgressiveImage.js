import React, { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import FastImage from 'react-native-fast-image';
import { WHITE } from '../utils/Colors';
import { UBUNTU } from '../utils/Fonts';

const ProgressiveImage = ({ remoteUrl, width, height, customStyle={}, customImageStyle={} }) => {

    const [loading, setLoading] = React.useState(false);
    const [percentage, setPercentage] = React.useState(0);

    return (
        <>
            {loading && <View style={{ ...styles.preloader, width, height, borderRadius: 5, ...customStyle }}>
                <Text style={{ color: WHITE, fontFamily: UBUNTU.bold }}>{percentage.toFixed(0)}%</Text>
            </View>}
            <View style={{ width, height }}>
                <FastImage 
                    source={{ 
                        uri: remoteUrl
                    }}
                    style={{ ...styles.imageStyle,...customImageStyle }}
                    onLoadStart={() => {
                        setLoading(true);
                    }}
                    onLoadEnd={() => {
                        setLoading(false);
                    }}
                    onProgress={(e) => {
                        let loaded = ((Math.round(e.nativeEvent.loaded) / e.nativeEvent.total) * 100)
                        setPercentage(loaded)
                    }}
                />
            </View>

        </>

    )
}

export default ProgressiveImage

const styles = StyleSheet.create({
    imageStyle: {
        width: null,
        height: null,
        flex: 1,
        borderRadius: 5
    },
    preloader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(176, 175, 172,0.4)",
        justifyContent: 'center',
        alignItems: 'center'
    }
})