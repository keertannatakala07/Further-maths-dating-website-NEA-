import { Client, Account, Databases, ID, Query, Storage } from 'appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectID: '6769f09800073781651a'
};

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);
const storage =  new Storage(client);

export{client, account, databases, ID, Query, storage}


client.setEndpoint(Config.endpoint).setProject(Config.projectID);


export async function signUpUser(email, password, userName, name, dob, age, name2) {

    const user = await account.create(ID.unique(), email, password);
    const formattedDob = new Date(dob).toISOString();
    const databaseId = '6769f13b0036227fc6c8';
    const collectionId = '6769f14c002f23277202';
    const userProfileCollectId = '6777cd390013b0742cb3';

    const document = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
            name,
            email,
            age,
            userName,
            name2,
            dob: formattedDob
        }
    );

    const profileDocument = await databases.createDocument(
        databaseId,
        userProfileCollectId,
        ID.unique(),
        {
            name,
            email,
            age,
            userName,
            name2,
            dob: formattedDob
        }
    );

    const session = await account.createEmailPasswordSession(email, password);
    localStorage.setItem('userSignedIn', 'true');  
    return { user, session, document };
}

export async function checkSessionActive() {
    try {
        const session = await account.getSession('current');

        if (session) {
            localStorage.setItem('userSignedIn', 'true');  
            return true;
        } else {
            localStorage.setItem('userSignedIn', 'false');  
            return false;
        }
    } catch (error) {
        localStorage.setItem('userSignedIn', 'false');  
        return false;
    }
}



export async function submit(){
    const response3 = await databases.listDocuments(
        "6769f13b0036227fc6c8",
        "67994978003e43005e13"
    )
    return response3.documents;
}

export async function recordAnswer(userId, questionId, userAnswer, correct){
    const userAnswerCollectionId = '67994a70001197892fc1'
    const databaseId = '6769f13b0036227fc6c8'
    console.log(userId)

    try{
        const document = await databases.createDocument(
            databaseId,
            userAnswerCollectionId,
            ID.unique(),
            {
                userId,
                questionId,
                userAnswer,
                correct
            }
        )
        console.log(document);

    }catch(error){
        console.error(error);
    }
}

export async function results(userId, mathsScore){
    const databaseId = '6769f13b0036227fc6c8'
    const userResultsCollectionId = '67995a07000c5e2f2758'

    const document = await databases.createDocument(
        databaseId,
        userResultsCollectionId,
        ID.unique(),
        {
            userId,
            mathsScore
        }
    )
    console.log(document);
}


export async function logOut() {
    await account.deleteSession('current');
    localStorage.setItem('userSignedIn', 'false');  
}

export async function query(){
    const email = localStorage.getItem('email');
    const databaseID = '6769f13b0036227fc6c8';
    const collectionID = '6769f14c002f23277202';
    const response = await databases.listDocuments(databaseID, collectionID, [Query.equal('email', email)]);
    const userDetails = response.documents[0];
    const userId = userDetails.$id;
    return userId
}
