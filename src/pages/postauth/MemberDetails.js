import React from 'react';
import { StyleSheet, Text, View, Image, Platform, StatusBar, ScrollView } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { APP_DARK_THEME, BASE_BLACK, BLACK, GOLD, WHITE } from '../../utils/Colors';
import { HEIGHT, WIDTH } from '../../utils/dimension';
import { UBUNTU } from '../../utils/Fonts';
import { REGULAR_VERTICAL_SPACE, SMALL_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import { ANONYMOUS_USER } from '../../utils/imapgepath';
import { ISOToAnyFormat } from '../../utils/CommonFunction';

const statusBarHeight = StatusBar.currentHeight;

const MemberDetails = ({ navigation, route }) => {

    const { item } = route.params
    const goBack = () => navigation.navigate('Members');
    // console.log(JSON.stringify(item, null, 4))
    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1
            }}
            style={styles.container}>
            <View style={styles.header}>
                <Feather onPress={goBack} name='chevron-left' size={hp(8)} color={WHITE} />
            </View>
            <View style={{ height: REGULAR_VERTICAL_SPACE }} />
            <View style={{ height: 300 }}>
                {item.PROFILE_IMAGE == "" && <Image
                    style={{ width: null, height: null, flex: 1 }}
                    source={ANONYMOUS_USER}
                />}
                {item.PROFILE_IMAGE != "" && <FastImage
                    style={{ width: null, height: null, flex: 1 }}
                    source={{
                        uri: item.PROFILE_IMAGE,
                        priority: FastImage.priority.high,
                    }}
                    resizeMode='contain'
                />}
            </View>
            <View style={{ paddingHorizontal: 16, marginTop: hp(5) }}>
            <Text style={{ color: GOLD, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>Personal details</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Name:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{item.FIRST_NAME}{` `}{item.LAST_NAME}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Email:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{item.EMAIL}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Mobile:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{item.MOBILE}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Dob:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{ISOToAnyFormat(item.DOB)}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Name of school:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{item.NAME_OF_SCHOOL}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Name of college:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{item.NAME_OF_COLLAGE}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.detailsText}>Anniversary Date:- </Text>
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Text style={styles.detailsText}>{ISOToAnyFormat(item.DATE_OF_ANNIVERSARY)}</Text>
                </View>
                <View style={{ height: SMALL_VERTICAL_SPACE }} />
                <Text style={{ color: GOLD, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>Company details</Text>
                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                {!item.COMPANY_DETAILS || JSON.parse(item.COMPANY_DETAILS).length==0 &&  <Text style={{ color: WHITE, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>No Data found</Text>}
                {item.COMPANY_DETAILS && JSON.parse(item.COMPANY_DETAILS).map((single, index) => {
                    return (
                        <View key={index}>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <View style={{ height: 1, backgroundColor: GOLD, flex: 1 }}></View>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: GOLD
                                }}>
                                    <Text style={{ color: WHITE, fontFamily: UBUNTU.bold }}>{index + 1}</Text>
                                </View>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{ height: 1, backgroundColor: GOLD, flex: 1 }}></View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Name:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.companyName}</Text>
                            </View>
                            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Address:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.companyAddress}</Text>
                            </View>
                            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Industry Name:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.companyIndustry}</Text>
                            </View>
                            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Web URL:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.companyWeb}</Text>
                            </View>
                        </View>
                    )
                })}
                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                <Text style={{ color: GOLD, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>Children details</Text>
                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                {!item.CHILDREN_DEAILS || JSON.parse(item.CHILDREN_DEAILS).length==0 &&  <Text style={{ color: WHITE, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>No Data found</Text>}
                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                {item.CHILDREN_DEAILS && JSON.parse(item.CHILDREN_DEAILS).map((single, index) => {
                    return (
                        <View key={index}>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <View style={{ height: 1, backgroundColor: GOLD, flex: 1 }}></View>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: GOLD
                                }}>
                                    <Text style={{ color: WHITE, fontFamily: UBUNTU.bold }}>{index + 1}</Text>
                                </View>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{ height: 1, backgroundColor: GOLD, flex: 1 }}></View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Name:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.childrenName}</Text>
                            </View>
                            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Gender:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.childrenGender}</Text>
                            </View>
                            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>School name:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single.childrenSchool}</Text>
                            </View>
                            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Dob:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{ISOToAnyFormat(single.childrenDob)}</Text>
                            </View>
                        </View>
                    )
                })}
                <Text style={{ color: GOLD, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>Club Membership</Text>
                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                {!item.CLUB_MEMBERSHIP || JSON.parse(item.CLUB_MEMBERSHIP).length==0 &&  <Text style={{ color: WHITE, fontFamily: UBUNTU.bold,alignSelf:'center',fontSize:hp(2.2) }}>No Data found</Text>}
                <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                {item.CLUB_MEMBERSHIP && JSON.parse(item.CLUB_MEMBERSHIP).map((single, index) => {
                    return (
                        <View key={index}>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                <View style={{ height: 1, backgroundColor: GOLD, flex: 1 }}></View>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: GOLD
                                }}>
                                    <Text style={{ color: WHITE, fontFamily: UBUNTU.bold }}>{index + 1}</Text>
                                </View>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <View style={{ height: 1, backgroundColor: GOLD, flex: 1 }}></View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.detailsText}>Name:- </Text>
                                <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                                <Text style={styles.detailsText}>{single}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
            <View style={{ height: hp(30) }} />
        </ScrollView >
    )
}

export default MemberDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_DARK_THEME
    },
    image: {
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'cover',
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    detailsText: {
        color: WHITE,
        fontFamily: UBUNTU.bold,
        fontSize: hp(2)
    },
    header: {
        top: Platform.select({
            ios: hp(5),
            android: statusBarHeight
        }),
        // position: 'absolute',
        // zIndex: 999
    }
})