const {client, getAllUsers} = require('./index');

async function testDB(){

    try {
        //connect client to database
        client.connect();

        //query = promise, so need to await 
        const users = await getAllUsers();


        console.log(users)

    } catch (error) {
        console.log(error)
        
    } finally {
        //important to close connection
        client.end();
    }

}

testDB();