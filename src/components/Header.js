
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Title } from 'react-native-paper'

function Header({ theme, titleText, actionIcon, action }) {
    const styles = StyleSheet.create({
      headerContainer: {
        backgroundColor: theme.colors.primary
      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      title: {
        color: 'white'
      }
    })

    return (
      <Appbar.Header style={styles.headerContainer}>
        <View style={styles.container}>
          <Title style={styles.title}>{titleText}</Title>
        </View>
        {actionIcon && action && <Appbar.Action icon={actionIcon} onPress={() => {action()}} />}
      </Appbar.Header>
    )

  }
  
  export default Header