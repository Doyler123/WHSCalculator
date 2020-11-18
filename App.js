import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './src/navigation';
import { StateProvider, defaultReducer } from './src/state';
import Loading from './src/components/Loading';
import { keys } from './src/state';
import { SCREENS } from './src/constants';

export default function App() {

  const [ initialState, setInitialState ] = useState({})

  const getInitialState = async () => {
    let state = {}
    try {
      let course = await AsyncStorage.getItem(keys.COURSE);
      state.course = course != null ? JSON.parse(course) : undefined;
      let tee = await AsyncStorage.getItem(keys.TEE);
      state.tee = tee != null ? parseInt(tee) : undefined;
      let handicapIndex = await AsyncStorage.getItem(keys.HANDICAP_INDEX);
      state.handicapIndex = handicapIndex != null ? handicapIndex : undefined;
      let crPar = await AsyncStorage.getItem(keys.CR_PAR);
      state.crPar = crPar === 'true';
      let handicapAllowance = await AsyncStorage.getItem(keys.HANDICAP_ALLOWANCE);
      state.handicapAllowance = handicapAllowance != null ? parseInt(handicapAllowance) : 95;
      return state
    } catch(e) {
      console.error(e)
      state = {
        course: undefined,
        tee: undefined,
        handicapIndex: undefined,
        crPar: false,
        handicapAllowance: 95
      }
      return state
    }
  }

  useEffect(() => {
    getInitialState().then((state) => {
      setInitialState(state)
    });
  }, [])

  if(Object.keys(initialState).length <= 0){
    return(
      <PaperProvider>
        <Loading />
      </PaperProvider>
    )
  }

  return (
    <StateProvider initialState={initialState} reducer={defaultReducer}>
      <PaperProvider>
        <AppNavigator initialScreen={initialState.course ? SCREENS.HANDICAP : SCREENS.SEARCH}/>
      </PaperProvider>
    </StateProvider>
  );
}
