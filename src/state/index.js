import React, {createContext, useContext, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const actions = {
    CHANGE_COURSE: "changeCourse",
    CHANGE_TEE: "changeTee",
    SET_HANDICAP_INDEX: "setHandicapIndex",
    SET_CR_PAR: "setCRPar",
    SET_HANDICAP_ALLOWANCE: "setHandicapAllowence",
    NEW_COURSE: "newCourse"
}

export const keys = {
    COURSE: "course",
    TEE: "tee",
    HANDICAP_INDEX: "handicapIndex",
    CR_PAR: "crPar",
    HANDICAP_ALLOWANCE: "handicapAllowence"
}

export const StateContext = createContext();

export const StateProvider = ({reducer, initialState, children}) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

const storeValue = (key, value) => {
  try{
    AsyncStorage.setItem(key, value)
  }catch(e){
    console.error(e)
  } 
}

export const defaultReducer = (state, action) => {
    switch(action.type){
      case actions.CHANGE_COURSE:
        storeValue(keys.COURSE, JSON.stringify(action.course))
        return {
          ...state,
          course: action.course
        }
      case actions.CHANGE_TEE:
        storeValue(keys.TEE, `${action.tee}`)
        return {
          ...state,
          tee : action.tee
        }
      case actions.SET_HANDICAP_INDEX:
        storeValue(keys.HANDICAP_INDEX, `${action.handicapIndex}`)
        return {
          ...state,
          handicapIndex : action.handicapIndex
        }
      case actions.SET_CR_PAR:
        storeValue(keys.CR_PAR, `${action.crPar}`)
        return {
          ...state,
          crPar : action.crPar
        }
      case actions.SET_HANDICAP_ALLOWANCE:
        storeValue(keys.HANDICAP_ALLOWANCE, `${action.handicapAllowance}`)
        return {
          ...state,
          handicapAllowance: action.handicapAllowance
        }
      case actions.NEW_COURSE:
        storeValue(keys.COURSE, JSON.stringify(action.course))
        storeValue(keys.TEE, `${action.tee}`)
        storeValue(keys.HANDICAP_INDEX, `${action.handicapIndex}`)
        return {
          ...state,
          course: action.course,
          tee: action.tee,
          handicapIndex: action.handicapIndex
        }
      default:
          return state
    }
  }