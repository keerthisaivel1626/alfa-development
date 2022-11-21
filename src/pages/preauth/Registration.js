import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
const Registration = () => {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#6a51ae' }]}>
            <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
            <Text style={{ color: '#fff' }}>Registration</Text>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#6a51ae'
    }
})

export default Registration