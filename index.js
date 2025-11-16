import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function getObjectURL(objectKey) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: objectKey
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function putObjectURL(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/user_uploads/${filename}`,
        ContentType: contentType
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function listObjects() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
    });
    const response = await s3Client.send(command);
    return response.Contents || [];
}

async function init() {
    // console.log("Signed URL: ", await getObjectURL('uploads/user_uploads/image-1763256066823'));
    //console.log("URL for uploading: ", await putObjectURL(`image-${Date.now()}`, 'image/png'));
    const objects =  await listObjects();
    console.log("Objects in bucket: ", objects);
}

init();