import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native'
import { Searchbar, List, Portal, TouchableRipple, withTheme } from 'react-native-paper'

import Header from '../components/Header'
import courseData from '../data/courses'
import { useStateValue, actions } from '../state/';
import { SCREENS } from '../constants'
import { getCourseDescription } from '../util/dataUtil'
import EmptyScreen from '../components/EmptyScreen'
import SelectTeesDialog from '../components/SelectTeesDialog'
import HandicapIndexDialog from '../components/HandicapIndexDialog'

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
  const [courseDialogVisible, setCourseDialogVisible] = React.useState(false);
  const [hcapDialogVisible, setHcapDialogVisible] = React.useState(false);


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

  const showModal = () => setCourseDialogVisible(true);

  const hideModal = () => {
    setSelectedCourse(undefined);
    setSelectedTee(undefined);
    setSelectedHoles(undefined);
    setHcapDialogVisible(false);
    setCourseDialogVisible(false);
  };

  const selectTees = (tees, holes) => {
      setSelectedTee(tees)
      setSelectedHoles(holes)
      setCourseDialogVisible(false);
      setHcapDialogVisible(true);
  }

  const selectCourse = id => {
      if(id){
          Keyboard.dismiss()
          setSelectedTee(undefined)
          setSelectedCourse(courses.find(course => course.id === id))
          showModal()
      }
  }

  const onClickCalculate = (value) => {
    dispatch({
        type: actions.NEW_COURSE,
        course: selectedCourse,
        tee: selectedTee,
        holes: selectedHoles,
        handicapIndex: value
    });
    Keyboard.dismiss();
    navigation.navigate(SCREENS.HANDICAP);
    setSearchQuery('');
    setCourses([]);
    hideModal();
  }

  return (
    <React.Fragment>
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
                    text={searchQuery ? `No results for '${searchQuery}'` : 'Find a Course'}
                />
            }

        </View>
        <Portal>
            <SelectTeesDialog 
                theme={theme}
                title={'Select Tees'}
                dialogVisible={courseDialogVisible}
                hideDialog={hideModal}
                course={selectedCourse}
                onSelect={(tees, holes) => selectTees(tees, holes)}
            />
            
            <HandicapIndexDialog 
                theme={theme}
                currentHandicap={handicapIndex}
                dialogVisible={hcapDialogVisible}
                hideDialog={hideModal}
                onClickOk={(value) => onClickCalculate(value)}
                okLabel={'Calculate'}
            />
        </Portal>
    </React.Fragment>
  )
}

export default withTheme(FindCourse)