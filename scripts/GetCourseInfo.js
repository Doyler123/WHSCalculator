const puppeteer = require('puppeteer');
var fs = require('fs');

(async () => {

  const outputFileName = 'data.json';

  // const courses = require('./IrishGolfCourses').slice(0, 50);
  const courses = ['Ardglass'];
  const countries = ['NIR'];
  // const countries = ['IRL', 'NIR'];

  const result = {
    multipleSearchResults: [],
    noSearchResults: [],
    otherErrors: [],
    courses: []
  }

  const browser = await puppeteer.launch({
    args: [
      '--window-size=1920,1080',
    ],
  });
  const page = await browser.newPage();

  for (let i = 0; i < courses.length; i++) {
    let courseName = courses[i];
    let searchString = courseName;

    try{
      if(searchString.includes('-')){
        searchString = searchString.split('-')[0].trim();
      }
      if(searchString.includes('Golf Club')){
        searchString = courseName.replace('Golf Club', '').trim();
      }
      if(searchString.includes('Golf & Country Club')){
        searchString = courseName.replace('Golf & Country Club', '').trim();
      }
    }catch(e){
      searchString = courseName;
    }

    let searchResults;

    try{

      await page.goto('https://ncrdb.usga.org/');

      for(let j = 0; j < countries.length; j++) {
        let country = countries[j];

        try{
  
          await page.select('[name="ddCountries"]', country);
          await page.$eval('#txtClubName', (el, _searchString) => el.value = _searchString, searchString);
          await page.click('[name="myButton"]');
          
          await page.waitForSelector('#gvCourses', {timeout: 5000});
        
          searchResults = await page.$$eval('#gvCourses tbody tr', rows => rows.map(row => {
              const cols = row.querySelectorAll('td');
              return {
                name: cols[0].innerHTML,
                href: cols[1].querySelector('a').href 
              }
          }))

          break;
  
        }catch(e){
  
          if(e.message.includes('waiting for selector `#gvCourses`')){
            console.log(`No results for: ${courseName} | Search string: ${searchString} | Country: ${country}`)
            result.noSearchResults.push({courseName: courseName, searchString: searchString, country: country})
          } else if(j !== (countries.length - 1)){
            result.otherErrors.push(`${courseName}: ${e.message}`)
          } else {
            throw e;
          }
  
        }
      }
    
    
      
      if (searchResults.length === 1) {
        console.log(`Going to page ${searchResults[0].href}`)
        await page.goto(searchResults[0].href);
      } else {
        result.multipleSearchResults.push({courseName: courseName, searchString: searchString})
        throw new Error(`CustomMessage: Multiple search results search: ${searchString}`);
      }

      await page.waitForSelector('#gvCourseTees');
    
      let courseId;
      if(searchResults[0].href.includes('CourseID=')){
        courseId = searchResults[0].href.split('=')[1]
      }else{
        courseId = 'none'
      }
    
    //   await page.waitFor(3000); gvTee
    
    
      let courseData = await page.$$eval('#gvCourseTees tbody tr', rows => {
        let cols = rows[1].querySelectorAll('td');
        return {
          name: cols[0].innerText.trim(),
          city: cols[1].innerText.trim(),
          state: cols[2].innerText.trim(),
        }
      })
    
      let teeData = await page.$$eval('#gvTee tbody tr', rows => rows.map(row => {
        const cols = row.querySelectorAll('td');
    
        if(cols.length <= 0){
          return {}
        }
    
        return {
          name: cols[0].innerText.trim(),
          gender: cols[1].innerText.trim(),
          par: cols[2].innerText.trim(),
          courseRating: cols[3].innerText.trim(),
          bogeyRating: cols[4].innerText.trim(),
          slopeRating: cols[5].innerText.trim(),
          front9: cols[6].innerText.trim(),
          back9: cols[7].innerText.trim() 
        }
      }))
    
      courseData.tees = teeData.filter(tee => Object.keys(tee).length > 0)
      courseData.id = courseId ? courseId : courseData.name
    
      result.courses.push(courseData);

      console.log(`Finished course: ${courseName}`)

    }catch(e){
      console.log(`Error for course: ${courseName}`)
      console.log(e.message)
      if(!e.message.includes('CustomMessage:')) {
        result.otherErrors.push(`${courseName}: ${e.message}`)
      }
    }
    
  }

  fs.unlink(outputFileName, function (err) {
    if (err) throw err;
    console.log('Data file deleted!');
  });

  fs.appendFile(outputFileName, JSON.stringify(result, null, 2), function (err) {
    if (err) throw err;
    console.log(`Saved results to /${outputFileName}`);
  });

  // await page.screenshot({path: 'screenshot.png', fullPage: true });

  await browser.close();
})();