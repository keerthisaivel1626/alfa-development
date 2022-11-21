import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, Pressable, Keyboard } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { Button } from '../../components/Button';
import FormContainer from '../../components/FormContainer';
import { ERROR_RED, FADE_GRAY, GOLD, GRAY, OFF_WHITE, PRIMARY_RED, WHITE } from '../../utils/Colors';
import { HEIGHT, WIDTH } from '../../utils/dimension';
import { INTER, UBUNTU, VIGA } from '../../utils/Fonts';
import { SPLASH, ALFA_NETWORK } from '../../utils/imapgepath'
import { REGULAR, SMALL, VERY_SMALL } from '../../utils/NormalizeFont';
import { VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import Feather from 'react-native-vector-icons/Feather';
import { CircularInput } from '../../components/InputBox';
import { changeAuthStatus, storeLoginResponse } from '../../redux/reducers/AuthReducer';
import { PATCHAPI } from '../../utils/Network';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import { showMessage } from "react-native-flash-message";
import { Formik } from 'formik';



const VerifyOtp = ({ navigation, }) => {

    const dispatch = useDispatch();
    const TIMER = 10
    const [timer, setTimer] = useState(TIMER);
    
    const [loading, setLoading] = useState(false);

    const [otpOne, setotpOne] = useState('');
    const [otpTwo, setotpTwo] = useState('');
    const [otpThree, setotpThree] = useState('');
    const [otpFour, setotpFour] = useState('');

    const otpOneRef = React.useRef(null);
    const otpTwoRef = React.useRef(null);
    const otpThreeRef = React.useRef(null);
    const otpFourRef = React.useRef(null);

   // const { mobile } = route.params;
   const mobile=8754775937;


    let schema = yup.object().shape({
        otpOne:     yup.string().required("Please enter the otp"),
        otpTwo:     yup.string().required("Please enter the otp"),
        otpThree:   yup.string().required("Please enter the otp"),
        otpFour:    yup.string().required("Please enter the otp")
    });

    React.useEffect(() => {
        let interval = setInterval(function () {
            if (timer > 0) {
                setTimer((prev) => prev - 1);
            }
            if (timer == 0) {
                clearInterval(interval)
            };
        }, 1000);

        return () => {
            clearInterval(interval)
        };
    }, [timer])

    const loginWithOtp = async (otpOne, otpTwo,  otpThree, otpFour) => {
        Keyboard.dismiss();
        setLoading(true);
        let dataObj = { mobile, otp: `${otpOne}${otpTwo}${otpThree}${otpFour}` }
        try {
            let requestOTPRes = await PATCHAPI('user/loginWithOtp?_format=json', dataObj);
            let { data } = requestOTPRes;
            // console.log("'user/loginWithOtp?_format=json--->", data);
            setLoading(false);
            if (data.code == 200 && data.status == "success") {
                let obj = {
                    userId:data.data.ID,
                    token:data.data.ACCESS_TOKEN
                }
                await AsyncStorage.setItem('responseAfterLogin', JSON.stringify(obj))
                dispatch(changeAuthStatus(true));
                // dispatch(storeLoginResponse(data.data));
            } else if (data.code == 200 && data.status == "error") {
                showMessage({ 
                    message: data.message, 
                    type: 'danger',
                    style: {
                        alignItems: 'center'
                    } 
                })
            } else {
                return false;
            }
        } catch (error) {
            // console.log("'user/loginWithOtp?_format=json--->", error);
            setLoading(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle='light-content' />
            <Image source={SPLASH} style={styles.backgroundImage} />
            <Image source={ALFA_NETWORK} style={styles.logoImage} />
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Formik
                    initialValues={{
                        otpOne: "",
                        otpTwo: "",
                        otpThree: "",
                        otpFour: ""
                    }}
                    validationSchema={schema}
                    onSubmit={(values, action) => {
                        loginWithOtp(values.otpOne,values.otpTwo,values.otpThree,values.otpFour);
                        action.resetForm();
                    }}
                >
                    {({ errors, touched, handleSubmit, handleChange, isValid, values, handleBlur, dirty }) => {
                        return (
                            <FormContainer>
                                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.headerLabel}>Verification Code</Text>
                                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.description}>
                                    We have sent the verification code to Your Mobile Number
                                </Text>

                                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                    <Text style={styles.mobileNumber}>
                                        +91 {mobile}
                                    </Text>
                                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                    <Pressable onPress={() => navigation.navigate('Login')} style={styles.circle}>
                                        <Feather name={'edit-3'} color={WHITE} size={hp(2)} />
                                    </Pressable>
                                </View>

                                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <CircularInput
                                        value={values.otpOne}
                                        onChangeText={handleChange('otpOne')}
                                        ref={otpOneRef}
                                        errorStyle={(dirty && touched?.otpOne && errors.otpOne)
                                            || (!dirty && errors.otpOne)
                                            ? {
                                                borderWidth: 1,
                                                borderColor: ERROR_RED
                                            } : {}}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key != 'Backspace') {
                                                otpTwoRef.current.focus()
                                            }
                                        }}
                                    />
                                    <CircularInput
                                        value={values.otpTwo}
                                        onChangeText={handleChange('otpTwo')}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key == 'Backspace') {
                                                otpOneRef.current.focus()
                                            }else{
                                                otpThreeRef.current.focus()
                                            }
                                        }}
                                        errorStyle={(dirty && touched?.otpTwo && errors.otpTwo)
                                            || (!dirty && errors.otpTwo)
                                            ? {
                                                borderWidth: 1,
                                                borderColor: ERROR_RED
                                            } : {}}
                                        ref={otpTwoRef}
                                    />
                                    <CircularInput
                                        value={values.otpThree}
                                        onChangeText={handleChange('otpThree')}
                                        ref={otpThreeRef}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key == 'Backspace') {
                                                otpTwoRef.current.focus()
                                            }else{
                                                otpFourRef.current.focus()
                                            }
                                        }}
                                        errorStyle={(dirty && touched?.otpThree && errors.otpThree)
                                            || (!dirty && errors.otpThree)
                                            ? {
                                                borderWidth: 1,
                                                borderColor: ERROR_RED
                                            } : {}}
                                    />
                                    <CircularInput
                                        value={values.otpFour}
                                        ref={otpFourRef}
                                        onChangeText={handleChange('otpFour')}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key == 'Backspace') {
                                                otpThreeRef.current.focus()
                                            }
                                        }}
                                        errorStyle={(dirty && touched?.otpFour && errors.otpFour)
                                            || (!dirty && errors.otpFour)
                                            ? {
                                                borderWidth: 1,
                                                borderColor: ERROR_RED
                                            } : {}}
                                    />
                                </View>
                                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    {<Text style={{ color: WHITE, fontFamily: INTER.regular }}>
                                        00:{timer < 10 ? `0${timer}` : timer}
                                    </Text>}
                                    <Text
                                        onPress={() => {
                                            setTimer(TIMER);
                                        }}
                                        style={{ color: timer == 0 ? WHITE : GRAY, fontFamily: INTER.regular }}>
                                        Resend
                                    </Text>
                                </View>
                                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                <Button
                                    title={'Submit'}
                                    customStyle={{
                                        height: 60,
                                        backgroundColor: PRIMARY_RED,
                                        borderRadius: 50
                                    }}
                                    shadowStatus={true}
                                    titleStyle={{
                                        color: WHITE,
                                        fontSize: SMALL,
                                        fontFamily: VIGA.regular
                                    }}
                                    onPress={handleSubmit}
                                    isLoading={loading}
                                />
                            </FormContainer>
                        )
                    }}

                </Formik>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: WIDTH,
        height: HEIGHT
    },
    logoImage: {
        alignSelf: 'center',
        width: WIDTH * .4,
        resizeMode: 'contain'
    },
    formContainer: {
        width: WIDTH,
        height: HEIGHT * .5,
        backgroundColor: 'red'
    },
    headerLabel: {
        fontSize: REGULAR,
        alignSelf: 'center',
        color: GOLD,
        fontFamily: VIGA.regular
    },
    description: {
        fontSize: SMALL,
        alignSelf: 'center',
        color: FADE_GRAY,
        fontFamily: INTER.regular,
        textAlign: 'center'
    },
    textBoxlabel: {
        fontSize: VERY_SMALL,
        color: OFF_WHITE,
        fontFamily: INTER.regular
    },
    mobileNumber: {
        color: WHITE,
        fontFamily: UBUNTU.bold,
        alignSelf: 'center',
        fontSize: SMALL
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: hp(4),
        height: hp(4),
        borderRadius: hp(2),
        backgroundColor: PRIMARY_RED
    }
})

export default VerifyOtp