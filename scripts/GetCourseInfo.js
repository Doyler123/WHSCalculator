const puppeteer = require('puppeteer');
const moment = require('moment');

(async () => {

  

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://ncrdb.usga.org/');
  
  
  await page.select('[name="ddCountries"]', 'IRL');
  await page.$eval('#txtClubName', el => el.value = 'Luttrellstown');
  await page.click('[name="myButton"]');
  
  await page.waitForSelector('#gvCourses');

  const searchResults = await page.$$eval('#gvCourses tbody tr', rows => rows.map(row => {
      const cols = row.querySelectorAll('td');
      return {
         name: cols[0].innerHTML,
         href: cols[1].querySelector('a').href 
      }
  }))
  
  if(searchResults.length === 1){
    await page.goto(searchResults[0].href);
  }
  await page.waitForSelector('#gvCourseTees');

//   await page.waitFor(3000);

  await page.screenshot({path: 'screenshot.png', fullPage: true });

  await browser.close();
})();