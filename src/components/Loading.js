import React from 'react';
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { withTheme } from 'react-native-paper';

const Loading = ({ theme }) => (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.accent}/>
    </View>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center"
    }
  });
  
  export default withTheme(Loading);