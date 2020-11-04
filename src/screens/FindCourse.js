import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, FAB, Searchbar, List, Modal, Portal, Provider, TouchableRipple, Colors } from 'react-native-paper'

import Header from '../components/Header'
import courseData from '../data/courses'

function FindCourse({ navigation }) {

  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [visible, setVisible] = React.useState(false);

  const onChangeSearch = query => {
      setSearchQuery(query)
      if(query){
          setCourses(courseData.filter(course => course.name.includes(query)))
      }else{
          setCourses([])
      }
  };


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {backgroundColor: 'white', padding: 20 };

  const selectCourse = id => {
      if(id){
          setSelectedCourse(courses.find(course => course.id === id))
          showModal()
        }
  }

  return (
    <React.Fragment>
        <Provider>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                {selectedCourse && selectedCourse.tees.map((tee, index) => 
                    <TouchableRipple key={index} onPress={() => {}} rippleColor="rgba(0, 0, 0, .32)">
                        <List.Item
                            title={`${tee.name} - ${tee.gender}`}
                            description={`Slope:  ${tee.slopeRating}`}
                            left={props => <List.Icon {...props} icon="circle" />}
                        />
                    </TouchableRipple>
                )}
                </Modal>
            </Portal>
            <Header titleText='Find a course' />
            <View style={styles.container}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                {courses.map((course, index) =>
                    <TouchableRipple key={index} onPress={() => selectCourse(course.id)} rippleColor="rgba(0, 0, 0, .32)">
                        <List.Item
                            title={course.name.split('-')[0].trim()}
                            description={`${course.city} ${course.state}`}
                            left={props => <List.Icon {...props} icon="golf" 
                             />}
                        />
                    </TouchableRipple> 
                )}
                <FAB
                    style={styles.fab}
                    small
                    icon='plus'
                    label='Add new note'
                    onPress={() => navigation.navigate('CalculateHandicap')}
                />
            </View>
        </Provider>
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
    },
    fab: {
      position: 'absolute',
      margin: 20,
      right: 0,
      bottom: 10
    }
  })

export default FindCourse