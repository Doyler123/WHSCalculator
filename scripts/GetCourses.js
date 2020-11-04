const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.irishgolfcourses.co.uk/atoz.html');
  
  const courses = await page.$$eval('.col-sm-4', links => links.map(link => link.textContent.trim()));
//   console.log(courses)
  console.dir(courses, {'maxArrayLength': null})

  await browser.close();
})();