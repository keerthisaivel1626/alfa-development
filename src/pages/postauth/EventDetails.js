import React from 'react'
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { APP_DARK_THEME, BASE_BLACK, BLACK, DEEP_BLUE, GOLD, GRAY, PRIMARY_RED, WHITE, YES_GREEN } from '../../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import { INTER, UBUNTU } from '../../utils/Fonts';
import { heightPercentageToDP as hp, widthPercentageToDP } from 'react-native-responsive-screen';
import { SMALL_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import { HEIGHT } from '../../utils/dimension';
import { ConfirmButton } from '../../components/Button';
import CommonHeader from '../../components/CommonHeader';
import { useFocusEffect } from '@react-navigation/native';
import { PATCHAPI, POSTAPI } from '../../utils/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADD_EVENT_USER_RESPONSE, EVENT_GALLERY_LSTING, EVENT_LISTING, EVENT_USER_RESPONSE, UPDATE_EVENT_USER_RESPONSE } from '../../utils/Endpoints';
import { ISOToAnyFormat, removeHtmlTags, TimeToAmPm } from '../../utils/CommonFunction';
import ContentLoader from 'react-native-easy-content-loader';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { hideMessage, showMessage } from 'react-native-flash-message';
import { populateGallery } from '../../redux/reducers/EventGallery';

const EventDetails = ({ navigation, route }) => {

    const goBack = () => navigation.goBack();
    const { eventId } = route.params;
    const [eventDetails, setEventDetails] = React.useState(null);
    const [userEventResponse, setUserEventResponse] = React.useState([]);
    const { loggedUserData } = useSelector((state) => state.authreducer);
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            getEventDetails();
            getUserEventResponse();
        }, [eventId])
    );

    const getUserEventResponse = async () => {
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        let params = {
            eventId,
            userId: loggedUserData.ID
        }
        try {
            let userEventResponse = await POSTAPI(EVENT_USER_RESPONSE, params, userResFromStorage.token)
            if (userEventResponse.data.code == 200 && userEventResponse.data.status == "success") {
                setUserEventResponse(userEventResponse.data.data)
            }
        } catch (error) {
            // console.log(error)
        }
    }

    const addEventUserResponse = async (status) => {
        showMessage({
            message: "Please Wait",
            type: 'info',
            style: {
                alignItems: 'center'
            },
            autoHide: false
        })
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        let params = {
            eventId,
            userId: loggedUserData.ID,
            reason: "test",
            status
        }
        try {
            let addEventUserResponse = await POSTAPI(ADD_EVENT_USER_RESPONSE, params, userResFromStorage.token)

            if (addEventUserResponse.data.code == 200 && addEventUserResponse.data.status == "success") {
                await getUserEventResponse();
                showMessage({
                    message: "Thanks for your response.",
                    type: 'success',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                })
            } else {
                showMessage({
                    message: "Please try later",
                    type: 'danger',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                })
            }
        } catch (error) {
            showMessage({
                message: `${error.message}`,
                type: 'danger',
                style: {
                    alignItems: 'center'
                },
                autoHide: true,
                duration: 1500
            })
        }
    }

    const updateEventUserResponse = async (id, status) => {
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        showMessage({
            message: "Please Wait",
            type: 'info',
            style: {
                alignItems: 'center'
            },
            autoHide: false
        })
        let params = {
            id,
            reason: "test",
            status
        }
        try {
            let updateEventUserResponse = await PATCHAPI(UPDATE_EVENT_USER_RESPONSE, params, userResFromStorage.token)
            if (updateEventUserResponse.data.code == 200 && updateEventUserResponse.data.status == "success") {
                await getUserEventResponse();
                showMessage({
                    message: "Thanks for your response.",
                    type: 'success',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                })

            } else {
                showMessage({
                    message: "Please try later",
                    type: 'danger',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                })
            }
        } catch (error) {
            showMessage({
                message: `${error.message}`,
                type: 'danger',
                style: {
                    alignItems: 'center'
                },
                autoHide: true,
                duration: 1500
            })
        }
    }

    const getEventDetails = async () => {
        let params = {
            "filters": {
                "search": [
                    {
                        "FIELD_NAME": "EVENT.ID",
                        "FIELD_VALUE": eventId,
                        "OPT": "="
                    },
                    {
                        "FIELD_NAME": "EVENT.STATUS",
                        "FIELD_VALUE": "active",
                        "OPT": "="
                    }
                ],
                "sortFilter": {
                    "FIELD_NAME": "EVENT.CREATED_AT",
                    "SORT_ORDER": "ASC"
                }
            }
        };

        try {
            let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
            let eventDetailsResponse = await POSTAPI(EVENT_LISTING, params, userResFromStorage.token);

            if (eventDetailsResponse.data.code == 200 && eventDetailsResponse.data.status == "success") {
                let details = eventDetailsResponse.data.data.DATA[0];
                details.IMAGES = JSON.parse(details.IMAGES)
                setEventDetails(details)

            } else {
                //logout code here
            }
        } catch (error) {
            // console.log(error)
            // logout code here
        }
    }

    const sliderRef = React.useRef(null);

    const [size, setSize] = React.useState({
        width: null,
        height: null
    });

    const onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        setSize({ width: layout.width, height: layout.height });
    }

    const viewGallery = async () => {
        showMessage({
            message: `Loading...`,
            type: 'info',
            style: {
                alignItems: 'center'
            },
            autoHide: false
        })
        let params = { eventId };
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        let eventGallery = [];
        try {
            let galleryResponse = await POSTAPI(EVENT_GALLERY_LSTING, params, userResFromStorage.token);
            hideMessage();
            // console.log("galleryResponse---->", JSON.stringify(galleryResponse, null, 4));
            if (galleryResponse.data.code == 200 && galleryResponse.data.status == "success") {
                if (galleryResponse.data.hasOwnProperty('data') && Object.keys(galleryResponse.data.data).length>0) {
                    let gallery = galleryResponse.data.data;
                    for (let key in gallery) {

                        if (loggedUserData.ID == key) {
                            let uploadedBy = "me";
                            let obj = {
                                uploadedBy,
                                data: gallery[key].map(v => ({ ...v, isDelete: true })),
                            }
                            eventGallery.push(obj);
                        } else {
                            let uploadedBy = gallery[key][0]['FIRST_NAME'];
                            let obj = {
                                uploadedBy,
                                data: gallery[key].map(v => ({ ...v, isDelete: false })),
                            }
                            eventGallery.push(obj);
                        }
                    }
                    let index = eventGallery.findIndex((single, index) => single.uploadedBy == 'me');
                    eventGallery.unshift(eventGallery.splice(index, 1)[0]);
                    dispatch(populateGallery(eventGallery))
                }else{
                    dispatch(populateGallery([]))
                }
                navigation.navigate('ManageEvent',{eventId})
            }
        } catch (error) {
            showMessage({
                message: `${error.message}`,
                type: 'danger',
                style: {
                    alignItems: 'center'
                },
                autoHide: true,
                duration: 1500
            })
        }

        // 
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: APP_DARK_THEME }}>
            <StatusBar barStyle="light-content" backgroundColor={APP_DARK_THEME} />

            <CommonHeader
                leftComp={<Pressable
                    onPress={goBack}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather name='chevron-left' size={hp(5)} color={WHITE} />
                    <ContentLoader loading={!eventDetails} active={true} title={false} pRows={1} pHeight={5} pWidth={150} />
                    {eventDetails && <Text style={styles.headerText}>{eventDetails?.TITLE}</Text>}
                </Pressable>}

            />
            <View style={styles.scrollWrapper}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name='calendar' size={hp(3)} color={WHITE} />
                            <View style={{ width: 5 }} />
                            <Text style={{ color: WHITE, fontFamily: UBUNTU.medium }}>Date:</Text>
                            <View style={{ width: 10 }} />
                            <ContentLoader loading={!eventDetails} active={true} title={false} pRows={1} pHeight={5} pWidth={100} />
                            {eventDetails && <Text style={{ color: WHITE, fontFamily: UBUNTU.medium }}>{ISOToAnyFormat(eventDetails?.EVENT_DATE)}</Text>}
                        </View>
                        {eventDetails && <TouchableOpacity onPress={viewGallery} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: GOLD, fontFamily: UBUNTU.medium }}>View Gallery</Text>
                            <Feather name='chevron-right' size={hp(3)} color={GOLD} />
                        </TouchableOpacity>}
                    </View>
                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name='clock' size={hp(3)} color={WHITE} />
                        <View style={{ width: 5 }} />
                        <Text style={{ color: WHITE, fontFamily: UBUNTU.medium }}>Time:</Text>
                        <View style={{ width: 10 }} />
                        <ContentLoader loading={!eventDetails} active={true} title={false} pRows={1} pHeight={5} pWidth={100} />
                        {eventDetails && <Text style={{ color: WHITE, fontFamily: UBUNTU.medium }}>{TimeToAmPm(eventDetails?.EVENT_TIME)}</Text>}
                    </View>
                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                    {eventDetails && eventDetails.IMAGES.length > 0 && <View onLayout={onLayoutDidChange} style={styles.eventImageContainer}>
                        <Carousel
                            ref={sliderRef}
                            autoplayInterval={3000}
                            data={eventDetails.IMAGES}
                            scrollEnabled={true}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={[size]}>
                                        <Image
                                            style={{ flex: 1, resizeMode: 'cover', width: null, height: null }}
                                            source={{
                                                uri: item
                                            }}
                                        />

                                    </View>
                                )
                            }}
                            autoplay={true}
                            sliderWidth={Dimensions.get('screen').width}
                            itemWidth={Dimensions.get('screen').width}
                            keyExtractor={(_, index) => index.toString()}
                            loop
                        />
                    </View>}

                    <View style={{ height: SMALL_VERTICAL_SPACE }} />
                    <ContentLoader
                        loading={!eventDetails}
                        active={true}
                        title={false}
                        pRows={5}
                        pHeight={5}
                        pWidth={[
                            widthPercentageToDP('100%') - 32,
                            widthPercentageToDP('90%'),
                            widthPercentageToDP('85%'),
                            widthPercentageToDP('80%'),
                            widthPercentageToDP('75%')
                        ]}
                    />
                    {eventDetails && <Text
                        style={{
                            textAlign: 'left',
                            color: WHITE,
                            fontFamily: UBUNTU.regular,
                            marginHorizontal: 16,
                            lineHeight: hp(2.5),
                            fontSize: hp(2)
                        }}>
                        <Text style={{ textTransform: 'uppercase', fontFamily: UBUNTU.bold, fontSize: hp(3) }}>
                            {removeHtmlTags(eventDetails?.DESCRIPTION)[0]}</Text>
                        {removeHtmlTags(eventDetails?.DESCRIPTION).substring(1, removeHtmlTags(eventDetails?.DESCRIPTION).length)}
                    </Text>}
                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
                        <ConfirmButton
                            onPress={() => userEventResponse.length == 0 ? addEventUserResponse('yes') : updateEventUserResponse(userEventResponse[0].ID, 'yes')}
                            customStyle={{
                                width: '30%',
                                height: hp(5.5),
                                borderRadius: 5,
                                backgroundColor: userEventResponse[0]?.STATUS == 'yes' ? YES_GREEN : GRAY
                            }}
                            textComponent={<Text style={{ color: userEventResponse[0]?.STATUS == 'yes' ? BLACK : WHITE, fontFamily: INTER.regular }}>Yes</Text>}
                        />
                        <ConfirmButton
                            onPress={() => userEventResponse.length == 0 ? addEventUserResponse('maybe') : updateEventUserResponse(userEventResponse[0].ID, 'maybe')}
                            customStyle={{
                                width: '30%',
                                height: hp(5.5),
                                borderRadius: 5,
                                backgroundColor: userEventResponse[0]?.STATUS == 'maybe' ? GOLD : GRAY
                            }}
                            textComponent={<Text style={{ color: userEventResponse[0]?.STATUS == 'maybe' ? BLACK : WHITE, fontFamily: INTER.regular }}>Maybe</Text>}
                        />
                        <ConfirmButton
                            onPress={() => userEventResponse.length == 0 ? addEventUserResponse('no') : updateEventUserResponse(userEventResponse[0].ID, 'no')}
                            customStyle={{
                                width: '30%',
                                height: hp(5.5),
                                borderRadius: 5,
                                backgroundColor: userEventResponse[0]?.STATUS == 'no' ? PRIMARY_RED : GRAY
                            }}
                            textComponent={<Text style={{ color: userEventResponse[0]?.STATUS == 'no' ? BLACK : WHITE, fontFamily: INTER.regular }}>No</Text>}
                        />
                    </View>
                    <View style={{ height: hp(18) }} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

EventDetails.sharedElements = (route, otherRoute, showing) => {
    const { eventId } = route.params;
    return [`item_${eventId}_item`];
}

export default EventDetails

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlayView: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        backgroundColor: BASE_BLACK
    },
    headerText: {
        fontFamily: UBUNTU.medium,
        fontSize: hp(3),
        color: WHITE
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
    eventImageContainer: {
        height: hp(30),
        borderRadius: hp(2),
        overflow: 'hidden'
    }
})