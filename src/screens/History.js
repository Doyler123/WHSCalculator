import React from 'react'
import { withTheme } from 'react-native-paper'


import Header from '../components/Header'
import EmptyScreen from '../components/EmptyScreen'

function History({ navigation, theme }) {

  return (
    <React.Fragment>
        <Header titleText={`History`} theme={theme}/>
        <EmptyScreen theme={theme} icon="format-list-bulleted" text="History"/>
    </React.Fragment>
  )
}

export default withTheme(History)