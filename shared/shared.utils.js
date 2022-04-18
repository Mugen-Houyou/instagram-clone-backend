import AWS from 'aws-sdk';

AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  });

export const uploadToS3 = async (file, userId, folderName)=>{
    //const {filename, createReadStream} = await file; ==> Maximum call stack size exceeded 유발.
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const objName = `${folderName}/${userId}-${Date.now()}-${filename}`;
    const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-a-bucket",
      Key: objName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
}