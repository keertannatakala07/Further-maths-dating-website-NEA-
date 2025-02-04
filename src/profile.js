import{databases, Query, storage} from "../appWrite.js";
    
export async function profile() {
    const email = localStorage.getItem('email');
    const databaseID = '6769f13b0036227fc6c8';
    const collectionID = '6777cd390013b0742cb3';
    const bucketID = '677aac46002525fd3fd3';
    const response = await databases.listDocuments(databaseID, collectionID, [Query.equal('email', [email])]);
    const userDetails = response.documents[0];

    if(userDetails.pictures){
        const fileID = userDetails.pictures;
        const profilePicture = document.getElementById('profilePicture');
        profilePicture.src = storage.getFileView(bucketID, fileID);
        profilePicture.style.display = 'block';
    }
    
    document.getElementById('name').innerText = userDetails.name;
    document.getElementById('userName').innerText = userDetails.userName;
    document.getElementById('email').innerText = userDetails.email;
    document.getElementById('age').innerText = userDetails.age;
    document.getElementById('dob').innerText = new Date(userDetails.dob).toLocaleDateString();

}