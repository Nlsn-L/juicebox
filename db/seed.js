const {client,
     getAllUsers, 
     createUser,
     updateUser,
     updatePosts,
     createPosts,
     getAllPosts,
     getPostsByUser,
     getUserById   } = require('./index');

async function createInitialUsers(){
    try {
        console.log("Starting to create users")

        const albert = await createUser({username:"albert", password:"bertie99",name:"Al bert",location:"Sidney, Australia"})
        const sandra = await createUser({username:"sandra", password:"2sandy4me", name:"Just Sandra", location:"Ain't tellin'"})
        const glamgal = await createUser({username:"glamgal", password:"soglam", name:"Joshua", location:"Upper Eastside"})
        
        //console.log(albert, sandra, glamgal)

        console.log("Finished creating users")
    } catch (error) {
        console.error("Error creating users")
        throw error;
    }
}

async function createInitialPosts(){
    try {
        
        const [albert, sandra, glamgal] = await getAllUsers();
        await createPosts({authorId:albert.id, title:"firstPosts", content:"This is my first posts. I hope I love writing blogs as much as I love writing them."})


    } catch (error) {
        throw error
    }


}

async function dropTables(){

    try {
        console.log("Starting to drop tables...")
        
        await client.query(`
        DROP TABLE IF EXISTS posts;
        `)

        await client.query(`
        DROP TABLE IF EXISTS users
        `)
        


      console.log("Finished dropping tables!")  
    } catch (error) {
        console.error("Error dropping tables!")
        throw error;
        
    }

}

async function createTables() {

    try {
        console.log("Starting to build tables...")

        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);
        await client.query(`
        CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `)

      console.log("Finished building tables!")  
    } catch (error) {
        console.error("Error building tables!")
        throw error;
        
    }
}

async function rebuildDB(){
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();

    } catch (error) {
       throw error;
    }

}

async function testDB(){

    try {
        console.log("Starting to test database...")

        //query = promise, so need to await 
        console.log("Calling get all users")
        const users = await getAllUsers();

        console.log("Result:", users)
        console.log("Calling updateUser on users [0]")
        const updateUserResult = await updateUser(users[0].id,{name: "NewName SoGood",location: "Lesterville,KY"});
        console.log("Result:", updateUserResult)

        console.log("Calling getAllPosts")
        const posts = await getAllPosts();
        console.log("Result:", posts)

        console.log("Calling updatePosts on posts [0]")
        const updatePostResult = await updatePosts(posts[0].id,{title: "New Title", content: "Updated Content"});
        console.log("Result:", updatePostResult)

        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);

        console.log("Finished testing database...")
    } catch (error) {
        console.error("Error testing database")
        throw error
        
    }

}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => 
        client.end()
        )