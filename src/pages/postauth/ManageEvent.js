import React from 'react'
import { StyleSheet, Text, View, StatusBar, Switch, TouchableOpacity, Alert, ScrollView, Image, Pressable, Platform } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view'
import { WIDTH, HEIGHT } from '../../utils/dimension';
import { WHITE, OFF_WHITE, GOLD, DEEP_BLUE, ASH, APP_DARK_THEME, PRIMARY_RED } from '../../utils/Colors';
import { INTER, UBUNTU, VIGA } from '../../utils/Fonts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonHeader from '../../components/CommonHeader';
import { SMALL_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { check, openSettings, PERMISSIONS, request, checkMultiple } from 'react-native-permissions';
import { hideMessage, showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ADD_EVENT_GALLERY, DELETE_IMAGE, EVENT_GALLERY_LSTING, UPLOAD_FILE } from '../../utils/Endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DELETEAPI, POSTAPI } from '../../utils/Network';
import { populateGallery } from '../../redux/reducers/EventGallery';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressiveImage from '../../components/ProgressiveImage';


const ManageEvent = ({ route, navigation }) => {

    const { gallery } = useSelector((state) => state.eventGalleryReducer);
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [browseType, setBrowseType] = React.useState('');
    const { eventId } = route.params;
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const { loggedUserData } = useSelector((state) => state.authreducer);

    const dispatch = useDispatch();

    const NUMBER_OF_COLUMN = 3;
    const GRID_BOX_SPACE = 10;
    const RED_CIRCLE = 25;

    const selectImage = async () => {
        Alert.alert(
            "Alfa",
            "Browse Image",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Camera",
                    onPress: async () => {
                        let status = await checkCameraStatus();
                        if (status) {
                            setBrowseType('camera');
                        }
                    },
                    style: 'default'
                },
                {
                    text: "Gallery",
                    onPress: async () => {
                        let status = await checkCameraStatus();
                        if (status) {
                            setBrowseType('gallery');
                        }
                    },
                    style: 'default'
                },
            ]
        );
    }

    const checkCameraStatus = async () => {
        let cameraStatus = Platform.OS=='android'?  await check(PERMISSIONS.ANDROID.CAMERA)
            :await check(PERMISSIONS.IOS.CAMERA) ;
        if (cameraStatus == 'unavailable') {
            showMessage({
                message: `Camera is unavailable.`,
                type: 'danger',
                style: {
                    alignItems: 'center'
                },
                autoHide: true,
                duration: 1500
            })
        }
        else if (cameraStatus == 'denied') {
            let status = await request(Platform.OS=='android'?PERMISSIONS.ANDROID.CAMERA:PERMISSIONS.IOS.CAMERA);
            if (status == 'granted') {
                return true;
            } else if (status == 'blocked') {
                openSettings().catch(() => {
                    showMessage({
                        message: `Can't open settings.`,
                        type: 'warning',
                        style: {
                            alignItems: 'center'
                        },
                        autoHide: true,
                        duration: 1500
                    });
                    return false;
                })
            } else {
                return false;
            }
        } else if (cameraStatus == 'blocked') {
            openSettings().catch(() => {
                showMessage({
                    message: `Can't open settings.`,
                    type: 'warning',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: true,
                    duration: 1500
                });
                return false;
            })
        } else if (cameraStatus == 'granted') {
            return true;
        }
    }

    React.useEffect(() => {
        if (browseType)
            openCameraOrGallery();
    }, [browseType])

    const openCameraOrGallery = async () => {
        let result;
        if (browseType == 'camera') {
            setBrowseType('');
            result = await launchCamera({
                mediaType: 'photo',
                quality: 1
            });
        } else {
            setBrowseType('');
            result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1
            });
        }
        uploadFile({
            uri: result.assets[0].uri,
            name: result.assets[0].fileName,
            type: result.assets[0].type
        })
    }

    const uploadFile = async (imageData) => {
        showMessage({
            message: "Uploading image...",
            type: 'info',
            style: {
                alignItems: 'center'
            },
            autoHide: false
        })
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        let formData = new FormData();
        formData.append('file', imageData)
        try {
            let fileResponse = await POSTAPI(UPLOAD_FILE, formData, userResFromStorage.token, 'media');

            if (fileResponse.data.code == 201 && fileResponse.data.status == "success") {
                addEventGallery(fileResponse.data.data.PATH);
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

    const addEventGallery = async (imagePath) => {
        let params = {
            eventId,
            "userId": loggedUserData.ID,
            imagePath,
            "status": "active"
        }
        let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
        try {
            let addEventGalleryRes = await POSTAPI(ADD_EVENT_GALLERY, params, userResFromStorage.token);
            if (addEventGalleryRes.data.code == 200 && addEventGalleryRes.data.status == "success") {
                showMessage({
                    message: "Image uploading done...",
                    type: 'success',
                    style: {
                        alignItems: 'center'
                    },
                    autoHide: false
                });
                viewGallery()
            }
        } catch (error) {
            showMessage({
                message: "Please try after some time.",
                type: 'danger',
                style: {
                    alignItems: 'center'
                }
            })
        }

    }

    const viewGallery = async () => {
        showMessage({
            message: `Repopulating Image...`,
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
            if (galleryResponse.data.hasOwnProperty('data')) {
                if (galleryResponse.data.code == 200 && galleryResponse.data.status == "success") {
                    let gallery = galleryResponse.data.data;
                    for (let key in gallery) {

                        if (loggedUserData.ID == key) {
                            let uploadedBy = "me";
                            let obj = {
                                uploadedBy,
                                data: gallery[key].map(v => ({ ...v, isDelete: true }))
                            }
                            eventGallery.push(obj);
                        } else {
                            let uploadedBy = gallery[key][0]['FIRST_NAME'];
                            let obj = {
                                uploadedBy,
                                data: gallery[key].map(v => ({ ...v, isDelete: false }))
                            }
                            eventGallery.push(obj);
                        }
                    }
                    let index = eventGallery.findIndex((single, index) => single.uploadedBy == 'me');
                    eventGallery.unshift(eventGallery.splice(index, 1)[0]);
                    dispatch(populateGallery(eventGallery))
                }
            } else {
                dispatch(populateGallery([]))
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

    const formatData = (dataList, numColumns) => {
        if (dataList.length % numColumns != 0) {
            dataList.push({ key: `blank-${dataList.length + 1}`, empty: true });
        }
        return dataList;
    }

    const deleteImage = async (imageId) => {
        Alert.alert(
            "Alfa",
            "This operation will delete this image",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        showMessage({
                            message: `Deleting Image...`,
                            type: 'info',
                            style: {
                                alignItems: 'center'
                            }
                        })
                        try {
                            let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
                            let deleteImageRes = await DELETEAPI(`${DELETE_IMAGE}&id=${imageId}`, userResFromStorage.token);
                            if (deleteImageRes.data.code == 200 && deleteImageRes.data.status == "success") {
                                showMessage({
                                    message: `Deleted Successfully...`,
                                    type: 'success',
                                    style: {
                                        alignItems: 'center'
                                    }
                                })
                                viewGallery();
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
                    },
                    style: 'destructive'
                }
            ]
        );
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: APP_DARK_THEME }}>
            <StatusBar barStyle="light-content" backgroundColor={APP_DARK_THEME} />
            <CommonHeader
                leftComp={<View>
                    <Text style={{ color: WHITE, letterSpacing: 4, fontSize: hp(5), fontWeight: 'bold' }}>ALFA</Text>
                    <Text style={{ color: OFF_WHITE, alignSelf: 'center', letterSpacing: 1 }}>NETWORK</Text>
                </View>}
                righComp={<Text style={{ color: WHITE, letterSpacing: 0.05, fontFamily: INTER.medium, fontSize: hp(2.5) }}>Gallery</Text>}
            />
            <View
                style={{
                    backgroundColor: GOLD,
                    flexGrow: 1,
                    marginTop: hp(15),
                    borderTopLeftRadius: HEIGHT * .03,
                    borderTopRightRadius: HEIGHT * .03,
                    paddingTop: 5
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    backgroundColor: DEEP_BLUE,
                    borderTopLeftRadius: HEIGHT * .03,
                    borderTopRightRadius: HEIGHT * .03,
                }}>
                    <View style={{ height: SMALL_VERTICAL_SPACE }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: GOLD, fontFamily: VIGA.regular }}>
                            Manage Event Gallery
                        </Text>
                        <Switch
                            trackColor={{ false: ASH, true: GOLD }}
                            thumbColor={isEnabled ? WHITE : GOLD}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                            style={{ transform: [{ scaleY: 1 }, { scaleX: 1.1 }] }}
                        />
                    </View>
                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />

                    {isEnabled && <TouchableOpacity onPress={selectImage} style={styles.dottedBox}>
                        <MaterialCommunityIcons name='camera-plus-outline' size={30} color={WHITE} />
                        <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                        <Text style={{ color: WHITE, fontFamily: VIGA.regular }}><Text style={{ color: "#5752E5", fontFamily: VIGA.regular }}>Browse</Text> to upload image in this gallery</Text>
                    </TouchableOpacity>}

                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(12) }}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {gallery.length > 0 && gallery.map((single, index) => {
                            let totalRows = Math.ceil(single.data.length / NUMBER_OF_COLUMN)
                            let imageGrid = JSON.parse(JSON.stringify(single.data))
                            return (
                                <View key={index}
                                    style={{
                                        marginBottom: 20
                                    }}>
                                    <Text style={styles.sectionHeader}>Uploaded by {single.uploadedBy}</Text>
                                    <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                                    {[...Array(totalRows)].map((_, index) => {
                                        let data = [...formatData(imageGrid, NUMBER_OF_COLUMN)];
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    flexDirection: 'row',
                                                    marginBottom: 10,
                                                    justifyContent: 'space-between',
                                                }}>
                                                {data.slice((index * NUMBER_OF_COLUMN), ((index * NUMBER_OF_COLUMN) + NUMBER_OF_COLUMN))
                                                    .map((item, childIndex) => {
                                                        let rowWidth = WIDTH - 32;
                                                        let totalSpace = (rowWidth - (GRID_BOX_SPACE * (NUMBER_OF_COLUMN - 1)));
                                                        let gridBoxWidth = Math.ceil((totalSpace / NUMBER_OF_COLUMN));
                                                        if (item.empty) {
                                                            return (
                                                                <View
                                                                    key={childIndex}
                                                                    style={
                                                                        {
                                                                            ...styles.invisibleSlot,
                                                                            width: gridBoxWidth,
                                                                            height: 90
                                                                        }
                                                                    }>

                                                                </View>
                                                            )
                                                        }
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                    navigation.navigate('EventGalleryImage',{imageUrl:item.IMAGE_PATH})
                                                                }}
                                                                key={childIndex}
                                                                style={{
                                                                    width: gridBoxWidth,
                                                                    height: 90,
                                                                    marginBottom: 10,
                                                                    borderRadius: 5,
                                                                    // overflow: 'hidden'
                                                                }}>
                                                                {item.isDelete && isEnabled && <Pressable
                                                                    onPress={() => {
                                                                        deleteImage(item.ID)
                                                                    }}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        zIndex: 999,
                                                                        borderRadius: RED_CIRCLE / 2,
                                                                        width: RED_CIRCLE,
                                                                        height: RED_CIRCLE,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        right: .5,
                                                                        backgroundColor: PRIMARY_RED,
                                                                        top: -hp(1.5)
                                                                    }}>
                                                                    <Ionicons
                                                                        name='close'
                                                                        size={RED_CIRCLE * .7}
                                                                        color={WHITE}
                                                                    />
                                                                </Pressable>}
                                                                <ProgressiveImage
                                                                    remoteUrl={item.IMAGE_PATH}
                                                                    width={gridBoxWidth}
                                                                    height={90}
                                                                />
                                                            </TouchableOpacity>
                                                        )
                                                    })}
                                            </View>
                                        )
                                    })}
                                </View>
                            )
                        })}

                    </ScrollView>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default ManageEvent

const styles = StyleSheet.create({
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
    dottedBox: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: GOLD,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(2)
    },
    sectionHeader: {
        color: WHITE,
        fontFamily: UBUNTU.bold,
        fontSize: hp(2)
    },
    invisibleSlot: {
        backgroundColor: 'transparent',
        paddingHorizontal: 6,
        paddingVertical: 10
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    }
})