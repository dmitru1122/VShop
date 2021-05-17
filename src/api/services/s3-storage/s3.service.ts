import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

const ACCESS_KEY_ID = process.env.S3_KEY;
const ACCESS_SECRET = process.env.S3_SECRET;
const BUCKET_REGION = process.env.S3_REGION;
const BUCKET_NAME = process.env.S3_BUCKET;

export interface S3Response {
  ETag: string;
  Location: string;
  key?: string;
  Key: string;
  Bucket: string;
}

export class S3Service {
  private s3: S3;

  constructor() {
    if (!ACCESS_SECRET || !ACCESS_KEY_ID || !BUCKET_REGION || !BUCKET_NAME) {
      throw { messgae: `ENV vars for AWS S3 isn't available!` };
    }

    AWS.config.update({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: ACCESS_SECRET,
      region: BUCKET_REGION,
    });

    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  }

  public uploadToBucket(file: string | ArrayBuffer, name: string, folder: string): Promise<S3Response> {
    return new Promise((resolve, reject) => {
      if (!BUCKET_NAME) {
        reject({ messgae: `ENV vars for AWS S3 isn't available!` });
        return;
      }

      const params: S3.PutObjectRequest = {
        Bucket: BUCKET_NAME,
        Body: file,
        Key: `${folder}/${new Date().getTime()}-${name}`,
      };

      const bucketParams = {
        Bucket: BUCKET_NAME,
        Prefix: 'Lb3PTKLVdJOlQmDG/1618572156119-index.html'
      };

      console.log('S3 params: ');
      console.log(params);

      this.s3.listObjectsV2(bucketParams, (err, data) => {
        if (err) {
          console.log('Error in listBuckets:', err);
        } else {
          console.log('success', data);
          debugger;
        }
      });

      this.s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
        if (err) {
          console.log('Upload to S3 Error: ');
          console.log(err);
          reject(err);
        }

        console.log('S3 Data: ');
        console.log(data);
        resolve(data);
      });
    });
  }
}

export default new S3Service();
