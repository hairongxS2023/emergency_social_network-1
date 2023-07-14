import fs from 'fs';
import path from 'path';

const automatedPath =  path.join(process.cwd(), 'utils/reserve_words.json');
function getReserved() {

  console.log(automatedPath);
  
  const reservedWordsJSON = fs.readFileSync(automatedPath, 'utf8');
  const reservedWords = JSON.parse(reservedWordsJSON);
  return reservedWords;

}

export default getReserved;