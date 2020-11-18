const puppeteer = require('puppeteer');
var fs = require('fs');

(async () => {

  const outputFileName = 'data.json';

  // let courses = require('./IrishGolfCourses');
  // courses = courses.slice(350, courses.length);
  const countries = ['IRL', 'NIR'];
  const courses = [];
  // const countries = ['NIR'];

  // const result = {
  //   multipleSearchResults: [],
  //   noSearchResults: [],
  //   otherErrors: [],
  //   courses: []
  // }

  const result = JSON.parse(fs.readFileSync('./processedData.json', 'utf8'));
  // let courses = result.noSearchResults.map(res => res.courseName);

  result.noSearchResults2 = [];

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
  
          if(j === (countries.length - 1) && e.message.includes('waiting for selector `#gvCourses`')){
            console.log(`No results for: ${courseName} | Search string: ${searchString} | Country: ${country}`)
            result.noSearchResults2.push({courseName: courseName, searchString: searchString, country: country})
            throw e;
          } else if (j === (countries.length - 1)) {
            throw e;
          } else if(!e.message.includes('waiting for selector `#gvCourses`')) {
            result.otherErrors.push(`${courseName} | Search string: ${searchString} | Country: ${country}: ${e.message}`)
          }
  
        }
      }
    
      if (searchResults.length > 0) {
        for (let k = 0; k < searchResults.length; k++) {
          let courseData = await getCourseData(searchResults[k].href, page)
          result.courses.push(courseData);
        }
      }
      
      console.log(`Finished course: ${courseName}`)

      
    }catch(e){
      console.log(`Error for course: ${courseName}`)
      console.log(e.message)
      if(!e.message.includes('waiting for selector `#gvCourses`')) {
        result.otherErrors.push(`${courseName}: ${e.message}`)
      }
    }
    
  }

  let uniqueCourses = [];
  result.courses.forEach(course => {
    if(!uniqueCourses.find(c => c.id === course.id)){
      uniqueCourses.push(course);
      console.log(`Adding course: ${course.name}`)
    }else{
      console.log(`Duplicate course: ${course.name}`)
    }
  });

  result.courses = uniqueCourses;

  if(fs.existsSync(outputFileName)){
    fs.unlink(outputFileName, function (err) {
      if (!err){
        console.log('Data file deleted!');
      }
    });
  }

  fs.appendFile(outputFileName, JSON.stringify(result, null, 2), function (err) {
    if (err) throw err;
    console.log(`Saved results to /${outputFileName}`);
  });

  // await page.screenshot({path: 'screenshot.png', fullPage: true });

  await browser.close();
})();

async function getCourseData(href, page){
  
  console.log(`Going to page ${href}`);

  await page.goto(href);await page.waitForSelector('#gvCourseTees');
    
  let courseId;
  if(href.includes('CourseID=')){
    courseId = href.split('=')[1]
  }else{
    courseId = 'none';
  }

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

  return courseData;

}