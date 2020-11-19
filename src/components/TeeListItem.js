import React from 'react'
import { List, TouchableRipple, Colors } from 'react-native-paper'
import { getTeesGender } from '../util/dataUtil'
import { FontAwesome5 } from '@expo/vector-icons'; 

export default function TeeListItem({ tee, index, onPress, theme }){

    const getTeeColor = (name) => {
        let key = Object.keys(Colors).find(color => color.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
        if(key){
            if(key !== 'black' && key !== 'white'){
                key = `${name.toLocaleLowerCase()}200`;
                if(key in Colors){
                    return Colors[`${name.toLocaleLowerCase()}200`];
                }
            }
        }
        return theme.colors.faded;
    }

    return(
        <TouchableRipple onPress={() => { onPress(index) }} rippleColor="rgba(0, 0, 0, .32)">
            <List.Item
                title={`${tee.name} - ${getTeesGender(tee.gender)}`}
                description={`Slope:  ${tee.slopeRating}`}
                left={props => <List.Icon {...props} icon={({ color }) => (
                    <FontAwesome5 name="golf-ball" size={24} color={getTeeColor(tee.name)} />
                )} />}
            />
        </TouchableRipple>
    )

}