import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, Keyboard } from 'react-native';
import { Button } from '../../components/Button';
import FormContainer from '../../components/FormContainer';
import { DropDownInput } from '../../components/InputBox';
import { BLACK, ERROR_RED, FADE_GRAY, GOLD, OFF_WHITE, PRIMARY_RED, WHITE } from '../../utils/Colors';
import { HEIGHT, WIDTH } from '../../utils/dimension';
import { INTER,  VIGA } from '../../utils/Fonts';
import { SPLASH, ALFA_NETWORK } from '../../utils/imapgepath'
import { POSTAPI } from '../../utils/Network';
import { REGULAR, SMALL, VERY_SMALL } from '../../utils/NormalizeFont';
import { REGULAR_VERTICAL_SPACE, SMALL_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import * as yup from 'yup';
import { showMessage } from "react-native-flash-message";
import { Formik } from 'formik';

const Login = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    
    let schema = yup.object().shape({
        mobile: yup.string().length(10, "Invalid phone number").required("Phone number is required")
    });

    const requestOTP = async (mobile) => {
        
        Keyboard.dismiss();
        let dataObj = { mobile: "" + mobile }
        setLoading(true);
        try {
            let requestOTPRes = await POSTAPI('user/sendOtp?_format=json', dataObj);
            let { data } = requestOTPRes;
          
            setLoading(false);

            if (data.code == 200 && data.status == "success") {
                navigation.navigate('VerifyOtp', { mobile })
            } else if (data.code == 200 && data.status == "error") {
                
                showMessage({
                    message: data.message,
                    type: 'danger',
                    style: {
                        alignItems: 'center'
                    }
                })
            } else {
                return false
            }

        } catch (error) {
            setLoading(false);
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: BLACK }}>
            <StatusBar barStyle="light-content" backgroundColor={BLACK} />
            <Image source={SPLASH} style={styles.backgroundImage} />
            <Image source={ALFA_NETWORK} style={styles.logoImage} />
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Formik
                    initialValues={{ mobile: "" }}
                    validationSchema={schema}
                    onSubmit={(values, action) => {
                        requestOTP(values.mobile);
                    }}
                >
                    {({ errors, touched, handleSubmit, handleChange, values, dirty }) => {
                       
                        return (
                          <FormContainer>
                            <View style={{height: REGULAR_VERTICAL_SPACE}} />
                            <Text style={styles.headerLabel}>
                              Login Account
                            </Text>
                            <View style={{height: SMALL_VERTICAL_SPACE}} />
                            <Text style={styles.description}>
                              Hassle free login to our app, enter
                            </Text>
                            <Text style={styles.description}>
                              mobile number and verify otp to
                            </Text>
                            <Text style={styles.description}>login.</Text>
                            <View style={{height: SMALL_VERTICAL_SPACE}} />
                            <Text style={styles.textBoxlabel}>
                              Enter Mobile Number:
                            </Text>
                            <View style={{height: SMALL_VERTICAL_SPACE}} />
                            <DropDownInput
                              value={values.mobile}
                              onChangeText={handleChange('mobile')}
                              errorStyle={
                                (dirty && touched?.mobile && errors.mobile) ||
                                (!dirty && errors.mobile) ||
                                (dirty && errors.mobile)
                                  ? {
                                      borderWidth: 1,
                                      borderColor: ERROR_RED,
                                    }
                                  : {}
                              }
                            />
                            {errors.mobile && (
                              <View
                                style={{height: VERY_SMALL_VERTICAL_SPACE}}
                              />
                            )}
                            {errors.mobile && (
                              <Text style={styles.errorText}>
                                {errors.mobile}
                              </Text>
                            )}
                            <View style={{height: SMALL_VERTICAL_SPACE}} />
                            <Button
                              title={'Request OTP'}
                              customStyle={{
                                height: 60,
                                backgroundColor: PRIMARY_RED,
                                borderRadius: 50,
                              }}
                              shadowStatus={true}
                              titleStyle={{
                                color: WHITE,
                                fontSize: SMALL,
                                fontFamily: VIGA.regular,
                              }}
                              onPress={handleSubmit}
                              isLoading={loading}
                            />
                            {errors.mobile && (
                              <View
                                style={{height: VERY_SMALL_VERTICAL_SPACE}}
                              />
                            )}
                          </FormContainer>
                        );
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
    errorText: {
        color: ERROR_RED,
        alignSelf: 'center'
    }
})

export default Login