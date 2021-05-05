import puppeteer = require('puppeteer');
import fs = require('fs');

(async () => {
  const url = 'https://en.wikipedia.org/wiki/Lists_of_airports';
  // Launching Browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Creating an empty Array to store final data
  const data: unknown[] | Promise<unknown[]> = [];

  // Function for iterating over links and collecting data
  const visitLink = async (index = 0): Promise<unknown> => {
    // Getting all the links repetitively
    const links = await page.$$(
      'div.navbox a[href*="/wiki/List_of_airports_by_IATA_airport_code:_"]'
    );
    // Run till the last link
    if (links[index]) {
      await Promise.all([
        // Click on the link starting with first
        await page.evaluate((element) => {
          element.click();
        }, links[index]),
        // Waiting for the page to load
        await page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);

      // Collecting data on the current page and storing it in recordList Array
      const recordList = await page.$$eval(
        'table[class="wikitable sortable jquery-tablesorter"] tbody tr',
        (trows) => {
          const rowList: unknown[] | Promise<unknown[]> = [];
          trows.forEach((row) => {
            // Object to store data
            const record = {
              iata: '',
              icao: '',
              ['airport name']: '',
              ['location served']: '',
            };
            // Filtering data
            const tdList = Array.from(row.querySelectorAll('td'), (column) =>
              column.innerText
                .toLocaleLowerCase()
                .replace(/[0-9]/g, 'DAPI')
                .replace(/[, ]/g, '_')
            );
            record.iata = tdList[0];
            record.icao = tdList[1];
            record['airport name'] = tdList[2];
            record['location served'] = tdList[3];
            if (tdList.length >= 4) {
              rowList.push(record);
            }
          });
          return rowList;
        }
      );
      // Adding all the acquired data to the parent Array "data"
      data.push(recordList);

      // Go back and visit next link
      await page.goBack({ waitUntil: 'networkidle0' });
      return visitLink(index + 1);
    }
  };
  // Calling function
  await visitLink();
  // Closing browser
  await browser.close();

  // Extracting and saving data in JSON format
  fs.writeFile('DATA.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Saved Successfully!');
    }
  });
})();
