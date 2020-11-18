
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Dialog, Portal, Text, Surface, TouchableRipple, Switch, TextInput, Button } from 'react-native-paper'

import Header from '../components/Header'
import { getTeesGender, calculateCourseHandicap, calculatePlayingHandicap } from '../util/dataUtil'
import { useStateValue, actions } from '../state/';
import TeeListItem from '../components/TeeListItem';

const dialogs = {
    TEES: 'tees',
    HANDICAP_INDEX: 'hi',
    COURSE_HANDICAP: 'ch',
    PLAYING_HANDICAP: 'ph',
}

function CalculateHandicap() {

  const [{ course, tee, handicapIndex, crPar, handicapAllowance }, dispatch ] = useStateValue();

  const [handicapAllowanceValue, setHandicapAllowanceValue] = useState(`${handicapAllowance}`);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentDialog, setCurrentDialog] = useState();
  const [handicap, setHandicap] = useState(handicapIndex);

  useEffect(() => {
    setHandicap(handicapIndex)
  }, [handicapIndex])

  const hideDialog = () => {
      setDialogVisible(false)
      setCurrentDialog(undefined);
  };

  const showDialog = (dialog) => {
      setCurrentDialog(dialog);
      setDialogVisible(true)
  };
  
  const changeTees = (index) => {
    dispatch({
        type: actions.CHANGE_TEE,
        tee: index
    })
    hideDialog();
  }
  
  const changeCRPar = (crPar) => {
    dispatch({
        type: actions.SET_CR_PAR,
        crPar: crPar
    })
    hideDialog();
  }
  
  const changeHandicapAllowance = (percentage) => {
    dispatch({
        type: actions.SET_HANDICAP_ALLOWANCE,
        handicapAllowance: percentage
    })
    hideDialog();
  }
  
  const changeHandicapIndex = (handicapIndex) => {
    dispatch({
        type: actions.SET_HANDICAP_INDEX,
        handicapIndex: handicapIndex
    })
    hideDialog();
  }
  
  const changeHandicapAllowanceValue = (value) => {
      value = value.replace(/[^0-9]/g, '')
      if(value.length > 3){
          value = value.substring(0, 3);
      }
      setHandicapAllowanceValue(value);
  }

  const changeHandicap = value => {
    value = value.replace(/[^0-9.]/g, '')
    if(value.length > 4){
        value = value.substring(0, 4);
    }
    setHandicap(value)
  }

  if(!course && !tee && !handicapIndex){
    return(
        <React.Fragment>
            <Header titleText={`No Course Selected`} />
        </React.Fragment>
    ) 
  }

  return (
      <React.Fragment>
           <Header titleText={course.name.split('-')[0].trim()} />
            <View style={styles.container}>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(dialogs.TEES)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Tees`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={styles.bodyText}>{`${course.tees[tee].name}`}</Text>
                                <Text style={styles.bodyTextSecondary}>{`(${getTeesGender(course.tees[tee].gender)})`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(dialogs.HANDICAP_INDEX)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Hcap Index`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={styles.bodyTextLarge}>{`${handicapIndex}`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceHeader}>{`Slope`}</Text>
                    <View style={styles.surfaceBody}>
                        <Text style={styles.bodyTextLarge}>{`${course.tees[tee].slopeRating}`}</Text>
                    </View>
                    <Text style={styles.surfaceFooter}>{``}</Text>
                </Surface>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceHeader}>{`Course Rating`}</Text>
                    <View style={styles.surfaceBody}>
                        <Text style={styles.bodyTextLarge}>{`${course.tees[tee].courseRating}`}</Text>
                        <Text style={styles.bodyTextSecondary}>{`(Par ${course.tees[tee].par})`}</Text>
                    </View>
                    <Text style={styles.surfaceFooter}>{``}</Text>
                </Surface>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(dialogs.COURSE_HANDICAP)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Course Hcap`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={styles.bodyText}>{calculateCourseHandicap(course.tees[tee], handicapIndex, crPar)}</Text>
                                <Text style={styles.bodyTextSecondary}>{`(${ crPar ? 'with' : 'without'} CR - Par)`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(dialogs.PLAYING_HANDICAP)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Playing Hcap`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={styles.bodyText}>{calculatePlayingHandicap(course.tees[tee], handicapIndex, crPar, handicapAllowance)}</Text>
                                <Text style={styles.bodyTextSecondary}>{`(allowance ${handicapAllowance}%)`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
            </View>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    {currentDialog === dialogs.TEES && <React.Fragment>
                        <Dialog.Title>{'Change Tees'}</Dialog.Title>
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
                                {course && course.tees.map((tee, index) => 
                                    <TeeListItem 
                                        key={index}
                                        tee={tee}
                                        index={index}
                                        onPress={(i) => {changeTees(i)}}
                                    />
                                )}
                            </ScrollView>
                        </Dialog.ScrollArea>
                    </React.Fragment>}
                    {currentDialog === dialogs.HANDICAP_INDEX && <React.Fragment>
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
                            <Button onPress={() => hideDialog()}>Cancel</Button>
                            <Button onPress={() => changeHandicapIndex(handicap)}>Ok</Button>
                        </Dialog.Actions>
                    </React.Fragment>}
                    {currentDialog === dialogs.COURSE_HANDICAP && <React.Fragment>
                        <Dialog.Content>
                            <View style={styles.switchView}>
                                <Text style={styles.switchText}>{'Course Rating - Par'}</Text>
                                <Switch value={crPar} onValueChange={() => changeCRPar(!crPar)} />
                            </View>
                        </Dialog.Content>
                    </React.Fragment>}
                    {currentDialog === dialogs.PLAYING_HANDICAP && <React.Fragment>
                        <Dialog.Content>
                            <View style={styles.textInputDialog}>
                                <TextInput
                                    label="Handicap Allowance"
                                    value={handicapAllowanceValue}
                                    onChangeText={text => changeHandicapAllowanceValue(text)}
                                    right={<TextInput.Affix text="%" textStyle={{fontSize: 20}}/>}
                                />
                            </View>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => hideDialog()}>Cancel</Button>
                            <Button onPress={() => changeHandicapAllowance(handicapAllowanceValue)}>Ok</Button>
                        </Dialog.Actions>
                    </React.Fragment>}
                </Dialog>
            </Portal>
      </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 40,
    flexWrap: 'wrap'
  },
  bodyText: {
    fontSize: 25,
  },
  bodyTextSecondary: {
    fontSize: 10
  },
  bodyTextLarge: {
    fontSize: 30
  },
  ripple: {
    // width: '100%'
    alignItems: 'center'
  },
  surface: {
    padding: 8,
    height: 140,
    width: '45%',
    alignItems: 'center',
    elevation: 6,
    marginBottom: 20
  },
  surfaceHeader: {
    flex: 2,
    fontSize: 20,
    fontWeight: 'bold'
  },
  surfaceBody: {
      flex: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
  },
  surfaceFooter: {
      flex: 1,
      fontSize: 10
  },
  switchView: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingTop: 20,
  },
  textInputDialog: {
      paddingTop: 20,
  },
  switchText: {
    fontSize: 17
  }
})

export default CalculateHandicap