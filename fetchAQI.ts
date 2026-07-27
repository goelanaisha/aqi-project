import 'dotenv/config';
import fetch from 'node-fetch';
import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


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
    console.log(JSON.stringify(data.records[0], null, 2));
    console.log(`Fetched ${data.records.length} records`);
    
    for(const record of data.records){
        await prisma.reading.create({
            data:{
         state: record.state,
          city: record.city,
          station: record.station,
          pollutantId: record.pollutant_id,
          pollutantMin: record.pollutant_min,
          pollutantMax: record.pollutant_max,
          pollutantAvg: record.pollutant_avg,
          lastUpdate: record.last_update,
        },
    });
}
console.log('All records inserted successfully');

    
}
catch(err){
    console.error('error fetching AQI data :', err);
} finally{
    await prisma.$disconnect();
}
}
fetchAQIData();
