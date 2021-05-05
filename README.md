# Puppeteer scraper using TypeScript
This project uses puppeteer to collect data by scraping wikipedia page for list of airports and stores in JSON format.
Prerequirements for runnig this program is:<br>
**node 14.15.4** <br>
**npm 7.11.2**

## Installation
```
mkdir scraper
cd scraper
git clone git@github.com:vinayak990/Puppeteer-scraper-using-TypeScript.git
npm i puppeteer
yarn add typescript --dev
```
For linting and formatting use ESLint and Prettier. I used Visual Studio Code as IDE along with ESLint and Prettier extension.
```
npm i eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser --dev
npm i prettier eslint-config-prettier eslint-plugin-prettier --dev
```
## Running the program
```
npm install -D ts-node
cd src
ts-node scraper.ts
```
Output will be saved as DATA.json in the src folder
