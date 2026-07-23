import 'dotenv/config';
import fetch from 'node-fetch';


const RESOURCE_ID = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';
const API_KEY = process.env.DATA_GOV_API_KEY;


interface AQIRecord{
    state: string;
  city: string;
  station: string;
  last_update: string;
  pollutant_id: string;
  pollutant_min: string;
  pollutant_max: string;
  pollutant_avg: string;
}

async function fetchAQIData(){
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=50&filters[city]=Delhi`;



try{
    const response = await fetch(url);
    if(!response.ok){
        throw new Error (`Request failed with status ${response.status}`);

    }
    const data = await response.json() as {records:AQIRecord[] };
    console.log(`Fetched ${data.records.length} records`);
    console.log(data.records.slice(0, 5)); 
    
}
catch(err){
    console.error('error fetching AQI data :', err);
}
}
fetchAQIData();
