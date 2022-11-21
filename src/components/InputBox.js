import React from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ACCENT_BLUE, ERROR_RED, GOLD, GRAY, WHITE } from '../utils/Colors';
import { INDIA_FLAG } from '../utils/imapgepath';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { UBUNTU } from '../utils/Fonts';
import { REGULAR, SMALL } from '../utils/NormalizeFont';

export const DropDownInput = ({ value, onChangeText, errorStyle={} }) => {
 console.log("onchange=>",onChangeText,"val",value)
  return (
    <View style={{...styles.container,...errorStyle}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Image source={INDIA_FLAG} style={styles.flag} />
        <EvilIcons name='chevron-down' size={hp(4)} color={GOLD} />
        <View style={styles.divider} />
      </View>
      <TextInput
        maxLength={10}
        keyboardType='number-pad'
        style={styles.inputBox}
        returnKeyType={'done'}
        returnKeyLabel={'Close'}
        value={value}
        onChangeText={onChangeText}
        
      />
    </View>
  )
}

export const CircularInput = React.forwardRef(({ value, onChangeText, onKeyPress,errorStyle={} }, ref) => {
  return (
    <TextInput
      maxLength={1}
      keyboardType='number-pad'
      style={{...styles.circularInputBox,...errorStyle}}
      returnKeyType={'next'}
      returnKeyLabel={'Close'}
      value={value}
      onChangeText={onChangeText}
      ref={ref}
      // onKeyPress={({ nativeEvent }) => {
      //   onKeyPress(nativeEvent.key)
      //   // nativeEvent.key === 'Backspace' 
      // }}
      onKeyPress={onKeyPress}
    />
  )
});



export const InputBox = ({ keyboardType = 'default', value, onChangeText,customStyle={},editable=true,errorStyle={} }) => {
  return (
    <TextInput
      keyboardType={keyboardType}
      style={{...styles.generalInputBox,...customStyle,...errorStyle}}
      returnKeyType={'done'}
      returnKeyLabel={'Close'}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: GRAY,
    borderRadius: 50,
    flexDirection: 'row',
    paddingHorizontal: 15,
    overflow: 'hidden'
  },
  generalInputBox: {
    height: 50,
    borderRadius: 25,
    backgroundColor: GRAY,
    color: WHITE,
    paddingLeft: 16,
    fontFamily: UBUNTU.regular
  },
  flag: {
    width: hp(4),
    height: hp(4),
    resizeMode: 'contain'
  },
  divider: {
    height: 50,
    width: wp(.5),
    backgroundColor: ACCENT_BLUE
  },
  inputBox: {
    flex: 1,
    paddingLeft: hp(3),
    color: WHITE,
    fontFamily: UBUNTU.bold,
    fontSize: SMALL
  },
  circularInputBox: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: GRAY,
    textAlign: 'center',
    color: WHITE
  }
})