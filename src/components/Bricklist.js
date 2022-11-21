import React from 'react';
import { StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PRIMARY_RED, WHITE } from '../utils/Colors';
import { WIDTH } from '../utils/dimension';

const RED_CIRCLE = 25;

const BrickList = React.memo(({ items }) => {

    const renderItem = ({ item, index }) => {
        return <ImageCard item={item} index={index} />;
    };

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

    const ImageCard = ({ item }) => {
        var randomHeights = [150,100,280,];
        var randomHeight = randomHeights[Math.floor(Math.random()*randomHeights.length)];
        const { IMAGE_PATH, isDelete } = item;
        return (
            <AnimatedTouchable
                entering={FadeInUp.duration(500)}
                style={{
                    marginHorizontal: 6,
                    height: randomHeight,
                    width: ((WIDTH - 56) / 2),
                    borderRadius: 10,
                    marginBottom: 12
                }}>
                <Image source={{uri:IMAGE_PATH}} style={{ width: null, height: null, flex: 1, borderRadius: 10 }} />
                {isDelete && <Pressable
                    style={{
                        position: 'absolute',
                        zIndex: 999,
                        borderRadius: RED_CIRCLE / 2,
                        width: RED_CIRCLE,
                        height: RED_CIRCLE,
                        justifyContent: 'center',
                        alignItems: 'center',
                        right: -5,
                        backgroundColor: PRIMARY_RED,
                        top: -hp(2)
                    }}>
                    <Ionicons
                        name='close'
                        size={RED_CIRCLE * .7}
                        color={WHITE}
                    />
                </Pressable>}
            </AnimatedTouchable>
        );
    };


    return (
        <MasonryList
            contentContainerStyle={{
                paddingBottom: hp(14),
                paddingTop: hp(3)
            }}
            keyExtractor={(item,index) => index.toString()}
            data={items}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
        />
    )

})

export default BrickList

const styles = StyleSheet.create({})