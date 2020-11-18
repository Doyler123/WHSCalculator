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

export const calculateCourseHandicap = (tees, handicapIndex, withCRPar) => {
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

        return `${courseHandicap}`;
    }

    return `N/A`;
}

export const calculatePlayingHandicap = (tees, handicapIndex, withCRPar, percentage) => {
    let courseHandicap = calculateCourseHandicap(tees, handicapIndex, withCRPar);

    if(!isNaN(courseHandicap) && !isNaN(percentage)){
        percentage = parseInt(percentage);
        courseHandicap = parseFloat(courseHandicap);

        let playingHandicap = courseHandicap * (percentage / 100);
        playingHandicap = Math.round(playingHandicap * 10) / 10;

        return `${playingHandicap}`;
    }

    return courseHandicap;
}