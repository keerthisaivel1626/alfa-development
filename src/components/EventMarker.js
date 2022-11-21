import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SMALL_VERTICAL_SPACE, VERY_SMALL_VERTICAL_SPACE } from '../utils/space'
import ContentLoader from 'react-native-easy-content-loader'

const EventMarker = ({ title, count, customStyle, titleStyle, countStyle, loading }) => {
  return (
    <View style={[styles.container, customStyle]}>
      <Text style={titleStyle}>{title}</Text>
      <View style={{ height: VERY_SMALL_VERTICAL_SPACE }} />
      {!loading && <Text style={countStyle}>{count}</Text>}
      <ContentLoader
          loading={loading}
          active={true}
          title={false}
          pRows={1}
          pHeight={20}
          pWidth={20}
          containerStyles={{height:20,width:20}}
        />

    </View>
  )
}

export default EventMarker

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})