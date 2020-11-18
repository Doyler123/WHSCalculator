import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native'
import { Searchbar, List, Dialog, Portal, Provider, TouchableRipple, TextInput, Button, withTheme } from 'react-native-paper'

import Header from '../components/Header'
import courseData from '../data/courses'
import TeeListItem from '../components/TeeListItem'
import { useStateValue, actions } from '../state/';
import { SCREENS } from '../constants'
import { getCourseDescription } from '../util/dataUtil'

function FindCourse({ navigation, theme }) {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
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
        },
        fab: {
            position: 'absolute',
            margin: 20,
            right: 0,
            bottom: 10
        },
        textInputDialog: {
            paddingTop: 20,
        },
        searchInput: {
            backgroundColor: theme.colors.background,
        }
    })

  const [{ handicapIndex }, dispatch ] = useStateValue();

  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedTee, setSelectedTee] = useState();
  const [handicap, setHandicap] = useState(handicapIndex);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    setHandicap(handicapIndex)
  }, [handicapIndex])

  const onChangeSearch = query => {
      setSearchQuery(query)
      if(query && query.length > 2){
          if(query){
              setCourses(courseData.filter(course => course.name.toLowerCase().includes(query.toLowerCase())))
          }
      }else{
        setCourses([]);
      }
  };

  const showModal = () => setVisible(true);

  const hideModal = () => {
    setSelectedCourse(undefined);
    setSelectedTee(undefined);
    setHandicap(handicapIndex)
    setVisible(false);
  };

  const containerStyle = {backgroundColor: 'white', padding: 20 };

  const selectCourse = id => {
      if(id){
          Keyboard.dismiss()
          setSelectedTee(undefined)
          setSelectedCourse(courses.find(course => course.id === id))
          showModal()
      }
  }

  const changeHandicap = value => {
    value = value.replace(/[^0-9.]/g, '')
    if(value.length > 4){
        value = value.substring(0, 4);
    }
    setHandicap(value)
  }

  const onClickCalculate = () => {
    dispatch({
        type: actions.NEW_COURSE,
        course: selectedCourse,
        tee: selectedTee,
        handicapIndex: handicap
    });
    Keyboard.dismiss();
    navigation.navigate(SCREENS.HANDICAP);
    setSearchQuery('');
    setCourses([]);
    hideModal();
  }

  return (
    <React.Fragment>
        <Provider>
            <Portal>
                <Dialog visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    {selectedTee === undefined && selectedCourse &&
                        <React.Fragment>
                            <Dialog.Title>{'Select Tees'}</Dialog.Title>
                            <Dialog.ScrollArea>
                                <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
                                    {selectedCourse.tees.map((tee, index) =>
                                            <TeeListItem 
                                                key={index}
                                                tee={tee}
                                                index={index}
                                                onPress={(i) => {setSelectedTee(i)}}
                                            />
                                    )}
                                </ScrollView>
                            </Dialog.ScrollArea>
                        </React.Fragment>
                    }

                    {selectedTee !== undefined && selectedCourse && 
                        <React.Fragment>
                            <Dialog.Content>
                                <View style={styles.textInputDialog}>
                                    <TextInput
                                        autoFocus={true}
                                        label="Handicap Index"
                                        value={handicap}
                                        onChangeText={text => changeHandicap(text)}
                                    />
                                </View>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => { hideModal() }}>Cancel</Button>
                                <Button onPress={() => { onClickCalculate() }}>Calculate</Button>
                            </Dialog.Actions>
                        </React.Fragment>
                    }
                </Dialog>
            </Portal>
            <Header titleText={`Find a course`} theme={theme}/>
            <View style={styles.container}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchInput}
                />
                <ScrollView>      
                    {courses.map((course, index) =>
                        <TouchableRipple key={index} onPress={() => selectCourse(course.id)} rippleColor="rgba(0, 0, 0, .32)">
                            <List.Item
                                title={course.name.split('-')[0].trim()}
                                description={getCourseDescription(course.name, course.city, course.state)}
                                left={props => <List.Icon {...props} icon="golf"/>}
                            />
                        </TouchableRipple> 
                    )}
                </ScrollView>
            </View>
        </Provider>
    </React.Fragment>
  )
}

export default withTheme(FindCourse)