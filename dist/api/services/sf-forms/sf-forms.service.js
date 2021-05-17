"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SFFormsService = void 0;
const axios_instance_1 = __importDefault(require("../../services/axios-instance"));
const sf_body_1 = __importDefault(require("../../services/sf-body"));
const s3_service_1 = __importDefault(require("../../services/s3-storage/s3.service"));
const WS_BACK_URL = process.env.WS_BACK_URL || '';
class SFFormsService {
    constructor() {
        this.service = s3_service_1.default;
        this.http = axios_instance_1.default;
    }
    async sendFormToSF(formData, secure) {
        if (!WS_BACK_URL || !WS_BACK_URL.length) {
            throw new Error(`Backend URL isn't availble!`);
        }
        console.log('Form to SF: ');
        console.log(formData);
        console.log('======================');
        const { method, gryzak, signature } = secure;
        const { first_name, last_name, email, phone, additional_information, position, school_name, city, speciality, graduation_year, english_level, } = formData;
        const body = sf_body_1.default({
            method,
            firstName: first_name,
            lastName: last_name,
            additionalInformation: additional_information,
            graduationYear: graduation_year,
            englishLevel: english_level,
            schoolName: school_name,
            city,
            email,
            phone,
            position,
            speciality,
            gryzak,
            signature,
        });
        console.log('Body to SF request: ');
        console.log(body);
        console.log('======================');
        try {
            const sfdata = await this.sendForm(body);
            console.log('SALESFORCE RESPONSE: ');
            console.log(sfdata);
            const data = JSON.parse(sfdata);
            if (!data)
                throw { message: 'SF RESPONSE FOR NO RESUME ERROR!', reason: data };
            const { status } = data;
            if (status === 'Error') {
                throw { message: 'SF RESPONSE FOR NO RESUME STATUS ERROR!', reason: data };
            }
            return data;
        }
        catch (error) {
            throw { message: error.message || 'SF ERROR!', error: error.reason || error };
        }
    }
    async sendResumeToSF(formData, secure) {
        if (!WS_BACK_URL || !WS_BACK_URL.length) {
            throw new Error(`Backend URL isn't availble!`);
        }
        console.log('Form to SF: ');
        console.log(formData);
        console.log('======================');
        const { method, gryzak, signature } = secure;
        const body = sf_body_1.default({
            method,
            applicationId: formData.applicationId,
            'x-folder': formData.folder,
            'x-bucket': formData.bucket,
            resumeTitle: formData.resumeTitle,
            resumeExternalKey: formData.resumeExternalKey,
            gryzak,
            signature,
        });
        console.log('Body to SF request: ');
        console.log(body);
        console.log('======================');
        try {
            const sfdata = await this.sendForm(body);
            console.log('SALESFORCE RESPONSE TO APPLY RESUME: ');
            console.log(sfdata);
            const { status } = JSON.parse(sfdata);
            if (status === 'Error') {
                throw { message: 'SALESFORCE RESPONSE TO APPLY RESUME STATUS ERROR!', reason: JSON.parse(sfdata) };
            }
            return sfdata;
        }
        catch (error) {
            throw { message: error.message || 'SF ERROR!', error: error.reason || error };
        }
    }
    async sendS3file(file, name, folder) {
        return await this.service.uploadToBucket(file, name, folder);
    }
    async sendForm(body) {
        const { data } = await this.http.post(WS_BACK_URL, body);
        return data;
    }
}
exports.SFFormsService = SFFormsService;
exports.default = new SFFormsService();
