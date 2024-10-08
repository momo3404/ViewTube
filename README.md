# ViewTube
https://github.com/user-attachments/assets/9dfe2ed8-6ec9-41b1-8f20-a4bebf2f12e7

## Summary
This web app is a youtube clone that allows users to sign in through Google and upload and watch videos. The app leverages Google Cloud services for scalability, using Google Cloud Storage for video storage, Cloud Pub/Sub for handling video upload events, and Cloud Run for video processing. Users can sign in with their Google accounts, upload videos that are then transcoded into multiple formats, and view these videos via a Next.js web client. The app also integrates Firebase services for user authentication, API management, and storing video metadata in Firestore.

## Tech Stack
TypeScript, Next.js, Express.js\
Docker, FFmpeg\
Firebase Auth/Functions/Firestore\
Google Cloud Storage/ Pub/Sub / Cloud Run

## Flow of Operations
### 1. User Authentication: 
Users sign in via Google using Firebase Auth.
### 2. Video Upload: 
Authenticated users upload videos via the web client. The client requests a signed URL from the Video API and uploads the video to the raw video bucket in Cloud Storage.
### 3. Video Processing
Once uploaded, a Pub/Sub message triggers a Cloud Run worker to transcode the video. The processed video is saved in the processed video bucket, and the metadata is stored in Firestore.
### 4. Video Viewing:
Users can view processed videos through the web client, which fetches video data and metadata from Cloud Storage and Firestore, respectively.

### For a more detailed explanation of the architecture, [click here](https://github.com/momo3404/ViewTube/wiki)

## References
Firebase Auth: https://firebase.google.com/docs/auth \
Cloud Storage Signed URLs: https://cloud.google.com/storage/docs/access-control/signed-urls \
Pub/Sub Push subscriptions: https://cloud.google.com/pubsub/docs/push \
Using Pub/Sub with Cloud Storage: https://cloud.google.com/storage/docs/pubsub-notifications \
Using Pub/Sub with Cloud Run: https://cloud.google.com/run/docs/tutorials/pubsub \
Google Cloud Storage Client Libraries: https://cloud.google.com/storage/docs/reference/libraries#client-libraries-usage-nodejs

