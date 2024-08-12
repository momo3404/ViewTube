import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

export async function uploadVideo(file: File){
    
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop()
    });

    // upload file through signed URI
    // ? operator stops execution if variable is undefined
    const uploadResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    
    return uploadResult;
}