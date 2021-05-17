"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ACCESS_KEY_ID = process.env.S3_KEY;
const ACCESS_SECRET = process.env.S3_SECRET;
const BUCKET_REGION = process.env.S3_REGION;
const BUCKET_NAME = process.env.S3_BUCKET;
class S3Service {
    constructor() {
        if (!ACCESS_SECRET || !ACCESS_KEY_ID || !BUCKET_REGION || !BUCKET_NAME) {
            throw { messgae: `ENV vars for AWS S3 isn't available!` };
        }
        aws_sdk_1.default.config.update({
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: ACCESS_SECRET,
            region: BUCKET_REGION,
        });
        this.s3 = new aws_sdk_1.default.S3({ apiVersion: '2006-03-01' });
    }
    uploadToBucket(file, name, folder) {
        return new Promise((resolve, reject) => {
            if (!BUCKET_NAME) {
                reject({ messgae: `ENV vars for AWS S3 isn't available!` });
                return;
            }
            const params = {
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
                }
                else {
                    console.log('success', data);
                    debugger;
                }
            });
            this.s3.upload(params, (err, data) => {
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
exports.S3Service = S3Service;
exports.default = new S3Service();
