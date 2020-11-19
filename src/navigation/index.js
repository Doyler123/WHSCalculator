import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { withTheme } from 'react-native-paper';

import FindCourse from '../screens/FindCourse';
import CalculateHandicap from '../screens/CalculateHandicap';
import History from '../screens/History';
import { SCREENS } from '../constants';

const Tab = createMaterialBottomTabNavigator();

function AppNavigator({ theme, initialScreen }) {
  return (
    <NavigationContainer>
      <Tab.Navigator barStyle={{ backgroundColor: theme.colors.primary }} initialRouteName={initialScreen}  activeColor={theme.colors.accent}>
        <Tab.Screen 
            name={SCREENS.SEARCH} 
            component={FindCourse} 
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="magnify" color={color} size={26} />
              )
            }}/>
        <Tab.Screen 
            name={SCREENS.HANDICAP} 
            component={CalculateHandicap}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="calculator" color={color} size={26} />
              )
            }} 
        />
        <Tab.Screen 
            name={SCREENS.HISTORY} 
            component={History}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="format-list-bulleted" color={color} size={26} />
              )
            }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default withTheme(AppNavigator);
