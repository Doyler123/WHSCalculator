import React from 'react'
import {List, TouchableRipple, withTheme, Portal } from 'react-native-paper'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import Header from '../components/Header'
import EmptyScreen from '../components/EmptyScreen'
import { useStateValue, actions } from '../state/';
import { createHistoryItem } from '../util/dataUtil'
import { SCREENS } from '../constants'

function History({ navigation, theme }) {

  const styles = StyleSheet.create({
    listItemStyle: {
      borderTopColor: '#dbdbd6',
      borderTopWidth: 1
    },
    dateContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 15,
      paddingLeft: 10
    },
    dateIcon: {
    },
    dateText: {
      fontSize: 9,
      color: theme.colors.text
    }
  })

  const [{ history, handicapIndex }, dispatch ] = useStateValue();

  if(history.length <= 0){
    return (
      <React.Fragment>
          <Header titleText={`History`} theme={theme}/>
          <EmptyScreen theme={theme} icon="format-list-bulleted" text="History"/>
      </React.Fragment>
    )
  }

  const DateBlock = ({date}) => (
    <View style={styles.dateContainer}>
      <MaterialCommunityIcons style={styles.dateIcon} name="calendar-month" size={30} color={theme.colors.text}/>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  )

  const onClickItem = (historyItem) => {
    dispatch({
      type: actions.NEW_COURSE,
      course: historyItem.course,
      tee: historyItem.tee,
      holes: historyItem.holes,
      handicapIndex: handicapIndex
    });
    navigation.navigate(SCREENS.HANDICAP);
  }

  return(
    <React.Fragment>
      <Header titleText={`History`} theme={theme}/>
      <ScrollView>
        <List.Section>
          <List.Subheader>Recent Courses</List.Subheader>
          {history.slice(0).reverse().map((historyItem, index) => {
              let item = createHistoryItem(historyItem.course, historyItem.tee, historyItem.holes)
              return(
                <TouchableRipple key={index} onPress={() => { onClickItem(historyItem) }} rippleColor="rgba(0, 0, 0, .32)">
                    <List.Item
                        style={styles.listItemStyle}
                        title={item.name}
                        description={`${item.description}\n${item.info}`}
                        left={props => <DateBlock date={historyItem.date}/>}
                    />
                </TouchableRipple>
              )
            } 
          )}
        </List.Section>    
      </ScrollView>
    </React.Fragment>
  )
}

export default withTheme(History)