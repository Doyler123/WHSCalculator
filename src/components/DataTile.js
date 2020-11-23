import React from 'react';
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple, Surface } from 'react-native-paper';

import { getTeesGender } from '../util/dataUtil'
import { DATA_TILES } from '../constants';

const DataTile = ({ theme, title, bodyText, bodyTextLine2, bodyTextSecondary, largeText, smallText, onClickChange }) => {
    
    const styles = StyleSheet.create({
        surface: {
          padding: 8,
          height: 140,
          width: '45%',
          alignItems: 'center',
          elevation: 8,
          marginBottom: 20,
          borderRadius: 15
        },
        ripple: {
          alignItems: 'center'
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
        }
    })

    return(
        <Surface style={styles.surface}>
            <TouchableRipple style={styles.ripple} onPress={() => {onClickChange()}} borderless={true} rippleColor="rgba(0, 0, 0, .05)">
                <React.Fragment>
                    <Text style={styles.surfaceHeader}>{title}</Text>
                    <View style={styles.surfaceBody}>
                        {!bodyElement && 
                            <View style={styles.surfaceBody}>
                                <Text style={largeText ? styles.bodyTextLarge : smallText ? styles.bodyTextSmall:  styles.bodyText}>{bodyText}</Text>
                                {bodyTextLine2 && <Text style={largeText ? styles.bodyTextLarge : smallText ? styles.bodyTextSmall:  styles.bodyText}>{bodyText}</Text>}
                                {bodyTextSecondary && <Text style={styles.bodyTextSecondary}>{bodyTextSecondary}</Text>}
                            </View>
                        }
                    </View>
                    <Text style={styles.surfaceFooter}>{onClickChange ? `Tap to Change` : ``}</Text>
                </React.Fragment>
            </TouchableRipple>
        </Surface>
    )
};
  
  export default DataTile;