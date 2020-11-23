
import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Dialog, Portal, Text, Surface, TouchableRipple, Switch, TextInput, Button, withTheme } from 'react-native-paper'

import Header from '../components/Header'
import { getTeesGender,
     getHandicapIndexInputValue, 
     getHandicapIndexValue, 
     getHandicapIndexDisplayValue, 
     calculateCourseHandicap, 
     calculatePlayingHandicap,
     getHandicapDisplayValue } from '../util/dataUtil'
import { useStateValue, actions } from '../state/';
import { SCREENS, DATA_TILES } from '../constants';
import EmptyScreen from '../components/EmptyScreen'
import SelectTeesDialog from '../components/SelectTeesDialog'
import HandicapIndexDialog from '../components/HandicapIndexDialog'
import DataTile from '../components/DataTile'

function CalculateHandicap({ navigation, theme }) {

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: theme.colors.background,
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
        bodyTextSmall: {
          fontSize: 20
        },
        ripple: {
          alignItems: 'center'
        },
        surface: {
          padding: 8,
          height: 140,
          width: '45%',
          alignItems: 'center',
          elevation: 8,
          marginBottom: 20,
          borderRadius: 15
        },
        surfaceHeader: {
          flex: 2,
          fontSize: 19,
          fontFamily: 'Lusitana_700Bold'
        },
        surfaceBody: {
            flex: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        },
        surfaceFooter: {
            flex: 1,
            fontSize: 10,
            fontFamily: 'Lusitana_400Regular'
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
        },
        dialogStyle: {
            backgroundColor: theme.colors.background
        },
        highlightText: {
            fontWeight: 'bold'
        }
      })

  const [{ course, tee, holes, handicapIndex, crPar, handicapAllowance }, dispatch ] = useStateValue();
  
  const [handicapAllowanceValue, setHandicapAllowanceValue] = useState(`${handicapAllowance}`);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentDialog, setCurrentDialog] = useState();

  const hideDialog = () => {
      setDialogVisible(false)
      setCurrentDialog(undefined);
  };

  const showDialog = (dialog) => {
      setCurrentDialog(dialog);
      setDialogVisible(true)
  };
  
  const changeTees = (tees, holes) => {
    dispatch({
        type: actions.CHANGE_TEE,
        tee: tees,
        holes: holes
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
  
  const changeHandicapIndex = (value) => {
    dispatch({
        type: actions.SET_HANDICAP_INDEX,
        handicapIndex: value
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

  const getTeeTileBody = (name, gender, holes) => {
      if(name.length > 6){
        if(name.includes('-')){
            let nameElements = name.split('-');
            let part1 = nameElements[0].trim(); 
            let part2 = nameElements.length > 1 ? nameElements[1].trim() : null; 
            return(
                <React.Fragment>
                    {part1 && <Text style={styles.bodyTextSmall}>{`${part1}`}</Text>}
                    {part2 && <Text style={styles.bodyTextSmall}>{`${part2}`}</Text>}
                    <Text style={styles.bodyTextSecondary}>{`(${holes.name} - ${getTeesGender(gender)})`}</Text>
                </React.Fragment>
            )
        }else{
            return(
                <React.Fragment>
                    <Text style={styles.bodyTextSmall}>{`${name}`}</Text>
                    <Text style={styles.bodyTextSecondary}>{`(${holes.name} - ${getTeesGender(gender)})`}</Text>
                </React.Fragment>
            )
        }
      }
      return(
          <React.Fragment>
              <Text style={styles.bodyText}>{`${name}`}</Text>
              <Text style={styles.bodyTextSecondary}>{`(${holes.name} - ${getTeesGender(gender)})`}</Text>
          </React.Fragment>
      )
  }

  if(!course && !tee && !handicapIndex){
    return(
        <React.Fragment>
            <Header titleText="No course selected" actionIcon="magnify" action={() => navigation.navigate(SCREENS.SEARCH)} theme={theme}/>
            <EmptyScreen 
                theme={theme}
                icon={'golf'}
                text="No course selected"
                onPress={() => navigation.navigate(SCREENS.SEARCH)}
            />
        </React.Fragment>
    )
  }

  return (
      <React.Fragment>
           <Header titleText={course.name.split('-')[0].trim()} theme={theme} actionIcon="magnify" action={() => navigation.navigate(SCREENS.SEARCH)}/>
            <View style={styles.container}>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(DATA_TILES.TEES)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Tees`}</Text>
                            <View style={styles.surfaceBody}>
                                {getTeeTileBody(course.tees[tee].name, course.tees[tee].gender, holes)}
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(DATA_TILES.HANDICAP_INDEX)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Hcap Index`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={styles.bodyTextLarge}>{`${getHandicapIndexDisplayValue(handicapIndex)}`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceHeader}>{`Slope`}</Text>
                    <View style={styles.surfaceBody}>
                        <Text style={styles.bodyTextLarge}>{`${holes.slopeRating}`}</Text>
                    </View>
                    <Text style={styles.surfaceFooter}>{``}</Text>
                </Surface>
                <Surface style={styles.surface}>
                    <Text style={styles.surfaceHeader}>{`Course Rating`}</Text>
                    <View style={styles.surfaceBody}>
                        <Text style={styles.bodyTextLarge}>{`${holes.courseRating}`}</Text>
                        <Text style={styles.bodyTextSecondary}>{`(Par ${holes.par})`}</Text>
                    </View>
                    <Text style={styles.surfaceFooter}>{``}</Text>
                </Surface>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(DATA_TILES.COURSE_HANDICAP)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Course Hcap`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={styles.bodyText}>{getHandicapDisplayValue(calculateCourseHandicap(holes, handicapIndex, crPar, true))}</Text>
                                <Text style={styles.bodyTextSecondary}>{`(${ crPar ? 'with' : 'without'} CR - Par)`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
                <Surface style={styles.surface}>
                    <TouchableRipple style={styles.ripple} onPress={() => {showDialog(DATA_TILES.PLAYING_HANDICAP)}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                        <React.Fragment>
                            <Text style={styles.surfaceHeader}>{`Playing Hcap`}</Text>
                            <View style={styles.surfaceBody}>
                                <Text style={[styles.bodyText]}>{getHandicapDisplayValue(calculatePlayingHandicap(holes, handicapIndex, crPar, handicapAllowance, true))}</Text>
                                <Text style={styles.bodyTextSecondary}>{`(allowance ${handicapAllowance}%)`}</Text>
                            </View>
                            <Text style={styles.surfaceFooter}>{`Tap to Change`}</Text>
                        </React.Fragment>
                    </TouchableRipple>
                </Surface>
            </View>
            <Portal>
                    {currentDialog === DATA_TILES.TEES && 
                        <SelectTeesDialog 
                            theme={theme}
                            title={'Change Tees'}
                            dialogVisible={dialogVisible}
                            hideDialog={hideDialog}
                            course={course}
                            onSelect={(tees, holes) => changeTees(tees, holes)}
                        />
                    }
                    {currentDialog === DATA_TILES.HANDICAP_INDEX && 
                        <HandicapIndexDialog 
                            theme={theme}
                            currentHandicap={handicapIndex}
                            dialogVisible={dialogVisible}
                            hideDialog={hideDialog}
                            course={course}
                            onClickOk={value => changeHandicapIndex(value)}
                        />
                    }
                    {currentDialog === DATA_TILES.COURSE_HANDICAP && 
                        <Dialog style={styles.dialogStyle} visible={dialogVisible} onDismiss={hideDialog}>
                            <Dialog.Content>
                                <View style={styles.switchView}>
                                    <Text style={styles.switchText}>{'Course Rating - Par'}</Text>
                                    <Switch value={crPar} onValueChange={() => changeCRPar(!crPar)} />
                                </View>
                            </Dialog.Content>
                        </Dialog>
                    }
                    {currentDialog === DATA_TILES.PLAYING_HANDICAP && 
                        <Dialog style={styles.dialogStyle} visible={dialogVisible} onDismiss={hideDialog}>
                            <Dialog.Content>
                                <View style={styles.textInputDialog}>
                                    <TextInput
                                        autoFocus={true}
                                        label={"Handicap Allowance"}
                                        value={handicapAllowanceValue}
                                        onChangeText={text => changeHandicapAllowanceValue(text)}
                                        right={<TextInput.Affix text="%" textStyle={{fontSize: 20}}/>}
                                        keyboardType={"number-pad"}
                                    />
                                </View>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => hideDialog()}>Cancel</Button>
                                <Button onPress={() => changeHandicapAllowance(handicapAllowanceValue)}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                    }
            </Portal>
      </React.Fragment>
  )
}



export default withTheme(CalculateHandicap)