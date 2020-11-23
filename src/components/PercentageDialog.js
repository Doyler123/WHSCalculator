import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native'
import { Dialog, TextInput, Button } from 'react-native-paper';

export default function HandicapIndexDialog({theme, title, currentAllowance, dialogVisible, hideDialog, onClickOk, okLabel}){

    const styles = StyleSheet.create({
        dialogStyle: {
            backgroundColor: theme.colors.background
        },
        textInputDialog: {
            paddingTop: 20,
        }
    })

    const [handicapAllowanceValue, setHandicapAllowanceValue] = useState(`${currentAllowance}`);

    useEffect(() => {
        if(!dialogVisible){
            setHandicapAllowanceValue(`${currentAllowance}`);
        }
    }, [dialogVisible])

    useEffect(() => {
        setHandicapAllowanceValue(`${currentAllowance}`);
    }, [currentAllowance])
  
    const changeHandicapAllowanceValue = (value) => {
        value = value.replace(/[^0-9]/g, '')
        if(value.length > 3){
            value = value.substring(0, 3);
        }
        setHandicapAllowanceValue(value);
    }

    const onFinish = () => {
        onClickOk(handicapAllowanceValue)
    }
    
    return(
        <Dialog style={styles.dialogStyle} visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Content>
                <View style={styles.textInputDialog}>
                    <TextInput
                        autoFocus={true}
                        label={title}
                        value={handicapAllowanceValue}
                        onChangeText={text => changeHandicapAllowanceValue(text)}
                        right={<TextInput.Affix text="%" textStyle={{fontSize: 20}}/>}
                        keyboardType={"number-pad"}
                    />
                </View>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => hideDialog()}>Cancel</Button>
                <Button onPress={() => onFinish()}>Ok</Button>
            </Dialog.Actions>
        </Dialog>
    )
}