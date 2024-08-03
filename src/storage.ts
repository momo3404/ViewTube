import {Storage} from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

// instance of Google Clound Storage
const storage = new Storage();

// names must be unique
// download from this bucket
const rawVidBucketName = "viewtube-testvids";
// upload to this bucket
const processedVidBucketName = "viewtube-processed-vids";

// raw videos put into these local folders
const localRawVidPath = "./raw-videos";
const localProcessedVidPath = "./processed-videos"


export function setupDirectories(){
    ensureDirectoryExistence(localRawVidPath);
    ensureDirectoryExistence(localProcessedVidPath);
}

export function convertVideo(rawVidName: string, processedVidName: string){
    return new Promise<void>((resolve, reject) =>{
        ffmpeg(`${localRawVidPath}/${rawVidName}`)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Video Processed Successfully');
            resolve();
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);
        })
        .save(`${localProcessedVidPath}/${processedVidName}`);
    });
}

export async function downloadRawVid(filename: string){
    await storage.bucket(rawVidBucketName).file(filename).download({destination: `${localRawVidPath}/${filename}`});

    console.log(`gs://${rawVidBucketName}/${filename} downloaded to ${localRawVidPath}/${filename}.`)
}

export async function uploadProcessedVid(filename: string){
    const bucket = storage.bucket(processedVidBucketName);

    await bucket.upload(`${localProcessedVidPath}/${filename}`, {
        destination: filename
    });
    console.log(`${localProcessedVidPath}/${filename} uploaded to gs://${processedVidBucketName}/${filename}.`);

    await bucket.file(filename).makePublic();
}

export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVidPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVidPath}/${fileName}`);
}

function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(`Could not delete file at ${filePath}`, err);
            reject(err);
          } else {
            console.log(`File deleted at ${filePath}`);
            resolve();
          }
        });
      } else {
        console.log(`File not found at ${filePath}, skipping delete.`);
        resolve();
      }
    });
}

function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
      console.log(`Directory created at ${dirPath}`);
    }
  }