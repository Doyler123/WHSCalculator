import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native'
import { Dialog, TextInput, Button } from 'react-native-paper'

import { getHandicapIndexInputValue, getHandicapIndexValue } from '../util/dataUtil'
import { MIN_HANDICAP, MAX_HANDICAP, ERROR_MESSAGES } from '../constants'


export default function HandicapIndexDialog({theme, currentHandicap, dialogVisible, hideDialog, onClickOk, okLabel}){

    const [handicap, setHandicap] = useState(currentHandicap);
    const [handicapError, setHandicapError] = useState('');
  
    useEffect(() => {
        if(!dialogVisible){
            setHandicapError('');
            setHandicap(currentHandicap);
        }
    }, [dialogVisible])

    useEffect(() => {
        setHandicap(currentHandicap)
    }, [currentHandicap])

    const styles = StyleSheet.create({
        dialogStyle: {
            backgroundColor: theme.colors.background
        },
        textInputDialog: {
            paddingTop: 20,
        }
    })

    const changeHandicap = value => {
      setHandicapError('');
      value = getHandicapIndexInputValue(value)
      setHandicap(value)
    }

    const onFinish = () => {
        let value = getHandicapIndexValue(handicap);
        if(!isNaN(value) && parseFloat(value) <= MAX_HANDICAP && parseFloat(value) >= MIN_HANDICAP){
            onClickOk(value)
        }else{
            setHandicap('');
            setHandicapError(ERROR_MESSAGES.HANDICAP_INPUT_ERROR)
        }
    }
    
    return(
            
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialogStyle} >
            <Dialog.Content>
                <View style={styles.textInputDialog}>
                    <TextInput
                        autoFocus={true}
                        label={!!handicapError ? handicapError : "Handicap Index"}
                        value={handicap}
                        error={!!handicapError}
                        placeholder={"Handicap Index"}
                        onChangeText={text => changeHandicap(text)}
                        keyboardType={"number-pad"}
                    />
                </View>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => { hideDialog() }}>Cancel</Button>
                <Button onPress={() => { onFinish() }}>{okLabel ? okLabel : 'Ok'}</Button>
            </Dialog.Actions>
        </Dialog>
    )
}