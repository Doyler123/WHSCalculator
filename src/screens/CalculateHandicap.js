
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import Header from '../components/Header'

function CalculateHandicap() {
  return (
      <React.Fragment>
           <Header titleText='Calculate Your Handicap' />
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Notes modal screen</Text>
                </View>
            </View>
      </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  title: {
    fontSize: 20
  }
})

export default CalculateHandicap