import React from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, Image, } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import CommonHeader from '../../components/CommonHeader';
import { APP_DARK_THEME, BLACK, DEEP_BLUE, GOLD, OFF_WHITE, WHITE } from '../../utils/Colors';
import { INTER, UBUNTU } from '../../utils/Fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HEIGHT } from '../../utils/dimension';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { POSTAPI } from '../../utils/Network';
import { GET_MEMBERS } from '../../utils/Endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ANONYMOUS_USER } from '../../utils/imapgepath';
import ProgressiveImage from '../../components/ProgressiveImage';
import ContentLoader from 'react-native-easy-content-loader';

const Members = ({ navigation }) => {

    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false)
    useFocusEffect(React.useCallback(() => {
        getMembers();
    }, []));

    const getMembers = async () => {
        setLoading(true)
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        let params = {
            "filters": {
                "PRIMARY_MEMBER": false,
                "search": [
                    {
                        "FIELD_NAME": "USER.ID",
                        "FIELD_VALUE": "",
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
            let membersResponse = await POSTAPI(GET_MEMBERS, params, userResFromStorage.token);
            setLoading(false)
            if (membersResponse.data.code == 200 && membersResponse.data.status == "success") {
                setUsers(membersResponse.data.data.DATA)
            }
        } catch (error) {
            setLoading(false)
        }
    }

    const NUM_OF_COLUMNS = 2;

    const formatData = (dataList, numColumns) => {
        const totalRows = Math.floor(dataList.length / numColumns);
        let totalLastRow = dataList.length - (totalRows * numColumns);
        while (totalLastRow !== numColumns && totalLastRow !== 0) {
            dataList.push({ key: `blank-${totalLastRow}`, empty: true });
            totalLastRow++;
        }
        return dataList;
    }

    const [currentFont, setCurrentFont] = React.useState(hp(2));
    const AnimatedTouch = Animated.createAnimatedComponent(TouchableOpacity);

    const renderUsers = ({ item, index }) => {
        if (item.empty) {
            return <View style={{
                flex: 1,
                marginRight: (index % 2) == 0 ? hp(2) : 0,
                marginBottom: hp(2),
                height: hp('30%'),
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: 'transparent'
            }} />
        }
        return (
            <AnimatedTouch
                onPress={() => navigation.push('MemberDetails', { item: item })}
                entering={FadeInUp.duration(500)}
                style={{
                    flex: 1,
                    marginRight: (index % 2) == 0 ? hp(2) : 0,
                    marginBottom: hp(2),
                    height: hp('30%'),
                    borderRadius: 5,
                    overflow: 'hidden',
                    justifyContent: 'flex-end',
                }}>
                {item.PROFILE_IMAGE == "" && <Image
                    style={{ ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' }}
                    source={ANONYMOUS_USER}
                />}
                {item.PROFILE_IMAGE != "" && <ProgressiveImage
                    remoteUrl={item.PROFILE_IMAGE}
                    height={'100%'}
                    width={'100%'}
                />}

                <View style={{ width: '100%', backgroundColor: "#B7BFDF", padding: 16 }}>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        onTextLayout={(e) => {
                            const { lines } = e.nativeEvent;
                            if (lines.length > 1) {
                                setCurrentFont(currentFont - 1);
                            }
                        }}
                        style={{ fontFamily: UBUNTU.bold, color: BLACK }}>
                        {item.FIRST_NAME} {item.LAST_NAME}
                    </Text>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        onTextLayout={(e) => {
                            const { lines } = e.nativeEvent;
                            if (lines.length > 1) {
                                setCurrentFont(currentFont - 1);
                            }
                        }}
                        style={{ fontFamily: UBUNTU.regular, color: BLACK, fontSize: currentFont }}>
                        {item.EMAIL}
                    </Text>
                </View>
            </AnimatedTouch>
        )
    };

    const renderContentLoader = ({ item, index }) => {
        return (
            <View
                style={{
                    flex: 1,
                    marginRight: (index % 2) == 0 ? hp(2) : 0,
                    marginBottom: hp(2),
                    height: hp('30%'),
                    borderRadius: 5,
                    overflow: 'hidden'
                }}>
                <ContentLoader
                    active={true}
                    title={false}
                    pRows={1}
                    pHeight={'100%'}
                    pWidth={'100%'}
                />
            </View>
        )
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: APP_DARK_THEME }}>
            <StatusBar barStyle="light-content" backgroundColor={APP_DARK_THEME} />
            <CommonHeader
                leftComp={<View>
                    <Text style={{ color: WHITE, letterSpacing: 4, fontSize: hp(5), fontWeight: 'bold' }}>ALFA</Text>
                    <Text style={{ color: OFF_WHITE, alignSelf: 'center', letterSpacing: 1 }}>NETWORK</Text>
                </View>}
                righComp={<Text style={{ color: WHITE, letterSpacing: 0.05, fontFamily: INTER.medium, fontSize: hp(2.5) }}>Members</Text>}
            />
            <View style={styles.scrollWrapper}>
                {!loading && <FlatList
                    data={formatData(users, NUM_OF_COLUMNS)}
                    style={styles.scrollContainer}
                    contentContainerStyle={{ paddingBottom: hp(14) }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderUsers}
                    numColumns={NUM_OF_COLUMNS}
                />}
                {loading && <FlatList
                    data={formatData(new Array(4).fill({}), NUM_OF_COLUMNS)}
                    style={styles.scrollContainer}
                    contentContainerStyle={{ paddingBottom: hp(14) }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderContentLoader}
                    numColumns={NUM_OF_COLUMNS}
                />}
            </View>
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
})

export default Members