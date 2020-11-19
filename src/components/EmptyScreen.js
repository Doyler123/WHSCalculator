import React from 'react';
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const EmptyScreen = ({ theme, icon, text, onPress }) => (
    <View style={styles.container}>
        <TouchableRipple onPress={() => {onPress && onPress()}} borderless={true} rippleColor="rgba(0, 0, 0, 0)">
            <View style={styles.container}>
                <MaterialCommunityIcons name={icon} size={64} color={theme.colors.faded} />
                <Text style={{color: theme.colors.faded}} >{text}</Text>
            </View>
        </TouchableRipple>
    </View>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: 'center'
    }
  });
  
  export default EmptyScreen;