import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';

const SpinnerComponent = ({visible,textContent='Loading...'}) => {
    return (
        <Spinner
            visible={visible}
            textContent={textContent}
        />
    )
}

export default SpinnerComponent

const styles = StyleSheet.create({})