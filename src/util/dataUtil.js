export const getTeesGender = (gender) => {
    if(gender){
        gender = gender.toLowerCase();
        if(gender === 'm'){
            return 'Mens';
        }else if(gender === 'f'){
            return 'Ladies'
        }
    }else{
        return '';
    }

    return gender
}

export const getCourseDescription = (name, city, state) => {
    let nameElements = name.split('-')
    if(nameElements.length > 1){
        if(nameElements[0] && nameElements[1] && nameElements[0].trim() !== nameElements[1].trim()){
            return nameElements[1].trim()
        }
    }
    return `${city} ${state}`;
}

export const getHandicapIndexInputValue = (value) => {
    let startValue = '';
    if(value.startsWith('-') || value.startsWith('+')){
        startValue = value[0];
        value = value.substring(1, value.length)
    }

    value = value.replace(/[^0-9.]/g, '')

    if(value.length > 1 && value.endsWith('.')){
        let originalValue = value.substring(0, value.length - 1);
        if(originalValue.includes('.')){
            value = originalValue;
        }
    }
    
    if(value.length > 4){
        if(!isNaN(value)){
            value = parseFloat(value).toFixed(1);
        }else{
            value = value.substring(0, 4);
        }
    }

    return startValue + value
}

export const getHandicapIndexValue = (value) => {
    console.log(value)
    if(value){
        if(!isNaN(value)){
            if(value.startsWith('+')){
                value = value.replace('+', '-');
            }
            return parseFloat(value).toFixed(1);
        }
    }
    return '';
}

export const getHandicapIndexDisplayValue = (handicapIndex) => {
    if(handicapIndex && !isNaN(handicapIndex)){
        let displayValue = parseFloat(handicapIndex).toFixed(1);
        if(displayValue.startsWith('-')){
            displayValue = displayValue.replace('-', '+');
        }
        return displayValue
    }
    return handicapIndex ? handicapIndex : 'N/A';
}

export const calculateCourseHandicap = (tees, handicapIndex, withCRPar, round) => {
    let slope = tees.slopeRating;
    if(!isNaN(slope) && !isNaN(handicapIndex)){
        slope = parseFloat(slope);
        handicapIndex = parseFloat(handicapIndex);
        
        let courseHandicap = handicapIndex * (slope / 113)
        courseHandicap = Math.floor(courseHandicap * 10) / 10

        if(withCRPar && !isNaN(tees.courseRating) && !isNaN(tees.par)){
            let cr = parseFloat(tees.courseRating)
            let par = parseFloat(tees.par)
            
            courseHandicap = courseHandicap + (cr - par);
            courseHandicap = Math.round(courseHandicap * 10) / 10;
        }

        if(round){
            courseHandicap = Math.round(courseHandicap);
        }

        return `${courseHandicap}`;
    }

    return `N/A`;
}

export const calculatePlayingHandicap = (tees, handicapIndex, withCRPar, percentage, round) => {
    let courseHandicap = calculateCourseHandicap(tees, handicapIndex, withCRPar, true);

    if(!isNaN(courseHandicap) && !isNaN(percentage)){
        percentage = parseInt(percentage);
        courseHandicap = parseFloat(courseHandicap);

        let playingHandicap = courseHandicap * (percentage / 100);
        playingHandicap = parseFloat(playingHandicap.toFixed(1));

        if(round){
            playingHandicap = Math.round(playingHandicap)
        }

        return `${playingHandicap}`;
    }

    return courseHandicap;
}