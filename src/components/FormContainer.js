import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { HEIGHT, WIDTH } from '../utils/dimension'
import { BLACK, GOLD } from '../utils/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

const FormContainer = ({children}) => {
    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{  }}
                    showsVerticalScrollIndicator={false}>
                    {children}
                </KeyboardAwareScrollView>
            </View>
        </View>
    )
}

export default FormContainer

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: hp('55%'),
        backgroundColor: GOLD,
        borderTopStartRadius: HEIGHT * .03,
        borderTopEndRadius: HEIGHT * .03,
        paddingTop: 5
    },
    childContainer: {
        width: WIDTH,
        height: hp('55%'),
        backgroundColor: BLACK,
        borderTopStartRadius: HEIGHT * .03,
        borderTopEndRadius: HEIGHT * .03,
        paddingHorizontal:10
    }
})