const {client} = require('./index');

async function testDB(){

    try {
        //connect client to database
        client.connect();

        //query = promise, so need to await 
        const {rows} = await client.query(`SELECT * FROM users;`);


        console.log(rows)

    } catch (error) {
        console.log(error)
        
    } finally {
        //important to close connection
        client.end();
    }

}

testDB();