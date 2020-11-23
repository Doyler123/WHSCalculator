import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native'
import { Dialog } from 'react-native-paper'

import TeeListItem from '../components/TeeListItem';
import HolesListItem from '../components/HolesListItem'
import { getHoles} from '../util/dataUtil'


export default function SelectTeesDialog({theme, title, dialogVisible, hideDialog, course, onSelect}){

    const [selectedTee, setSelectedTee] = useState();

    useEffect(() => {
        if(!dialogVisible){
            setSelectedTee(undefined);
        }
    }, [dialogVisible])

    const styles = StyleSheet.create({
        dialogStyle: {
            backgroundColor: theme.colors.background
        },
        scrollViewStyle: {
            paddingHorizontal: 10
        }
    })
    
    return(
        <Dialog style={styles.dialogStyle} visible={dialogVisible} onDismiss={hideDialog}>
            <React.Fragment>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.ScrollArea>
                    <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                        {selectedTee === undefined && course && course.tees.map((tee, index) => 
                            <TeeListItem 
                                key={index}
                                tee={tee}
                                index={index}
                                onPress={(i) => {setSelectedTee(i)}}
                                theme={theme}
                            />
                        )}
                        {selectedTee !== undefined && course && 
                            getHoles(course.tees[selectedTee]).map((holes, index) => 
                                <HolesListItem 
                                    key={index}
                                    holes={holes}
                                    onPress={(h) => {onSelect(selectedTee, h)}}
                                    theme={theme}
                                />
                            )
                        }
                    </ScrollView>
                </Dialog.ScrollArea>
            </React.Fragment>
        </Dialog>
    )
}