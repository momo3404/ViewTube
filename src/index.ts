import express from 'express';
import { 
  uploadProcessedVid,
  downloadRawVid,
  deleteRawVideo,
  deleteProcessedVideo,
  convertVideo,
  setupDirectories
} from './storage';

setupDirectories();

const app = express();
app.use(express.json());

// app.post('/process-video', (req, res) => {

//   // Get the path of the input video file from the request body
//   const inputFilePath = req.body.inputFilePath;
//   const outputFilePath = req.body.outputFilePath;

//   // Check if the input file path is defined
//   if (!inputFilePath || !outputFilePath) {
//     return res.status(400).send('Bad Request: Incorrect file path');
//   }

//   // Create the ffmpeg command
//   ffmpeg(inputFilePath)
//     .outputOptions('-vf', 'scale=-1:360') // 360p
//     .on('end', function() {
//         console.log('Video Processed Successfully');
//         res.status(200).send('Video Processed Successfully');
//     })
//     .on('error', function(err: any) {
//         console.log('An error occurred: ' + err.message);
//         res.status(500).send('An error occurred: ' + err.message);
//     })
//     .save(outputFilePath);
// });

app.post('/process-video', async (req, res) => {

  // Get the bucket and filename from the Cloud Pub/Sub message
  let data;
  // check if filename exists
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);

    if (!data.name) {
      throw new Error('Invalid message received.');
    }
  } 
  catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: No Filename Included.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // download the raw video from cloud storage
  await downloadRawVid(inputFileName);

  // Process the video into 360p resolution
  try { 
    await convertVideo(inputFileName, outputFileName)
  } 
  catch (err) { 
    // Promise.all awaits in parallel
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    return res.status(500).send('Processing Video Failed');
  }
  
  // Upload the processed video to cloud storage
  await uploadProcessedVid(outputFileName);

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send('Processing finished successfully!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
