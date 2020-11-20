import ckHcapList from '../data/ckHcapList'
import luttWhiteHcapList from '../data/luttWhiteHcapList'
import * as util from '../../util/dataUtil'

describe('Course & Playing Handicap Calculations', () => {
    it('calculates correctly for ck white', () => {
        ckHcapList.values.forEach(value => {
            for(let i = value.lower; i <= value.upper; i += 0.1){
                i = parseFloat(i.toFixed(1))
                let courseHandicap = util.calculateCourseHandicap(ckHcapList.tees, i, false, true);    
                let playingHandicap = util.calculatePlayingHandicap(ckHcapList.tees, i, false, '95', true);
                
                expect(courseHandicap, `Handicap Index: ${i}. expected course handicap: ${value.courseHandicap} actual ${courseHandicap}`).toBe(`${value.courseHandicap}`);
                expect(playingHandicap, `Handicap Index: ${i}. expected playing handicap: ${value.playingHandicap} actual ${playingHandicap}`).toBe(`${value.playingHandicap}`);

            }
        })
        expect(true).toBe(true);
    });
    it('calculates correctly for lutt white', () => {
        luttWhiteHcapList.values.forEach(value => {
            for(let i = value.lower; i <= value.upper; i += 0.1){
                i = parseFloat(i.toFixed(1))
                let courseHandicap = util.calculateCourseHandicap(luttWhiteHcapList.tees, i, false, true);
                
                expect(courseHandicap, `Handicap Index: ${i}. expected course handicap: ${value.courseHandicap} actual ${courseHandicap}`).toBe(`${value.courseHandicap}`);

            }
        })
        expect(true).toBe(true);
    });
});