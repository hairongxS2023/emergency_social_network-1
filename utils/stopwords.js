import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stopwordsJSON = fs.readFileSync(`${__dirname}/stopwords.json`, 'utf8');
const stopwords = JSON.parse(stopwordsJSON);

export default stopwords;
