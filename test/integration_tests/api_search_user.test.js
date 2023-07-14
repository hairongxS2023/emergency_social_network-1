import axios from 'axios';
import { expect } from 'chai';
import MongooseClass from '../../utils/database';
import Auth from '../../middleware/auth.js';

const payload = {username: "testname", authority: "citizen"};
let jwtToken;
beforeAll(async()=>[
    jwtToken = await Auth.genToken(payload)
])

Auth.genToken(payload).then((token)=>{
    const jwtToken = token;
})

const api = axios.create({
    baseURL: 'http://localhost:5003',
    headers: {contentType :"application/json; charset=utf-8"},
    timeout: 100000,
});


// test('GET /users/:search_value', async () => {
    
//     try{
//         //MongooseClass.initDB();
//         const response = await api.get('/users/:search_value', {
//             headers:{
//                 'Cookie': `access_token=${jwtToken}`,
//             }
//         });
//         expect(response.status).to.equal(200);
//     }catch(err){
//         console.log(err);
//         throw err;
//     }
// });

test('GET /users/:search_value', async () => {
    try {
      const searchValue = 'test';
      const response = await api.get(`/users/${searchValue}`, {
        headers: {
          Cookie: `access_token=${jwtToken}`,
        },
      });
  
      expect(response.status).to.equal(200);
      //expect(response.data.userlist).to.be.an('array');
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
  

test('GET /users/statuses/:search_value', async () => {

    try{
        //MongooseClass.initDB();
        const searchValue = 'undefined';
        const response = await api.get(`/users/statuses/${searchValue}`,{
            headers:{
                'Cookie': `access_token=${jwtToken}`,
            }
        });
        expect(response.status).to.equal(200);
    }catch(err){
        console.log(err);
        throw err;
    }
});

test( 'GET /announcement_search', async () =>
{

    try
    {
        //MongooseClass.initDB();
        const requestBody = {
          data:"test",
          count: 1
        };
        const response = await api.post( '/announcement_search',requestBody, {
            headers: {
                'Cookie': `access_token=${ jwtToken }`,
            }
        } );
        expect( response.status ).to.equal( 200 );
    } catch ( err )
    {
        console.log( err );
        throw err;
    }
} );
