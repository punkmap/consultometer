
import axios from 'axios';
export const updateMeeting = (meeting, authToken) => {
    return new Promise((resolve, reject) => {
        const headers = {
            'Content-Type': 'application/json',
          }
        //axios.put('http://64.225.122.227:5984/consultometer/'+meeting._id, meeting, {  
        axios.put('http://64.225.125.231:5000/api/meeting/',{ meeting, authToken }, {
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
 
 