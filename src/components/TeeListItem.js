import React from 'react'
import { List, TouchableRipple } from 'react-native-paper'
import { getTeesGender } from '../util/dataUtil'

export default function TeeListItem({ tee, index, onPress }){

    return(
        <TouchableRipple onPress={() => { onPress(index) }} rippleColor="rgba(0, 0, 0, .32)">
            <List.Item
                title={`${tee.name} - ${getTeesGender(tee.gender)}`}
                description={`Slope:  ${tee.slopeRating}`}
                left={props => <List.Icon {...props} icon="golf" />}
            />
        </TouchableRipple>
    )

}