import React from 'react';
import { StyleSheet, View } from 'react-native'
import { Dialog, Text, Switch } from 'react-native-paper'

export default function SelectTeesDialog({theme, title, dialogVisible, hideDialog, value, onSwitch}){

    const styles = StyleSheet.create({
        dialogStyle: {
            backgroundColor: theme.colors.background
        },
        switchView: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
        },
        switchText: {
          fontSize: 17
        }
    })
    
    return(
        <Dialog style={styles.dialogStyle} visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Content>
                <View style={styles.switchView}>
                    <Text style={styles.switchText}>{title}</Text>
                    <Switch value={value} onValueChange={() => onSwitch(!value)} />
                </View>
            </Dialog.Content>
        </Dialog>
    )
}