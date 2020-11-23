import React from 'react'
import { List, TouchableRipple } from 'react-native-paper'

export default function HolesListItem({ holes, onPress, theme}){

    return(
        <TouchableRipple onPress={() => { onPress(holes) }} rippleColor="rgba(0, 0, 0, .32)">
            <List.Item
                titleStyle={{color: theme.colors.text}}
                descriptionStyle={{color: theme.colors.text}}
                title={`${holes.name}`}
                description={`Slope: ${holes.slopeRating} - CR: ${holes.courseRating}`}
                left={props => <List.Icon {...props} icon={'golf'} color={theme.colors.text}/>}
            />
        </TouchableRipple>
    )

}