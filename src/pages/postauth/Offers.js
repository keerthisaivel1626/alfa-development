import React from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Pressable, Platform } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view'
import { HEIGHT, WIDTH } from '../../utils/dimension';
import { APP_DARK_THEME, ASH, DEEP_BLUE, GOLD, OFF_WHITE, PRIMARY_RED, WHITE } from '../../utils/Colors';
import { INTER, UBUNTU, VIGA } from '../../utils/Fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonHeader from '../../components/CommonHeader';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Foundation from 'react-native-vector-icons/Foundation'
import { Picker } from '@react-native-picker/picker';
import { REGULAR_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import RBSheet from "react-native-raw-bottom-sheet";
import { POSTAPI } from '../../utils/Network';
import { GET_OFFERS } from '../../utils/Endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POWERED_BY_ALFA } from '../../utils/imapgepath';
import ContentLoader from 'react-native-easy-content-loader';

const RED_CIRCLE_DIMENSION = 50;

const Offers = () => {

    const [selectedCategory, setSelectedCategory] = React.useState('');

    const pickerRef = React.useRef(null);

    const [pickerStatus, setPickerStatus] = React.useState(false);

    const bottomSheetRef = React.useRef(null);

    const [selectedOffer, setSelectedOffer] = React.useState(null);


    const [offers, setOffers] = React.useState(null);

    const onOfferClick = (offerIndex) => {
        setSelectedOffer(offers[offerIndex])
    }

    React.useEffect(() => {
        getAllOffers()
    }, [])

    const getAllOffers = async (selectedCategory = "") => {
        let params = {
            "filters": {
                "search": [
                    {
                        "FIELD_NAME": "OFFERS.CATEGORY",
                        "FIELD_VALUE": `${selectedCategory}`,
                        "OPT": "="
                    },
                    {
                        "FIELD_NAME": "OFFERS.STATUS",
                        "FIELD_VALUE": "active",
                        "OPT": "="
                    }
                ],
                "sortFilter": {
                    "FIELD_NAME": "OFFERS.CREATED_AT",
                    "SORT_ORDER": "ASC"
                }
            }
        }
        try {
            let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
            let getAllOffersRes = await POSTAPI(GET_OFFERS, params, userResFromStorage.token);
            if (getAllOffersRes.data.code === "200" && getAllOffersRes.data.status === "success") {
                setOffers(getAllOffersRes.data.data.DATA)
            }
        } catch (error) {
            // console.log("getEventStatus error--->", error.message)
        }
    }

    const makeInitial = (str) => {
        var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
        return matches.join('');
    }

    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: APP_DARK_THEME }}>
            <StatusBar barStyle="light-content" backgroundColor={APP_DARK_THEME} />
            <CommonHeader
                leftComp={<View>
                    <Text style={{ color: WHITE, letterSpacing: 4, fontSize: hp(5), fontWeight: 'bold' }}>ALFA</Text>
                    <Text style={{ color: OFF_WHITE, alignSelf: 'center', letterSpacing: 1 }}>NETWORK</Text>
                </View>}
                righComp={<Text style={{ color: WHITE, letterSpacing: 0.05, fontFamily: INTER.medium, fontSize: hp(2.5) }}>Offers</Text>}
            />

            <View style={styles.scrollWrapper}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={{ paddingBottom: hp(14) }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.filterText}>Filter Category</Text>
                        <TouchableOpacity
                            onPress={() => {
                                Platform.select({
                                    android: pickerRef?.current?.focus(),
                                    ios: setPickerStatus((prev => !prev))
                                })
                            }}
                            style={styles.selectedPicker}>
                            <Text style={{ color: WHITE, fontFamily: INTER.regular, fontSize: hp(2.2) }}>
                                {selectedCategory == "" ? "All" : selectedCategory == "retail" ? "Retail" : selectedCategory == "medical" ? "Medical" : ""}
                            </Text>
                            <EvilIcons name='chevron-down' size={hp(5)} color={"#F6F6F6"} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />

                    {!offers && <View>
                        <ContentLoader
                            loading={true}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(15)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />
                        <ContentLoader
                            loading={true}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(15)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />
                        <ContentLoader
                            loading={true}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(15)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />
                        <ContentLoader
                            loading={true}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(15)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />

                    </View>}

                    {offers && offers.length > 0 && offers.map((offer, index) => {
                        const { NAME, LOGO, DISCOUNT, BG_COLOUR, CATEGORY } = offer
                        return (
                            <Pressable
                                onPress={() => {
                                    onOfferClick(index);
                                    bottomSheetRef?.current?.open();
                                }}
                                style={styles.couponContainer} key={index}>
                                <View style={{ ...styles.leftContainer, backgroundColor: BG_COLOUR, }}>
                                    <View style={{ width: '80%' }}>
                                        <Text style={{ color: WHITE, fontSize: hp(3.8), fontFamily: VIGA.regular }}>{NAME}</Text>
                                    </View>
                                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                        <Text style={{ color: WHITE, fontSize: hp(2), fontFamily: VIGA.regular, flex: 1, flexWrap: 'wrap' }}>
                                            {DISCOUNT}% Discount on {CATEGORY.charAt(0).toUpperCase() + CATEGORY.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: .5, borderWidth: 1, borderStyle: 'dashed', borderColor: WHITE }} />
                                <View style={{ backgroundColor: BG_COLOUR, width: "35%", justifyContent: 'space-around', alignItems: 'center' }}>

                                    {LOGO == "" && <Text style={{ color: WHITE, fontSize: 22, fontFamily: VIGA.regular }}>{makeInitial(NAME).toUpperCase()}</Text>}
                                    {LOGO != "" && <Image
                                        source={{ uri: LOGO }}
                                        resizeMode={'contain'}
                                        style={{ width: 60, height: 60, resizeMode: 'contain' }}
                                    />}
                                    <Image
                                        source={POWERED_BY_ALFA}
                                        resizeMode={'contain'}
                                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                                    />
                                </View>
                            </Pressable>
                        )
                    })}
                    {offers && offers.length == 0 && <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text style={{ color: WHITE, fontSize: 22, alignSelf: 'center' }}>No Offers found</Text>
                    </View>}
                </ScrollView>

            </View>

            <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={true}
                openDuration={1000}
                animationType={'slide'}
                closeDuration={1000}
                customStyles={{
                    container: {
                        height: hp('70%'),
                        backgroundColor: APP_DARK_THEME,
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                    },
                    wrapper: { backgroundColor: 'rgba(23, 25, 28,0.4)' }
                }}
            >
                <ScrollView contentContainerStyle={{ padding: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            {selectedOffer && selectedOffer?.LOGO == "" && <Text style={{ color: WHITE, fontSize: 22, fontFamily: VIGA.regular }}>{makeInitial(selectedOffer?.NAME).toUpperCase()}</Text>}
                            {selectedOffer?.LOGO != "" && <Image
                                source={{ uri: selectedOffer?.LOGO }}
                                resizeMode={'contain'}
                                style={{ width: 60, height: 60, resizeMode: 'contain' }}
                            />}
                            <View style={styles.categoryTag}>
                                <Text style={{ color: WHITE, fontFamily: UBUNTU.regular, textTransform: 'uppercase' }}>{selectedOffer?.CATEGORY}</Text>
                            </View>
                        </View>
                        <View style={{ width: 20 }} />
                        <Text style={{ flex: 1, flexWrap: 'wrap', fontFamily: UBUNTU.bold, color: WHITE, fontSize: hp(4.5) }}>
                            {selectedOffer?.NAME}
                        </Text>
                    </View>
                    <View style={{ height: REGULAR_VERTICAL_SPACE }} />
                    <Text style={{ fontFamily: UBUNTU.regular, color: WHITE, fontSize: hp(2.5) }}>
                        Get {selectedOffer?.DISCOUNT}% discount on {selectedOffer?.CATEGORY} products. Avail the discount using the coupon below.
                    </Text>
                    <View style={{ height: REGULAR_VERTICAL_SPACE }} />
                    {selectedOffer?.ADDRESS != "" && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.redCircle}>
                            <EvilIcons name='location' size={RED_CIRCLE_DIMENSION * .7} color={WHITE} />
                        </View>
                        <View style={{ width: 10 }} />
                        <Text style={{ flex: 1, flexWrap: 'wrap', color: WHITE, fontFamily: UBUNTU.regular, fontSize: hp(2.5) }}>
                            50A, Sarat Bose Rd, OPP:, Paddapukur, Bhowanipore, Kolkata, West Bengal 700025
                        </Text>
                    </View>}

                    <View style={{ height: REGULAR_VERTICAL_SPACE }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.redCircle}>
                            <Foundation name='telephone' size={RED_CIRCLE_DIMENSION * .7} color={WHITE} />

                        </View>
                        <View style={{ width: 10 }} />
                        <Text style={{ flex: 1, flexWrap: 'wrap', color: WHITE, fontFamily: UBUNTU.regular, fontSize: hp(2.5) }}>
                            +91 80335 52520
                        </Text>
                    </View>
                </ScrollView>
            </RBSheet>
            {Platform.OS == 'android' && <Picker

                style={styles.pickerContainer}
                itemStyle={styles.pickerItemStyle}
                ref={pickerRef}
                mode={'dialog'}

                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedCategory(itemValue);
                    setOffers(null);
                    getAllOffers(itemValue)
                    setPickerStatus((prev => !prev))
                }}>
                <Picker.Item label="All" value="" />
                <Picker.Item label="Retail" value="retail" />
                <Picker.Item label="Medical" value="medical" />
            </Picker>}
            {Platform.OS == 'ios' && pickerStatus &&
                <Picker

                    style={styles.pickerContainer}
                    itemStyle={styles.pickerItemStyle}
                    ref={pickerRef}
                    mode={'dialog'}

                    selectedValue={selectedCategory}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedCategory(itemValue);
                        setOffers(null);
                        getAllOffers(itemValue)
                        setPickerStatus((prev => !prev))
                    }}>
                    <Picker.Item label="All" value="" />
                    <Picker.Item label="Retail" value="retail" />
                    <Picker.Item label="Medical" value="medical" />
                </Picker>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6a51ae'
    },
    overlay: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: APP_DARK_THEME,
        ...StyleSheet.absoluteFillObject
    },
    pageDetailsContainer: {
        width: '100%',
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(5)
    },
    scrollWrapper: {
        flex: 1,
        backgroundColor: GOLD,
        marginTop: hp(15),
        borderTopLeftRadius: HEIGHT * .03,
        borderTopRightRadius: HEIGHT * .03,
        paddingTop: 5,
        overflow: 'hidden'
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: DEEP_BLUE,
        borderTopLeftRadius: HEIGHT * .03,
        borderTopRightRadius: HEIGHT * .03,
        padding: 16
    },
    filterText: {
        color: GOLD,
        fontFamily: VIGA.regular,
        fontSize: hp(3)
    },
    selectedPicker: {
        padding: 10,
        backgroundColor: ASH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F6F6F6'
    },
    pickerContainer: {
        backgroundColor: ASH,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderRadius: 10,
        opacity: Platform.OS == 'android' ? 0 : 1
    },
    pickerItemStyle: {
        color: WHITE,
        fontSize: hp(2.5),
        fontFamily: UBUNTU.medium
    },
    couponContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 10,
        overflow: 'hidden'
    },
    leftContainer: {
        width: "65%",
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 22
    },
    categoryTag: {
        padding: 5,
        backgroundColor: "#2A2C36",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    redCircle: {
        width: RED_CIRCLE_DIMENSION,
        height: RED_CIRCLE_DIMENSION,
        borderRadius: RED_CIRCLE_DIMENSION / 2,
        backgroundColor: PRIMARY_RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
})

export default Offers