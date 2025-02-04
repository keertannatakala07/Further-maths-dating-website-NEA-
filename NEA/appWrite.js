import { Client, Account, Databases, ID } from 'appwrite';

export const Config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectID: '6769f09800073781651a'
};

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);

client.setEndpoint(Config.endpoint).setProject(Config.projectID);

export async function signUpUser(email, password, userName, name, dob, age) {
    try {
        try {
            await account.deleteSession('current');
        } catch (logoutError) {
            console.log("No active session or error logging out", logoutError.message);
        }

        const user = await account.create(ID.unique(), email, password);
        const formattedDob = new Date(dob).toISOString();

        const databaseId = '6769f13b0036227fc6c8';
        const collectionId = '6769f14c002f23277202';
        const document = await databases.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                name,
                email,
                age,
                userName,
                dob: formattedDob
            }
        );
        console.log("Document created successfully:", document);

        const session = await account.createEmailPasswordSession(email, password);
        localStorage.setItem('userSignedIn', 'true');  
        return { user, session, document };

    } catch (error) {
        console.error(error.message);
    }
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

export async function logOut() {
    await account.deleteSession('current');
    localStorage.setItem('userSignedIn', 'false');  
}
