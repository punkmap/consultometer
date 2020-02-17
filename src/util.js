
import axios from 'axios';
export const updateMeeting = (meeting) => {
    return new Promise((resolve, reject) => {
        const headers = {
            'Content-Type': 'application/json',
            //'Authorization': 'JWT fefege...'TODO: JWT authentication
          }
          
        axios.put('http://api:api@64.225.122.227:5984/consultometer/'+meeting._id, meeting, {
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
 
 