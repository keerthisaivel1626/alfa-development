import React from 'react';
import { StyleSheet, Text, View, StatusBar, Image, Alert, Keyboard, TouchableOpacity, Dimensions, Platform } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view'
import { APP_DARK_THEME, ASH, DEEP_BLUE, ERROR_RED, GOLD, GRAY, OFF_WHITE, PRIMARY_RED, WHITE } from '../../utils/Colors';
import { ANONYMOUS_USER } from '../../utils/imapgepath';
import { HEIGHT, WIDTH } from '../../utils/dimension';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { INTER, UBUNTU, VIGA } from '../../utils/Fonts';
import { VERY_SMALL_VERTICAL_SPACE } from '../../utils/space';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { InputBox } from '../../components/InputBox';
import { Button } from '../../components/Button';
import { SMALL } from '../../utils/NormalizeFont';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { changeAuthStatus, storeLoginResponse } from '../../redux/reducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import { PATCHAPI, POSTAPI } from '../../utils/Network';
import { GET_ALL_USERS, UPDATE_USER, UPLOAD_FILE } from '../../utils/Endpoints';
import { Picker } from '@react-native-picker/picker';
import { check, openSettings, PERMISSIONS, request } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ISOToAnyFormat, validateUrl, YMDToAnyFormat } from '../../utils/CommonFunction';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Checkbox from '../../components/Checkbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressiveImage from '../../components/ProgressiveImage';

