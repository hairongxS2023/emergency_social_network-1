import stopwords from "./stopwords.js";
export default class Stopwords_filter {
    static filterStopWords(query,flagstatus=false) {
        try 
        {
        const words = query.toLowerCase().match(/\b\w+\b/g);
        if (!words || words.length === 0) {
            throw new Error("Invalid search query");
        }
        const filtered = words.filter(word => !stopwords.includes(word));
        const regex = new RegExp(filtered.join('|'), 'i'); // the i is to ignore cases.
    
        if(flagstatus)
        {
            console.log("filtered:",filtered[0]);
            //Note: If the search criteria include only stop words (see rule below), no results are displayed. 
            if (filtered[0].toLowerCase() === "status")
            {
            return "status"; // status keyword
            }
        }
        if (filtered.length === 0 && words.length > 0) {
            console.log("The search criteria included only stop words no results are displayed. ");  
            return -1;
        }
        return regex;
        } catch (error) {
        console.log("Error in filterStopWords");
        return null;
        }
    }
}