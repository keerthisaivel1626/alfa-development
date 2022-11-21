import React, { useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, ScrollView, Pressable, Linking, Alert } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { APP_DARK_THEME, BASE_BLACK, BLACK, DEEP_BLUE, GOLD, GRAY_WHITE, OFF_WHITE, WHITE } from '../../utils/Colors';
import { UBUNTU } from '../../utils/Fonts';
import { REGULAR, SMALL, VERY_SMALL } from '../../utils/NormalizeFont';
import { SMALL_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import { ABSTRACT, EVENT_IMAGE, IMAGE_LOADER } from '../../utils/imapgepath';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HEIGHT, WIDTH } from '../../utils/dimension';
import EventMarker from '../../components/EventMarker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SharedElement } from 'react-navigation-shared-element';
import { useDispatch, useSelector } from 'react-redux';
import { POSTAPI } from '../../utils/Network';
import { EVENT_LISTING, EVENT_STATUS, GET_ALL_USERS, SURVEY_LIST } from '../../utils/Endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeLoginResponse } from '../../redux/reducers/AuthReducer';
import { hideMessage, showMessage } from 'react-native-flash-message';
import ContentLoader from 'react-native-easy-content-loader';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
const Home = ({ navigation }) => {

    const SCROLLCONTAINER_WIDTH = WIDTH - 32;

    const dispatch = useDispatch();

    const { loggedUserData } = useSelector((state) => state.authreducer);

    const [userDataLoad, setUserDataLoad] = React.useState(false);

    const [eventStatusLoad, setEventStatusLoad] = React.useState(false);

    const [eventLoader, setEventLoader] = React.useState(false);

    const regex = /(<([^>]+)>)/ig;

    useEffect(() => {
        
        getUserDetails();
       getEventStatus();
       getAllEvents();
        console.log("data fetch completed")
    }, []);

    const getUserDetails = async () => {
         let userResFromStorage = {
           userId: 23456,
           token: 123456,
         };
       // let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        setUserDataLoad(true);
        let params = {
            "filters": {
                "PRIMARY_MEMBER": false,
                "search": [
                    {
                        "FIELD_NAME": "USER.ID",
                        //"FIELD_VALUE": userResFromStorage.userId,
                        "FIELD_VALUE":12345678,
                        "OPT": "="
                    },
                    {
                        "FIELD_NAME": "USER.STATUS",
                        "FIELD_VALUE": "active",
                        "OPT": "="
                    },
                    {
                        "FIELD_NAME": "USER.PRIMARY_MEMBER",
                        "FIELD_VALUE": null,
                        "OPT": "is"
                    }
                ],
                "sortFilter": {
                    "FIELD_NAME": "USER.CREATED_AT",
                    "SORT_ORDER": "ASC"
                }
            }
        }
        try {
           
            let userDetailsres = await POSTAPI(GET_ALL_USERS, params, userResFromStorage.token);
            // console.log("userDetailsres--->", JSON.stringify(userDetailsres, null, 4))
            setUserDataLoad(false);
            if (userDetailsres.data.status == "success" && userDetailsres.data.code == "200") {
                dispatch(storeLoginResponse(userDetailsres.data.data.DATA[0]));
            } else {
                showMessage({
                    type: 'danger',
                    message: "Please try later."
                })
            }
        } catch (error) {
            setUserDataLoad(false);
            showMessage({
                type: 'danger',
                message: `${error.message}.`
            })
        }
    }

    const getEventStatus = async () => {
        setEventStatusLoad(true);
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));

        try {
            let getEventStatusRes = await POSTAPI(EVENT_STATUS, {}, userResFromStorage.token);
            setEventStatusLoad(false);
            if (getEventStatusRes.data.code === "200" && getEventStatusRes.data.status === "success") {
                setEventStatus(getEventStatusRes.data.data);
            }
        } catch (error) {
            setEventStatusLoad(false);
            showMessage({
                type: 'danger',
                message: `${error.message}.`
            })
        }
    }

    const getAllEvents = async () => {
        setEventLoader(true);
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        try {
            let getAllEventsRes = await POSTAPI(EVENT_LISTING, {}, userResFromStorage.token);
            setEventLoader(false);
            if (getAllEventsRes.data.code === "200" && getAllEventsRes.data.status === "success") {
                setEvents(getAllEventsRes.data.data.DATA);
            }
        } catch (error) {
            setEventLoader(false);
            showMessage({
                type: 'danger',
                message: `${error.message}.`
            })
        }

    }

    const [events, setEvents] = React.useState([]);

    const eventDetails = (event) => { navigation.navigate('EventDetails', { eventId: event.ID }) };

    const [eventStatus, setEventStatus] = React.useState({
        completedEvents: 0,
        pendingEvents: 0,
        totalOffers: 0
    })

    const takeSurvey = async () => {
        showMessage({
            type: 'info',
            message: "Please wait..."
        })
        let params = {
            "filters": {
                "search": [
                    {
                        "FIELD_NAME": "SURVEY.ID",
                        "FIELD_VALUE": "",
                        "OPT": "="
                    },
                    {
                        "FIELD_NAME": "SURVEY.STATUS",
                        "FIELD_VALUE": "active",
                        "OPT": "="
                    }
                ],
                "sortFilter": {
                    "FIELD_NAME": "SURVEY.CREATED_AT",
                    "SORT_ORDER": "ASC"
                }
            }
        };
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        let suveyResponse = await POSTAPI(SURVEY_LIST, params, userResFromStorage.token);
        hideMessage();
        if (suveyResponse.data.code == 200 && suveyResponse.data.status == "success") {
            let url = suveyResponse.data.data.DATA[0].URL;
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }
    }

    return (
    
        <SafeAreaView style={{ flex: 1, backgroundColor: APP_DARK_THEME }}>
        {console.log("return calling ")}
            <StatusBar barStyle="light-content" backgroundColor={APP_DARK_THEME} />
            <View style={styles.overlayView}>
                <View style={styles.userDetailsContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.userName}>Hi, </Text>
                            <ContentLoader loading={userDataLoad} active={true} title={false} pRows={1} pHeight={5} pWidth={150} />
                            {!userDataLoad && <Text style={styles.userName}>{loggedUserData?.FIRST_NAME} {loggedUserData?.LAST_NAME}</Text>}
                        </View>

                        <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                        <Text style={styles.userAccess}>Exclusive Access  </Text>
                    </View>
                    {loggedUserData?.PROFILE_IMAGE != "" && <FastImage
                        source={{
                            uri: loggedUserData?.PROFILE_IMAGE,
                            priority: FastImage.priority.high,
                        }}
                        thumbnailSource={IMAGE_LOADER}
                        style={{
                            width: hp(8),
                            height: hp(8),
                            borderRadius: hp(2)
                        }}
                    />}
                    {/* {loggedUserData?.PROFILE_IMAGE != "" && <Image 
                        style={{width:50,height:50,borderRadius:25}} 
                        source={{ uri:loggedUserData?.PROFILE_IMAGE }}
                    />} */}
                    {loggedUserData?.PROFILE_IMAGE == "" && <Entypo name='user' color={WHITE} size={50} />}
                </View>
            </View>
            <View style={styles.scrollWrapper}>
                <ScrollView
                    style={styles.scrollContainer}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: WHITE, fontFamily: UBUNTU.medium, fontSize: VERY_SMALL }}>Yours Events</Text>
                        <Pressable
                            onPress={takeSurvey}
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: GOLD, fontFamily: UBUNTU.medium, fontSize: VERY_SMALL }}>Take the Survey</Text>
                            <EvilIcons name='chevron-right' size={20} color={GOLD} />
                        </Pressable>
                    </View>
                    <View style={{ height: SMALL_VERTICAL_SPACE }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <EventMarker
                            title={'Upcoming'}
                            titleStyle={{
                                fontFamily: UBUNTU.medium,
                                color: WHITE
                            }}
                            loading={eventStatusLoad}
                            count={eventStatus.pendingEvents}
                            countStyle={{
                                fontFamily: UBUNTU.medium,
                                color: GOLD,
                                fontSize: REGULAR
                            }}
                            customStyle={{
                                width: SCROLLCONTAINER_WIDTH / 3.5,
                                height: 100,
                                backgroundColor: DEEP_BLUE,
                                borderWidth: 1,
                                borderRadius: 10,
                                shadowColor: GRAY_WHITE,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }}
                        />
                        <EventMarker
                            title={'Completed'}
                            count={eventStatus.completedEvents}
                            loading={eventStatusLoad}
                            countStyle={{
                                fontFamily: UBUNTU.medium,
                                color: GOLD,
                                fontSize: REGULAR
                            }}
                            titleStyle={{
                                fontFamily: UBUNTU.medium,
                                color: WHITE
                            }}
                            customStyle={{
                                width: SCROLLCONTAINER_WIDTH / 3.5,
                                height: 100,
                                backgroundColor: DEEP_BLUE,
                                borderWidth: 1,
                                borderRadius: 10,
                                shadowColor: GRAY_WHITE,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }}
                        />
                        <EventMarker
                            title={'Offers'}
                            titleStyle={{
                                fontFamily: UBUNTU.medium,
                                color: WHITE
                            }}
                            count={eventStatus.totalOffers}
                            loading={eventStatusLoad}
                            countStyle={{
                                fontFamily: UBUNTU.medium,
                                color: GOLD,
                                fontSize: REGULAR
                            }}
                            customStyle={{
                                width: SCROLLCONTAINER_WIDTH / 3.5,
                                height: 100,
                                backgroundColor: DEEP_BLUE,
                                borderWidth: 1,
                                borderRadius: 10,
                                shadowColor: GRAY_WHITE,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }}
                        />
                    </View>
                    <View style={{ height: SMALL_VERTICAL_SPACE }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: WHITE, fontFamily: UBUNTU.medium, fontSize: VERY_SMALL }}>Upcoming Events</Text>
                        {/* <Text onPress={() => navigation.navigate('Members')} style={{ color: WHITE, fontFamily: UBUNTU.medium, fontSize: VERY_SMALL }}>Members</Text> */}
                    </View>
                    <View style={{ height: SMALL_VERTICAL_SPACE }} />

                    {eventLoader && <View>
                        <ContentLoader
                            loading={eventLoader}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(30)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />
                        <ContentLoader
                            loading={eventLoader}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(30)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />
                        <ContentLoader
                            loading={eventLoader}
                            active={true}
                            title={false}
                            pRows={1}
                            pHeight={hp(30)}
                            pWidth={WIDTH - 32}
                            containerStyles={{
                                borderRadius: hp(3),
                                marginBottom: VERY_SMALL_VERTICAL_SPACE
                            }}
                        />
                    </View>}

                    {!eventLoader && events.map((singleEvent, index) => {
                        let { IMAGES, TITLE, EVENT_TIME, DESCRIPTION } = singleEvent;
                        let eventImage = JSON.parse(IMAGES);
                        let strippedDescription = DESCRIPTION.replace(regex, '');
                        return (
                            <Pressable
                                key={index}
                                onPress={() => eventDetails(singleEvent)}
                                style={styles.eventContainer}>
                                <SharedElement id={`item_${index}_item`}>
                                    <View style={{ height: hp(15), justifyContent: 'center' }}>
                                        <Image source={{ uri: eventImage[0] }} style={{ ...StyleSheet.absoluteFill, width: '100%', height: '100%' }} />
                                        <Text style={styles.eventTitle}>
                                            {TITLE}
                                        </Text>
                                        <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                                            <Feather name='clock' size={15} color={WHITE} />
                                            <View style={{ width: 5 }} />
                                            <Text style={{ color: WHITE, fontFamily: UBUNTU.regular, fontSize: hp(2.2) }}>
                                                {EVENT_TIME}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                    <Text
                                        numberOfLines={4}
                                        style={{
                                            textAlign: 'left',
                                            color: WHITE,
                                            fontFamily: UBUNTU.regular,
                                            marginHorizontal: 16,
                                            lineHeight: hp(2.5),
                                            fontSize: hp(2)
                                        }}>
                                        <Text style={{ textTransform: 'uppercase', fontFamily: UBUNTU.bold, fontSize: hp(3) }}>
                                            {strippedDescription[0]}
                                        </Text>
                                        {strippedDescription.substring(1, strippedDescription.length)}
                                    </Text>
                                    {/* <RenderHtml
                                        // contentWidth={width}
                                        source={{
                                            html: `${DESCRIPTION}`
                                        }}
                                    /> */}
                                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
                                        <AntDesign size={hp(5)} name={'rightcircle'} color={GOLD} />
                                        <View>
                                            <Text style={{ color: WHITE, letterSpacing: 4, fontSize: hp(4), fontWeight: 'bold' }}>ALFA</Text>
                                            <Text style={{ color: OFF_WHITE, alignSelf: 'center', letterSpacing: 1 }}>NETWORK</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                </SharedElement>

                            </Pressable>
                        )
                    })}


                    <View style={{ height: SMALL_VERTICAL_SPACE }} />
                    <View style={{ height: hp(16) }} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlayView: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        backgroundColor: APP_DARK_THEME
    },
    userDetailsContainer: {
        width: '100%',
        marginTop: hp(3),
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(5)
    },
    userName: {
        color: WHITE,
        fontFamily: UBUNTU.medium,
        fontSize: REGULAR
    },
    userAccess: {
        color: GRAY_WHITE,
        fontFamily: UBUNTU.regular,
        fontSize: VERY_SMALL
    },
    userIcon: {
        width: 60,
        height: 60,
        borderRadius: 10
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
    eventContainer: {
        // height: hp(45),
        borderRadius: hp(3),
        borderWidth: 1,
        borderColor: GOLD,
        overflow: 'hidden',
        backgroundColor: BASE_BLACK,
        marginBottom: VERY_SMALL_VERTICAL_SPACE
    },
    eventTitle: {
        fontFamily: UBUNTU.medium,
        color: WHITE,
        fontSize: hp(3),
        marginLeft: 16
    }
})

export default Home