import React from 'react'
import { List, TouchableRipple, Colors } from 'react-native-paper'
import { getTeesGender } from '../util/dataUtil'
import { FontAwesome5 } from '@expo/vector-icons'; 

export default function TeeListItem({ tee, index, onPress, theme }){

    const getTeeColor = (name) => {
        name = name.split('-')[0].split(' ')[0].trim().toLocaleLowerCase();
        let key = Object.keys(Colors).find(color => color.toLocaleLowerCase().includes(name))
        if(key){
            if(key !== 'black' && key !== 'white'){
                key = `${name}200`;
                if(key in Colors){
                    return Colors[`${name}200`];
                }
            }
        }
        return theme.colors.faded;
    }

    return(
        <TouchableRipple onPress={() => { onPress(index) }} rippleColor="rgba(0, 0, 0, .32)">
            <List.Item
                titleStyle={{color: theme.colors.text}}
                descriptionStyle={{color: theme.colors.text}}
                title={`${tee.name} - ${getTeesGender(tee.gender)}`}
                description={`Slope:  ${tee.slopeRating}`}
                left={props => <List.Icon {...props} icon={({ color }) => (
                    <FontAwesome5 name="golf-ball" size={24} color={getTeeColor(tee.name)} />
                )} />}
            />
        </TouchableRipple>
    )

}