
import axios from 'axios';

import { config } from './config'
export const updateMeeting = (meeting, authToken) => {
    return new Promise((resolve, reject) => {
        const headers = {
            'Content-Type': 'application/json',
          }
        //axios.put('http://64.225.122.227:5984/consultometer/'+meeting._id, meeting, {  
        axios.put(config.API_URL+'/api/meeting/',{ meeting, authToken }, {
            headers: headers
        })
        .then((response) => {
            resolve(response);
        })
        .catch((error) => {
            console.error(error);
            reject(error);
            
        })    
    })
    
};
export const msTime = {
    msToHMS: ( ms ) => {
        //Convert to seconds:
        var seconds = ms / 1000;
        //Extract hours:
        var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
        seconds = Math.round(seconds % 3600); // seconds remaining after extracting hours
        //Extract minutes:
        var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
        //Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        //make double digits for single digit numbers. 
        seconds = seconds.toString().length === 1 ? '0' + seconds : seconds
        minutes = minutes.toString().length === 1 ? '0' + minutes : minutes
        hours = hours.toString().length === 1 ? '0' + hours : hours
        return hours+":"+ minutes+":"+seconds;
    },
    msToCost: (rate,  ms ) => {
        return (rate * ms/3600000).toFixed(2);
    }
}
 
 