import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native'
import { Searchbar, List, Dialog, Portal, Provider, TouchableRipple, TextInput, Button, withTheme } from 'react-native-paper'

import Header from '../components/Header'
import courseData from '../data/courses'
import TeeListItem from '../components/TeeListItem'
import { useStateValue, actions } from '../state/';
import { SCREENS, MIN_HANDICAP, MAX_HANDICAP, ERROR_MESSAGES } from '../constants'
import { getCourseDescription, getHandicapIndexValue, getHandicapIndexInputValue, getHoles, createHistoryItem } from '../util/dataUtil'
import EmptyScreen from '../components/EmptyScreen'
import HolesListItem from '../components/HolesListItem'

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
  const [selectedHoles, setSelectedHoles] = useState();
  const [handicap, setHandicap] = useState(handicapIndex);
  const [visible, setVisible] = React.useState(false);
  const [handicapError, setHandicapError] = useState('');

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
    setSelectedHoles(undefined);
    setHandicap(handicapIndex)
    setVisible(false);
  };

  const containerStyle = { padding: 20,  };

  const selectCourse = id => {
      if(id){
          Keyboard.dismiss()
          setSelectedTee(undefined)
          setSelectedCourse(courses.find(course => course.id === id))
          showModal()
      }
  }

  const changeHandicap = value => {
    setHandicapError('');
    value = getHandicapIndexInputValue(value)
    setHandicap(value)
  }

  const onClickCalculate = () => {
    let value = getHandicapIndexValue(handicap);
    if(!isNaN(value) && parseFloat(value) <= MAX_HANDICAP && parseFloat(value) >= MIN_HANDICAP){
        dispatch({
            type: actions.NEW_COURSE,
            course: selectedCourse,
            tee: selectedTee,
            holes: selectedHoles,
            handicapIndex: getHandicapIndexValue(handicap)
        });
        Keyboard.dismiss();
        navigation.navigate(SCREENS.HANDICAP);
        setSearchQuery('');
        setCourses([]);
        hideModal();
    }else{
        setHandicap('');
        setHandicapError(ERROR_MESSAGES.HANDICAP_INPUT_ERROR)
    }
  }

  return (
    <React.Fragment>
        <Provider>
            <Portal>
                <Dialog visible={visible} onDismiss={hideModal} style={{backgroundColor: theme.colors.background}} contentContainerStyle={containerStyle}>
                    {selectedHoles === undefined && selectedCourse &&
                        <React.Fragment>
                            <Dialog.Title style={{color: theme.colors.text}}>{'Select Tees'}</Dialog.Title>
                            <Dialog.ScrollArea >
                                <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
                                    {selectedTee === undefined && selectedCourse.tees.map((tee, index) =>
                                            <TeeListItem 
                                                key={index}
                                                tee={tee}
                                                index={index}
                                                onPress={(i) => {setSelectedTee(i)}}
                                                theme={theme}
                                            />
                                    )}
                                    {selectedTee !== undefined &&
                                        getHoles(selectedCourse.tees[selectedTee]).map((holes, index) => 
                                            <HolesListItem 
                                                 key={index}
                                                 holes={holes}
                                                 onPress={(h) => {setSelectedHoles(h)}}
                                                 theme={theme}
                                            />
                                        )
                                    }
                                </ScrollView>
                            </Dialog.ScrollArea>
                        </React.Fragment>
                    }

                    {selectedHoles !== undefined && selectedCourse && 
                        <React.Fragment>
                            <Dialog.Content>
                                <View style={styles.textInputDialog}>
                                    <TextInput
                                        autoFocus={true}
                                        label={!!handicapError ? handicapError : "Handicap Index"}
                                        value={handicap}
                                        error={!!handicapError}
                                        placeholder={"Handicap Index"}
                                        onChangeText={text => changeHandicap(text)}
                                        keyboardType={"number-pad"}
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
                {courses.length > 0 ? 
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
                    </ScrollView> : 
                
                <EmptyScreen 
                    theme={theme} 
                    icon="magnify" 
                    text={searchQuery ? `No results for '${searchQuery}'` : 'Find a Course'}/>}

            </View>
        </Provider>
    </React.Fragment>
  )
}

export default withTheme(FindCourse)