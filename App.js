import React, { useState, useEffect } from 'react';
import { DarkTheme, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './src/navigation';
import { StateProvider, defaultReducer } from './src/state';
import Loading from './src/components/Loading';
import { keys } from './src/state';
import { SCREENS } from './src/constants';

import { useFonts, Lusitana_700Bold, Lusitana_400Regular } from '@expo-google-fonts/lusitana';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#009B77',
    secondary: '#ba0c2f',
    accent: '#FCE300',
    text: '#006747',
    surface: '#fff',
    background: '#f2f2f1',
    faded: '#B7B5AF'
  },
};
const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#009B77',
    accent: '#FCE300',
  },
};

export default function App() {

  let [fontsLoaded] = useFonts({
    Lusitana_700Bold,
    Lusitana_400Regular
  });

  const [ initialState, setInitialState ] = useState({})

  const getInitialState = async () => {
    let state = {}
    try {
      let course = await AsyncStorage.getItem(keys.COURSE);
      state.course = course != null ? JSON.parse(course) : undefined;
      let tee = await AsyncStorage.getItem(keys.TEE);
      state.tee = tee != null ? parseInt(tee) : undefined;
      let holes = await AsyncStorage.getItem(keys.HOLES);
      state.holes = holes != null ? JSON.parse(holes) : undefined;
      let handicapIndex = await AsyncStorage.getItem(keys.HANDICAP_INDEX);
      state.handicapIndex = handicapIndex != null ? handicapIndex : undefined;
      let crPar = await AsyncStorage.getItem(keys.CR_PAR);
      state.crPar = crPar === 'true';
      let handicapAllowance = await AsyncStorage.getItem(keys.HANDICAP_ALLOWANCE);
      state.handicapAllowance = handicapAllowance != null ? parseInt(handicapAllowance) : 95;
      let history = await AsyncStorage.getItem(keys.HISTORY);
      state.history = history != null ? JSON.parse(history) : [];
      return state
    } catch(e) {
      console.error(e)
      state = {
        course: undefined,
        tee: undefined,
        holes: undefined,
        handicapIndex: undefined,
        crPar: false,
        handicapAllowance: 95,
        history: []
      }
      return state
    }
  }

  useEffect(() => {
    getInitialState().then((state) => {
      setInitialState(state)
    });
  }, [])

  if(!fontsLoaded || Object.keys(initialState).length <= 0){
    return(
      <PaperProvider theme={theme}>
        <Loading />
      </PaperProvider>
    )
  }

  return (
    <StateProvider initialState={initialState} reducer={defaultReducer}>
      <PaperProvider theme={theme}>
        <AppNavigator initialScreen={initialState.course ? SCREENS.HANDICAP : SCREENS.SEARCH}/>
      </PaperProvider>
    </StateProvider>
  );
}
