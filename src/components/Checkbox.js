import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { WHITE } from '../utils/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { VERY_SMALL_VERTICAL_SPACE } from '../utils/space';
import { UBUNTU } from '../utils/Fonts';
const Checkbox = ({label,isSelected,onCheckBoxPress}) => {
    return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:WHITE,fontFamily:UBUNTU.medium}}>{label}</Text>
            <View style={{width:VERY_SMALL_VERTICAL_SPACE}} />
            <TouchableOpacity onPress={onCheckBoxPress} style={styles.box}>
                {isSelected && <AntDesign name='check' size={10} />}
            </TouchableOpacity>
        </View>

    )
}

export default Checkbox

const styles = StyleSheet.create({
    box: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: WHITE
    }
})