const Account = () => {

  const dispatch = useDispatch();
  const { loggedUserData } = useSelector((state) => state.authreducer);
  const [browseType, setBrowseType] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const STRING_WITH_APOSTROPHE_COMMA = /^[a-zA-Z' ]{0,150}$/;
  const STRING_WITH_SPACE = /^[a-zA-Z ]*$/;
  const ADDRESS_REGEX = /^[\.a-zA-Z0-9-:,!? ]*$/; //accepts all alphabets, numbers ,special chars: white space, -, :, 
  const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const [companyDetails, setCompanyDetails] = React.useState([]);
  const [childrenDetails, setChildrenDetails] = React.useState([]);
  const [clubDetails, setClubDetails] = React.useState([]);
  const { width } = Dimensions.get('screen');
  const pickerRef = React.useRef(null);
  const [date] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [childDobOpen, toggleChildDob] = React.useState(false);
  const [userDobPicker, toggleUserDobPicker] = React.useState(false);
  const [pickerStatus, setPickerStatus] = React.useState(false);
  const [pickerValue, setPickerValue] = React.useState("personal_details");
  const [companyErrors, setCompanyError] = React.useState([
    {
      "company_number": 0,
      "isAddressValid": true,
      "isIndustryNameValid": true,
      "isCompanyNameValid": true,
      "isCompanyUrlValid": true
    },
    {
      "company_number": 1,
      "isAddressValid": true,
      "isIndustryNameValid": true,
      "isCompanyNameValid": true,
      "isCompanyUrlValid": true
    },
    {
      "company_number": 2,
      "isAddressValid": true,
      "isIndustryNameValid": true,
      "isCompanyNameValid": true,
      "isCompanyUrlValid": true
    }
  ])
  const [childrenErrors, setChildrenError] = React.useState([
    {
      "children_number": 0,
      "isChildrenNameValid": true,
      "isChildrenScoolValid": true,
    },
    {
      "children_number": 1,
      "isChildrenNameValid": true,
      "isChildrenScoolValid": true,
    },
    {
      "children_number": 2,
      "isChildrenNameValid": true,
      "isChildrenScoolValid": true,
    }
  ])
  const [clubError, setClubError] = React.useState([
    {
      "club_number": 0,
      "isClubNameValid": true,

    },
    {
      "club_number": 1,
      "isClubNameValid": true,

    },
    {
      "club_number": 2,
      "isClubNameValid": true,

    }
  ])

  useFocusEffect(
    React.useCallback(() => {
      getUserDetails();
    }, [])
  );

  React.useEffect(() => {
    if (browseType)
      openCameraOrGallery();
  }, [browseType])

  const getUserDetails = async () => {
    setLoading(true);
    let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
    let params = {
      "filters": {
        "PRIMARY_MEMBER": false,
        "search": [
          {
            "FIELD_NAME": "USER.ID",
            "FIELD_VALUE": 1234567,
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
    let userDetailsres = await POSTAPI(GET_ALL_USERS, params, 12345678);
    // console.log(JSON.stringify(userDetailsres, null, 4));
    setLoading(false);
    if (userDetailsres.data.status == "success" && userDetailsres.data.code == "200") {
      let data = userDetailsres.data.data.DATA[0];
      if (data.COMPANY_DETAILS) {
        if (Array.isArray(JSON.parse(data.COMPANY_DETAILS))) {
          setCompanyDetails(JSON.parse(data.COMPANY_DETAILS))
        }
      }
      if (data.CHILDREN_DEAILS) {
        if (Array.isArray(JSON.parse(data.CHILDREN_DEAILS))) {
          setChildrenDetails(JSON.parse(data.CHILDREN_DEAILS))
        }
      }
      if (data.CLUB_MEMBERSHIP) {
        if (Array.isArray(JSON.parse(data.CLUB_MEMBERSHIP))) {
          setClubDetails(JSON.parse(data.CLUB_MEMBERSHIP))
        }
      }
      setUserData({
        firstName: data.FIRST_NAME,
        lastName: data.LAST_NAME,
        address: data.ADDRESS,
        email: data.EMAIL,
        phone: data.MOBILE,
        name_of_school: data.NAME_OF_SCHOOL,
        name_of_college: data.NAME_OF_COLLAGE,
        dob: data.DOB,
        ecardImage: data.ECARD_IMAGE
      })
      dispatch(storeLoginResponse(userDetailsres.data.data.DATA[0]));
    } else {
      setLoading(false);
      showMessage({
        type: 'danger',
        message: "Please try later."
      })
    }
  }

  const selectImage = async () => {
    Alert.alert(
      "Alfa",
      "Select profile image",
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
    let cameraStatus = await check(PERMISSIONS.ANDROID.CAMERA);
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
      let status = await request(PERMISSIONS.ANDROID.CAMERA);
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
    })
    let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
    let formData = new FormData();
    formData.append('file', imageData)
    try {
      let fileResponse = await POSTAPI(UPLOAD_FILE, formData, 12345678, 'media');

      if (fileResponse.data.code == 201 && fileResponse.data.status == "success") {
        if (pickerValue == 'personal_details') {
          updateProfile({ id: loggedUserData.ID, profileImage: fileResponse.data.data.PATH });
        }
        if (pickerValue == 'ecard') {
          updateProfile({ id: loggedUserData.ID, ecardImage: fileResponse.data.data.PATH });
        }
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

  const updateProfile = async (userObj) => {
    Keyboard.dismiss();
    showMessage({
      message: "Updating profile...",
      type: 'info',
      style: {
        alignItems: 'center'
      },
    })
    let userResFromStorage = JSON.parse(await AsyncStorage.getItem('responseAfterLogin'));
    const updateRes = await PATCHAPI(UPDATE_USER, userObj, 12345678);
    if (updateRes.data.code == 200 && updateRes.data.status == "success") {
      showMessage({
        message: "Profile updated Successfully...",
        type: 'success',
        style: {
          alignItems: 'center'
        },
      })
      getUserDetails();
    }
    // console.log(JSON.stringify(updateRes, null, 4));
  }

  const [userData, setUserData] = React.useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: ''
  });

  const submitPersonalDetails = () => {
    let { firstName, lastName, address, email, name_of_school, name_of_college, dob } = userData;
    let firstNameValid = STRING_WITH_APOSTROPHE_COMMA.test(firstName);
    let lastNameValid = STRING_WITH_SPACE.test(lastName);
    let addressValid = ADDRESS_REGEX.test(address);
    let emailValid = EMAIL_REGEX.test(email);
    let nameOfSchool = STRING_WITH_SPACE.test(name_of_school);
    let nameOfCollege = STRING_WITH_SPACE.test(name_of_college);
    if (firstNameValid && lastNameValid && addressValid && emailValid && nameOfSchool && nameOfCollege) {
      updateProfile({
        firstName,
        lastName,
        address,
        email,
        id: loggedUserData.ID,
        schoolName: name_of_school,
        collegeName: name_of_college,
        dob
      });
    } else if (!firstNameValid) {
      showMessage({
        message: "Invalid first name",
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    } else if (!lastNameValid) {
      showMessage({
        message: "Invalid last name",
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    } else if (!addressValid) {
      showMessage({
        message: "Invalid address",
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    } else if (!emailValid) {
      showMessage({
        message: "Invalid email id",
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    } else if (!nameOfSchool) {
      showMessage({
        message: "Invalid school name",
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    } else if (!nameOfCollege) {
      showMessage({
        message: "Invalid college name",
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    } else {
      return false;
    }
  }

  const addMoreCompanyField = () => {
    if (pickerValue == 'company_details' && companyDetails.length < 3) {

      if (companyDetails.length == 0) {
        let obj = {
          "companyAddress": "",
          "companyIndustry": "",
          "companyName": "",
          "companyWeb": ""
        }
        let temp = [...companyDetails, obj];
        setCompanyDetails(temp)
      } else {
        let status = checkCompanyForm();
        if (status) {
          let obj = {
            "companyAddress": "",
            "companyIndustry": "",
            "companyName": "",
            "companyWeb": ""
          }
          let temp = [...companyDetails, obj];
          setCompanyDetails(temp)
        }
      }
    } else {
      showMessage({
        message: `You can add atmost 3 companies`,
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    }
  }

  const addMoreClubField = () => {
    if (pickerValue == 'club_details' && clubDetails.length < 3) {

      if (clubDetails.length == 0) {
        let temp = [...clubDetails, ""];
        setClubDetails(temp);
      } else {
        let status = checkClubMemberShipForm();
        if (status) {
          let temp = [...clubDetails, ""];
          setClubDetails(temp)
        }
      }
    } else {
      showMessage({
        message: `You can add atmost 3 club details`,
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    }
  }

  const addMoreChildrenField = () => {
    if (pickerValue == 'children_details' && childrenDetails.length < 3) {

      if (childrenDetails.length == 0) {
        let obj = {
          "childrenName": "",
          "childrenSchool": "",
          "childrenGender": "male",
          "childrenDob": new Date()
        }
        let temp = [...childrenDetails, obj];
        setChildrenDetails(temp);
      } else {
        let status = checkChildrenForm();
        if (status) {
          let obj = {
            "childrenName": "",
            "childrenSchool": "",
            "childrenGender": "male",
            "childrenDob": new Date()
          }
          let temp = [...childrenDetails, obj];
          setChildrenDetails(temp)
        }
      }
    } else {
      showMessage({
        message: `You can add atmost 3 children`,
        type: 'danger',
        style: {
          alignItems: 'center'
        }
      })
    }
  }

  const resetCompanyErrors = () => {
    setCompanyError([
      {
        "company_number": 0,
        "isAddressValid": true,
        "isIndustryNameValid": true,
        "isCompanyNameValid": true,
        "isCompanyUrlValid": true
      },
      {
        "company_number": 1,
        "isAddressValid": true,
        "isIndustryNameValid": true,
        "isCompanyNameValid": true,
        "isCompanyUrlValid": true
      },
      {
        "company_number": 2,
        "isAddressValid": true,
        "isIndustryNameValid": true,
        "isCompanyNameValid": true,
        "isCompanyUrlValid": true
      }
    ])
  }

  const resetClubErrors = () => {
    setCompanyError([
      {
        "club_number": 0,
        "isClubNameValid": true,

      },
      {
        "club_number": 1,
        "isClubNameValid": true,

      },
      {
        "club_number": 2,
        "isClubNameValid": true,

      }
    ])
  }

  const resetChildrenErrors = () => {
    setCompanyError([
      {
        "children_number": 0,
        "isChildrenNameValid": true,
        "isChildrenScoolValid": true,
      },
      {
        "children_number": 1,
        "isChildrenNameValid": true,
        "isChildrenScoolValid": true,
      },
      {
        "children_number": 2,
        "isChildrenNameValid": true,
        "isChildrenScoolValid": true,
      }
    ])
  }

  const checkChildrenForm = () => {
    let temp = [...childrenDetails];
    let status = false
    for (let i = 0; i < temp.length; i++) {
      let isChildrenNameValid = temp[i].childrenName == "" ? false : ADDRESS_REGEX.test(temp[i].childrenName);
      let isChildrenScoolValid = temp[i].childrenSchool == "" ? false : STRING_WITH_SPACE.test(temp[i].childrenSchool);
      if (isChildrenNameValid && isChildrenScoolValid) {
        resetChildrenErrors();
        status = true;
      } else {
        let tempChildrenErrors = [...childrenErrors];
        tempChildrenErrors[i] = { ...tempChildrenErrors[i], isChildrenNameValid, isChildrenScoolValid }
        setChildrenError(tempChildrenErrors);
        status = false;
      }
    }
    return status;
  }

  const checkCompanyForm = () => {
    let temp = [...companyDetails];
    let status = false
    for (let i = 0; i < temp.length; i++) {
      let isAddressValid = temp[i].companyAddress == "" ? false : ADDRESS_REGEX.test(temp[i].companyAddress);
      let isIndustryNameValid = temp[i].companyIndustry == "" ? false : STRING_WITH_SPACE.test(temp[i].companyIndustry);
      let isCompanyNameValid = temp[i].companyName == "" ? false : STRING_WITH_APOSTROPHE_COMMA.test(temp[i].companyName);
      let isCompanyUrlValid = temp[i].companyWeb == "" ? false : validateUrl(temp[i].companyWeb);
      if (isAddressValid && isCompanyNameValid && isIndustryNameValid && isCompanyUrlValid) {
        resetCompanyErrors();
        status = true;
      } else {
        let tempCompanyErrors = [...companyErrors];
        tempCompanyErrors[i] = { ...tempCompanyErrors[i], isAddressValid, isIndustryNameValid, isCompanyNameValid, isCompanyUrlValid }
        console.log("tempCompanyErrors", JSON.stringify(tempCompanyErrors, null, 4))
        setCompanyError(tempCompanyErrors);
        status = false;
      }
    }
    return status;
  }

  const checkClubMemberShipForm = () => {
    let temp = [...clubDetails];
    let status = false
    for (let i = 0; i < temp.length; i++) {
      let isClubNameValid = temp[i] == "" ? false : STRING_WITH_SPACE.test(temp[i]);
      if (isClubNameValid) {
        resetClubErrors();
        status = true;
      } else {
        let tempClubErrors = [...clubError];
        tempClubErrors[i] = { ...tempClubErrors[i], isClubNameValid }
        setClubError(tempClubErrors);
        status = false;
      }
    }
    return status;
  }

  const submitCompanyDetails = () => {

    let formStatus = checkCompanyForm();

    if (formStatus) {
      resetCompanyErrors();
      updateProfile({
        id: loggedUserData.ID,
        companyDetails: [...companyDetails]
      });
    }
  }

  const submitChildrenDetails = () => {
    let formStatus = checkChildrenForm();

    if (formStatus) {
      resetChildrenErrors();
      updateProfile({
        id: loggedUserData.ID,
        childrenDetails: [...childrenDetails]
      });
    }
  }

  const submitClubDetails = () => {

    let formStatus = checkClubMemberShipForm();

    if (formStatus) {
      resetClubErrors();
      updateProfile({
        id: loggedUserData.ID,
        clubMembership: [...clubDetails]
      });
    }
  }

  const submitBlankCompany = () => {
    updateProfile({
      id: loggedUserData.ID,
      companyDetails: []
    });
  }

  const submitBlankChildren = () => {
    updateProfile({
      id: loggedUserData.ID,
      childrenDetails: []
    });
  }

  const submitBlankClub = () => {
    updateProfile({
      id: loggedUserData.ID,
      clubMembership: []
    });
  }

  const selectEcard = async () => {
    Alert.alert(
      "Alfa",
      "Browse/Capture E-card Image",
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



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: APP_DARK_THEME }}>
      <StatusBar barStyle="light-content" backgroundColor={APP_DARK_THEME} />

      <View style={{
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Platform.select({
          ios: hp(5),
          android: 0
        }),
      }}>
        <View>
          <Text style={{ color: WHITE, letterSpacing: 4, fontSize: hp(5), fontWeight: 'bold' }}>ALFA</Text>
          <Text style={{ color: OFF_WHITE, alignSelf: 'center', letterSpacing: 1 }}>NETWORK</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{ color: WHITE, letterSpacing: 0.05, fontFamily: INTER.medium, fontSize: hp(2.5) }}>
            Profile
          </Text>
          <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
          <AntDesign
            name='poweroff'
            color={WHITE}
            size={20}
            onPress={async () => {
              await AsyncStorage.clear();
              dispatch(changeAuthStatus(false))
            }}
          />
        </View>
      </View>
      <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            Platform.select({
              android: pickerRef?.current?.focus(),
              ios: setPickerStatus((prev => !prev))
            })
          }}
          style={{
            padding: 10,
            backgroundColor: DEEP_BLUE,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: GOLD
          }}>
          <Text style={{ color: WHITE }}>
            {pickerValue == "personal_details" ? "Personal Details"
              : pickerValue == "educational_details" ? "Educational Details" :
                pickerValue == "company_details" ? "Company Details" :
                  pickerValue == "children_details" ? "Children Details" :
                    pickerValue == "club_details" ? "Club Details" :
                      pickerValue == "ecard" ? "E-card" : ""}
          </Text>
          <EvilIcons name='chevron-down' size={hp(5)} color={"#F6F6F6"} />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          backgroundColor: GOLD,
          flexGrow: 1,
          marginTop: hp(4),
          borderTopLeftRadius: HEIGHT * .03,
          borderTopRightRadius: HEIGHT * .03,
          paddingTop: 5,

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
          zIndex: 999
        }}>
          {pickerValue == 'personal_details' && <>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            {!loading && <TouchableOpacity
              onPress={selectImage}
              style={styles.profileCircle}>

              {loggedUserData?.PROFILE_IMAGE != "" && <Image
                source={{ uri: loggedUserData?.PROFILE_IMAGE }}
                style={{
                  width: null,
                  height: null,
                  flex: 1,
                }}
              />}
              {loggedUserData?.PROFILE_IMAGE == "" && <Image
                source={ANONYMOUS_USER}
                style={{
                  width: null,
                  height: null,
                  flex: 1,
                }}
              />}

            </TouchableOpacity>}
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={{ color: GOLD, fontFamily: UBUNTU.medium, alignSelf: 'center' }}>
              Change Profile Picture
            </Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>First Name</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.firstName}
              onChangeText={(text) => {
                let data = { ...userData };
                data.firstName = text;
                setUserData(data);
              }}
            />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>Last Name</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.lastName}
              onChangeText={(text) => {
                let data = { ...userData };
                data.lastName = text;
                setUserData(data);
              }}
            />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>Date of birth</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <TouchableOpacity
              onPress={() => {
                toggleUserDobPicker(prev => !prev);
              }}
              style={{
                height: 50,
                borderRadius: 25,
                backgroundColor: GRAY,
                color: WHITE,
                paddingLeft: 16,
                fontFamily: UBUNTU.regular,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: WHITE }}>{YMDToAnyFormat(userData.dob)}</Text>
            </TouchableOpacity>

            {userDobPicker && <DatePicker
              open={userDobPicker}
              date={date}
              style={{
                alignSelf: 'center',
                backgroundColor: WHITE,
                marginVertical: VERY_SMALL_VERTICAL_SPACE
              }}
              mode={'date'}
              maximumDate={new Date()}
              modal={true}
              confirmText={'Ok'}
              cancelText={'Cancel'}
              onConfirm={(date) => {
                let tempData = { ...userData, dob: date };
                setUserData(tempData);
                toggleUserDobPicker(false);
              }}
              onCancel={() => {
                toggleUserDobPicker(false)
              }}
            />}



            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>Address</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.address}
              onChangeText={(text) => {
                let data = { ...userData };
                data.address = text;
                setUserData(data);
              }}
              customStyle={{
                height: hp(15),
                textAlignVertical: 'top'
              }}
            />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>Email</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.email}
              onChangeText={(text) => {
                let data = { ...userData };
                data.email = text;
                setUserData(data);
              }}
            />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>Anniversary Date</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <TouchableOpacity
              onPress={() => {
                setOpen(prev => !prev);
              }}
              style={{
                height: 50,
                borderRadius: 25,
                backgroundColor: GRAY,
                color: WHITE,
                paddingLeft: 16,
                fontFamily: UBUNTU.regular,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: WHITE }}>{ISOToAnyFormat(userData.DATE_OF_ANNIVERSARY)}</Text>
            </TouchableOpacity>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>School Name</Text>

            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.name_of_school}
              onChangeText={(text) => {
                let data = { ...userData };
                data.name_of_school = text;
                setUserData(data);
              }}
            />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>College Name</Text>

            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.name_of_college}
              onChangeText={(text) => {
                let data = { ...userData };
                data.name_of_college = text;
                setUserData(data);
              }}
            />
            {open && <DatePicker
              open={open}
              date={date}
              style={{
                alignSelf: 'center',
                backgroundColor: WHITE,
                marginVertical: VERY_SMALL_VERTICAL_SPACE
              }}
              mode={'date'}
              maximumDate={new Date()}
              modal={true}
              confirmText={'Ok'}
              cancelText={'Cancel'}
              onConfirm={(date) => {
                let tempData = { ...userData, DATE_OF_ANNIVERSARY: date };
                setUserData(tempData);
                setOpen(false);
              }}
              onCancel={() => {
                setOpen(false)
              }}
            />}


            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Text style={styles.label}>Phone</Text>
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <InputBox
              value={userData.phone}
              editable={false}
            />
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            <Button
              customStyle={{
                height: hp(6.5),
                backgroundColor: PRIMARY_RED,
                borderRadius: hp(3)
              }}
              title={'Submit'}
              titleStyle={{
                color: WHITE,
                fontSize: SMALL,
                fontFamily: VIGA.regular
              }}
              disabled={loading}
              onPress={submitPersonalDetails}
            />
          </>}
          {pickerValue == 'company_details' && <>
            {companyDetails.length == 0 && <Text
              style={{
                color: WHITE,
                fontFamily: UBUNTU.bold,
                alignSelf: 'center',
                marginTop: hp(3)
              }}>
              Please add company details
            </Text>
            }
            {companyDetails.length > 0 && companyDetails.map((single, index) => {
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
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Company Address</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single.companyAddress}
                    onChangeText={(text) => {
                      let data = [...companyDetails];
                      data[index].companyAddress = text;
                      setCompanyDetails(data);
                    }}
                    customStyle={{
                      height: hp(15),
                      textAlignVertical: 'top'
                    }}
                    errorStyle={!companyErrors[index].isAddressValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}

                  />
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Company Industry</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single.companyIndustry}
                    onChangeText={(text) => {
                      let data = [...companyDetails];
                      data[index].companyIndustry = text;
                      setCompanyDetails(data);
                    }}

                    errorStyle={!companyErrors[index].isIndustryNameValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}
                  />
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Company Name</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single.companyName}
                    onChangeText={(text) => {
                      let data = [...companyDetails];
                      data[index].companyName = text;
                      setCompanyDetails(data);
                    }}
                    errorStyle={!companyErrors[index].isCompanyNameValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}
                  />
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Company Web Address</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single.companyWeb}
                    onChangeText={(text) => {
                      let data = [...companyDetails];
                      data[index].companyWeb = text;
                      setCompanyDetails(data);
                    }}
                    errorStyle={!companyErrors[index].isCompanyUrlValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}
                  />
                  <Fontisto
                    name='trash'
                    size={25}
                    style={{ alignSelf: 'center', marginVertical: 15 }}
                    color={GOLD}
                    onPress={() => {
                      Alert.alert(
                        "Delete Company Details",
                        "Sure to delete this company details?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          {
                            text: "Delete",
                            style: 'destructive',
                            onPress: () => {
                              let data = [...companyDetails];
                              if (data.length > 1) {
                                data.splice(index, 1);
                                setCompanyDetails(data);
                              } else {
                                submitBlankCompany()
                              }


                            }
                          }
                        ],
                      );

                    }}
                  />
                </View>
              )
            })}
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            {companyDetails.length > 0 && <Button
              customStyle={{
                height: hp(6.5),
                backgroundColor: PRIMARY_RED,
                borderRadius: hp(3)
              }}
              title={'Submit'}
              titleStyle={{
                color: WHITE,
                fontSize: SMALL,
                fontFamily: VIGA.regular
              }}
              disabled={loading}
              onPress={submitCompanyDetails}
            />}
          </>}

          {pickerValue == 'children_details' && <>

            {childrenDetails.length == 0 && <Text
              style={{
                color: WHITE,
                fontFamily: UBUNTU.bold,
                alignSelf: 'center',
                marginTop: hp(3)
              }}>
              Please add children details
            </Text>
            }
            {childrenDetails.length > 0 && childrenDetails.map((single, index) => {
              return (
                <View key={index}>
                  {childDobOpen && <DatePicker
                    key={index}
                    open={childDobOpen}
                    date={date}
                    style={{
                      alignSelf: 'center',
                      backgroundColor: WHITE,
                      marginVertical: VERY_SMALL_VERTICAL_SPACE
                    }}
                    mode={'date'}
                    modal={true}
                    confirmText={'Ok'}
                    cancelText={'Cancel'}
                    onConfirm={(date) => {
                      let data = [...childrenDetails];
                      data[index].childrenDob = date;
                      setChildrenDetails(data);
                      toggleChildDob(false);
                    }}
                    onCancel={() => {
                      toggleChildDob(false)
                    }}
                  />}
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
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Name</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single.childrenName}
                    onChangeText={(text) => {
                      let data = [...childrenDetails];
                      data[index].childrenName = text;
                      setChildrenDetails(data);
                    }}
                    errorStyle={!childrenErrors[index].isChildrenNameValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}

                  />
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>School Name</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single.childrenSchool}
                    onChangeText={(text) => {
                      let data = [...childrenDetails];
                      data[index].childrenSchool = text;
                      setChildrenDetails(data);
                    }}

                    errorStyle={!childrenErrors[index].isChildrenScoolValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}
                  />
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Gender</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      onCheckBoxPress={() => {
                        let data = [...childrenDetails];
                        data[index].childrenGender = 'male';
                        setChildrenDetails(data);
                      }}
                      label={'Male'}
                      isSelected={single.childrenGender == 'male'}
                    />
                    <View style={{ width: VERY_SMALL_VERTICAL_SPACE }} />
                    <Checkbox
                      onCheckBoxPress={() => {
                        let data = [...childrenDetails];
                        data[index].childrenGender = 'female';
                        setChildrenDetails(data);
                      }}
                      label={'Female'}
                      isSelected={single.childrenGender == 'female'}
                    />
                  </View>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <TouchableOpacity
                    onPress={() => {
                      toggleChildDob(prev => !prev);
                    }}
                    style={{
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: GRAY,
                      color: WHITE,
                      paddingLeft: 16,
                      fontFamily: UBUNTU.regular,
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: WHITE }}>{ISOToAnyFormat(single.childrenDob)}</Text>
                  </TouchableOpacity>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Fontisto
                    name='trash'
                    size={25}
                    style={{ alignSelf: 'center', marginVertical: 15 }}
                    color={GOLD}
                    onPress={() => {
                      Alert.alert(
                        "Delete Company Details",
                        "Sure to delete this company details?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          {
                            text: "Delete",
                            style: 'destructive',
                            onPress: () => {
                              let data = [...childrenDetails];
                              if (data.length > 1) {
                                data.splice(index, 1);
                                setChildrenDetails(data);
                              } else {
                                submitBlankChildren();
                              }


                            }
                          }
                        ],
                      );

                    }}
                  />
                </View>
              )
            })}
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            {childrenDetails.length > 0 && <Button
              customStyle={{
                height: hp(6.5),
                backgroundColor: PRIMARY_RED,
                borderRadius: hp(3)
              }}
              title={'Submit'}
              titleStyle={{
                color: WHITE,
                fontSize: SMALL,
                fontFamily: VIGA.regular
              }}
              disabled={loading}
              onPress={submitChildrenDetails}
            />}
          </>}
          {pickerValue == 'club_details' && <>

            {clubDetails.length == 0 && <Text
              style={{
                color: WHITE,
                fontFamily: UBUNTU.bold,
                alignSelf: 'center',
                marginTop: hp(3)
              }}>
              Please add children details
            </Text>
            }
            {clubDetails.length > 0 && clubDetails.map((single, index) => {
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
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Text style={styles.label}>Club Name</Text>
                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <InputBox
                    value={single}
                    onChangeText={(text) => {
                      let data = [...clubDetails];
                      data[index] = text;
                      setClubDetails(data);
                    }}
                    errorStyle={!clubError[index].isClubNameValid ? {
                      borderWidth: 1,
                      borderColor: ERROR_RED
                    } : {}}

                  />

                  <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
                  <Fontisto
                    name='trash'
                    size={25}
                    style={{ alignSelf: 'center', marginVertical: 15 }}
                    color={GOLD}
                    onPress={() => {
                      Alert.alert(
                        "Delete Company Details",
                        "Sure to delete this company details?",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          {
                            text: "Delete",
                            style: 'destructive',
                            onPress: () => {
                              let data = [...clubDetails];
                              if (data.length > 1) {
                                data.splice(index, 1);
                                setClubDetails(data);
                              } else {
                                submitBlankClub();
                              }


                            }
                          }
                        ],
                      );

                    }}
                  />
                </View>
              )
            })}
            <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
            {clubDetails.length > 0 && <Button
              customStyle={{
                height: hp(6.5),
                backgroundColor: PRIMARY_RED,
                borderRadius: hp(3)
              }}
              title={'Submit'}
              titleStyle={{
                color: WHITE,
                fontSize: SMALL,
                fontFamily: VIGA.regular
              }}
              disabled={loading}
              onPress={submitClubDetails}
            />}
          </>}
          {pickerValue == 'ecard' && <>
            <TouchableOpacity onPress={selectEcard} style={styles.dottedBox}>
              <MaterialCommunityIcons name='camera-plus-outline' size={30} color={WHITE} />
              <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
              <Text style={{ color: WHITE, fontFamily: VIGA.regular }}>
                <Text style={{ color: "#5752E5", fontFamily: VIGA.regular }}>Browse / Capture</Text> to upload e-card</Text>
            </TouchableOpacity>
            <View style={{
              width: width - 32,
              height: 200
            }}>
              <ProgressiveImage
                remoteUrl={userData.ecardImage}
                width={'100%'}
                height={'100%'}
              />
            </View>
            
          </>}


          <View style={{ height: hp(30) }} />
        </View>


      </KeyboardAwareScrollView>

      {pickerValue == 'company_details' && <AntDesign
        name='pluscircle'
        onPress={() => {
          addMoreCompanyField()
        }}
        style={{
          bottom: hp(20),
          right: 20,
          position: 'absolute',
          zIndex: 9999,
        }}
        size={hp(5)}
        color={"#F6F6F6"}
      />}
      {pickerValue == 'children_details' && <AntDesign
        name='pluscircle'
        onPress={() => {
          addMoreChildrenField()
        }}
        style={{
          bottom: hp(20),
          right: 20,
          position: 'absolute',
          zIndex: 9999,
        }}
        size={hp(5)}
        color={"#F6F6F6"}
      />}
      {pickerValue == 'club_details' && <AntDesign
        name='pluscircle'
        onPress={() => {
          addMoreClubField()
        }}
        style={{
          bottom: hp(20),
          right: 20,
          position: 'absolute',
          zIndex: 9999,
        }}
        size={hp(5)}
        color={"#F6F6F6"}
      />}

      {Platform.OS == 'android' && <Picker

        style={styles.pickerContainer}
        itemStyle={styles.pickerItemStyle}
        ref={pickerRef}
        mode={'dialog'}

        selectedValue={pickerValue}
        onValueChange={(itemValue, itemIndex) => {
          setPickerValue(itemValue);
          resetChildrenErrors();
            resetClubErrors();
            resetCompanyErrors();
          setPickerStatus((prev => !prev))
        }}>
        <Picker.Item label="Personal Details" value="personal_details" />
        <Picker.Item label="Company Details" value="company_details" />
        <Picker.Item label="Children Details" value="children_details" />
        <Picker.Item label="Club Details" value="club_details" />
        <Picker.Item label="E-card" value="ecard" />
      </Picker>}
      {Platform.OS == 'ios' && pickerStatus &&
        <Picker

          style={styles.pickerContainer}
          itemStyle={styles.pickerItemStyle}
          ref={pickerRef}
          mode={'dialog'}

          selectedValue={pickerValue}
          onValueChange={(itemValue, itemIndex) => {
            setPickerValue(itemValue);
            resetChildrenErrors();
            resetClubErrors();
            resetCompanyErrors();
            setPickerStatus((prev => !prev))
          }}>
          <Picker.Item label="Personal Details" value="personal_details" />
          <Picker.Item label="Company Details" value="company_details" />
          <Picker.Item label="Children Details" value="children_details" />
          <Picker.Item label="Club Details" value="club_details" />
          <Picker.Item label="E-card" value="ecard" />
        </Picker>}
    </SafeAreaView>

  )
}

export default Account

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
  scrollWrapper: {
    flexGrow: 1,
    backgroundColor: GOLD,
    marginTop: hp(15),
    borderTopLeftRadius: HEIGHT * .03,
    borderTopRightRadius: HEIGHT * .03,
    paddingTop: 5,
    overflow: 'hidden'
  },
  formContainer: {
    flex: 1,
    backgroundColor: DEEP_BLUE,
    borderTopLeftRadius: HEIGHT * .03,
    borderTopRightRadius: HEIGHT * .03,
    paddingHorizontal: 16
  },
  profileCircle: {
    backgroundColor: GOLD,
    width: hp(16),
    height: hp(16),
    borderRadius: hp(8),
    alignSelf: 'center',
    // padding: 5,
    overflow: 'hidden'
  },
  pageHeader: {
    color: GOLD,
    alignSelf: 'center',
    fontFamily: UBUNTU.medium
  },
  label: {
    color: OFF_WHITE,
    fontFamily: INTER.medium,
    fontSize: hp(2)
  },
  errorText: {
    color: ERROR_RED,
    alignSelf: 'center'
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
  dottedBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(2),
    marginVertical: hp(2)
  },
})