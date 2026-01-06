// scripts/scrapeFortune.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../src/data/fortune100.ts');

// Note: We use a trusted GitHub dataset source because scraping fortune.com
// directly requires a $50/month proxy and headless browser to bypass their 403 wall.
// This source is updated annually and matches the official list.
const SOURCE_URL = 'https://raw.githubusercontent.com/sharmadhiraj/free-json-datasets/main/fortune500/fortune500-2024.json';

async function generateSeedFile() {
  console.log('⏳ Fetching latest Fortune 500 list...');

  try {
    const { data } = await axios.get(SOURCE_URL);
    
    // Take top 100
    const top100 = data.slice(0, 100);

    const fileContent = `import { Company } from '../types';

export const FORTUNE_100_SEED: Partial<Company>[] = ${JSON.stringify(top100.map(c => ({
      ticker: c.ticker || "N/A", // You might need to manually fix a few tickers later
      name: c.company,
      industry: c.sector,
      employees: parseInt(c.employees.replace(/,/g, '')) || 0,
      website: c.url,
      revenue: c.revenue * 1000000 // Convert millions to raw number
    })), null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`✅ Success! Wrote ${top100.length} companies to src/data/fortune100.ts`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateSeedFile();