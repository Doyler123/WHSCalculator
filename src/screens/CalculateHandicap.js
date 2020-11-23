
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Portal, withTheme } from 'react-native-paper'

import Header from '../components/Header'
import { getTeesGender, 
     getHandicapIndexDisplayValue, 
     calculateCourseHandicap, 
     calculatePlayingHandicap,
     getHandicapDisplayValue } from '../util/dataUtil'
import { useStateValue, actions } from '../state/';
import { SCREENS } from '../constants';
import EmptyScreen from '../components/EmptyScreen';
import SelectTeesDialog from '../components/SelectTeesDialog';
import HandicapIndexDialog from '../components/HandicapIndexDialog';
import DataTile from '../components/DataTile';
import SwitchDialog from '../components/SwitchDialog';
import PercentageDialog from '../components/PercentageDialog';

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
        }
    })

  const [{ course, tee, holes, handicapIndex, crPar, handicapAllowance }, dispatch ] = useStateValue();
  
  const [hiDialogVisible, setHiDialogVisible] = useState(false);
  const [crDialogVisible, setCrDialogVisible] = useState(false);
  const [haDialogVisible, setHaDialogVisible] = useState(false);
  const [teeDialogVisible, setTeeDialogVisible] = useState(false);
  
  const changeTees = (tees, holes) => {
    dispatch({
        type: actions.CHANGE_TEE,
        tee: tees,
        holes: holes
    })
    setTeeDialogVisible(false);
  }
  
  const changeCRPar = (crPar) => {
    dispatch({
        type: actions.SET_CR_PAR,
        crPar: crPar
    })
    setCrDialogVisible(false);
  }
  
  const changeHandicapAllowance = (percentage) => {
    dispatch({
        type: actions.SET_HANDICAP_ALLOWANCE,
        handicapAllowance: percentage
    })
    setHaDialogVisible(false);
  }
  
  const changeHandicapIndex = (value) => {
    dispatch({
        type: actions.SET_HANDICAP_INDEX,
        handicapIndex: value
    })
    setHiDialogVisible(false);
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
                <DataTile
                    title={`Tees`}
                    bodyText={course.tees[tee].name.includes('-') ? course.tees[tee].name.split('-')[0].trim() : course.tees[tee].name}
                    bodyTextLine2={course.tees[tee].name.includes('-') ? course.tees[tee].name.split('-')[1].trim() : undefined}
                    bodyTextSecondary={`(${holes.name} - ${getTeesGender(course.tees[tee].gender)})`}
                    largeText={course.tees[tee].name.length > 6}
                    onClickChange={() => setTeeDialogVisible(true)}
                />
                <DataTile
                    title={`Hcap Index`}
                    bodyText={`${getHandicapIndexDisplayValue(handicapIndex)}`}
                    largeText={true}
                    onClickChange={() => setHiDialogVisible(true)}
                />
                <DataTile
                    title={`Slope`}
                    bodyText={`${holes.slopeRating}`}
                    largeText={true}
                />
                <DataTile
                    title={`Course Rating`}
                    bodyText={`${holes.courseRating}`}
                    bodyTextSecondary={`(Par ${holes.par})`}
                    largeText={true}
                />
                <DataTile
                    title={`Course Hcap`}
                    bodyText={getHandicapDisplayValue(calculateCourseHandicap(holes, handicapIndex, crPar, true))}
                    bodyTextSecondary={`(${ crPar ? 'with' : 'without'} CR - Par)`}
                    onClickChange={() => setCrDialogVisible(true)}
                />
                <DataTile
                    title={`Playing Hcap`}
                    bodyText={getHandicapDisplayValue(calculatePlayingHandicap(holes, handicapIndex, crPar, handicapAllowance, true))}
                    bodyTextSecondary={`(allowance ${handicapAllowance}%)`}
                    onClickChange={() => setHaDialogVisible(true)}
                />
            </View>
            <Portal>
                <SelectTeesDialog 
                    theme={theme}
                    title={'Change Tees'}
                    dialogVisible={teeDialogVisible}
                    hideDialog={() => {setTeeDialogVisible(false)}}
                    course={course}
                    onSelect={(tees, holes) => changeTees(tees, holes)}
                />
                <HandicapIndexDialog 
                    theme={theme}
                    currentHandicap={handicapIndex}
                    dialogVisible={hiDialogVisible}
                    hideDialog={() => { setHiDialogVisible(false) }}
                    course={course}
                    onClickOk={value => changeHandicapIndex(value)}
                />
                <SwitchDialog 
                    theme={theme}
                    title={'Course Rating - Par'}
                    dialogVisible={crDialogVisible}
                    hideDialog={() => { setCrDialogVisible(false) }}
                    value={crPar}
                    onSwitch={changeCRPar}
                />
                <PercentageDialog 
                    theme={theme}
                    title={"Handicap Allowance"}
                    currentAllowance={handicapAllowance}
                    dialogVisible={haDialogVisible}
                    hideDialog={() => {setHaDialogVisible(false)}}
                    onClickOk={changeHandicapAllowance}
                />
            </Portal>
      </React.Fragment>
  )
}

export default withTheme(CalculateHandicap)