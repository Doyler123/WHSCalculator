import React from 'react'
import {List, TouchableRipple, withTheme } from 'react-native-paper'
import { ScrollView } from 'react-native'


import Header from '../components/Header'
import EmptyScreen from '../components/EmptyScreen'
import { useStateValue } from '../state/';
import { createHistoryItem } from '../util/dataUtil'

function History({ navigation, theme }) {

  const [{ history } ] = useStateValue();

  if(history.length <= 0){
    return (
      <React.Fragment>
          <Header titleText={`History`} theme={theme}/>
          <EmptyScreen theme={theme} icon="format-list-bulleted" text="History"/>
      </React.Fragment>
    )
  }

  return(
    <React.Fragment>
      <Header titleText={`History`} theme={theme}/>
      <ScrollView>      
          {history.slice(0).reverse().map((historyItem, index) => {
              let item = createHistoryItem(historyItem.course, historyItem.tee, historyItem.holes)
              return(
                <TouchableRipple key={index} onPress={() => {}} rippleColor="rgba(0, 0, 0, .32)">
                    <List.Item
                        title={item.name}
                        description={item.description}
                        left={props => <List.Icon {...props} icon="golf"/>}
                    />
                </TouchableRipple>
              )
            } 
          )}
      </ScrollView>
    </React.Fragment>
  )
}

export default withTheme(History)