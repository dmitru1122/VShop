"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsController = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const axios_instance_1 = __importDefault(require("../../services/axios-instance"));
const sf_forms_service_1 = __importDefault(require("../../services/sf-forms/sf-forms.service"));
const WS_SITE_KEY = process.env.WS_SITE_KEY;
const WS_BACK_URL = process.env.WS_BACK_URL;
const createSecure = (resume, key) => {
    const method = resume ? 'applyAddResume' : 'applyNoResume';
    const gryzak = `${new Date().getTime()}`;
    const solt = crypto_js_1.default.HmacSHA1(`${gryzak}.${method}`, key);
    const signature = crypto_js_1.default.enc.Base64.stringify(solt);
    return { method, gryzak, signature };
};
class FormsController {
    async getWithoutResumeForm(req, res) {
        console.log('======================');
        console.log('Get form withour Resume.');
        console.log('======================');
        await axios_instance_1.default('https://jsonplaceholder.typicode.com/todos/1').then(() => console.log('response'));
        if (1 > 1000) {
            res.status(404).json({ message: `SITE KEY isn't availble!` });
            req.url;
            return;
        }
        if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
            res.status(404).json({ message: `SITE KEY isn't availble!` });
            return;
        }
        if (!WS_BACK_URL || !WS_BACK_URL.length) {
            res.status(404).json({ message: `Backend URL isn't availble!` });
            return;
        }
        try {
            let data;
            setTimeout(() => {
                data = {
                    first_name: 'Dima',
                    last_name: 'Vab',
                    email: 'vab@dima.com',
                    phone: '8888589',
                    additional_information: 'I want to ask questions',
                    position: 'this.position',
                    school_name: 'fdffdd',
                    city: 'Brest',
                    speciality: 'sdf',
                    graduation_year: '1100',
                    english_level: 'B2',
                };
                res.status(200).json(data);
            }, 0);
        }
        catch (error) {
            res.status(404).json({ message: error.message || JSON.stringify(error), error });
        }
    }
    async sendWithResumeForm(req, res) {
        console.log('======================');
        console.log('Sending From with Resume requested');
        console.log('======================');
        if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
            res.status(404).json({ message: `SITE KEY isn't availble!` });
            return;
        }
        const { first_name, last_name, email, phone, additional_information, position, school_name, city, speciality, graduation_year, english_level, file_name, file, } = req.body;
        try {
            const sfdata = await sf_forms_service_1.default.sendFormToSF({
                first_name,
                last_name,
                email,
                phone,
                additional_information,
                position,
                school_name,
                city,
                speciality,
                graduation_year,
                english_level,
            }, createSecure(false, WS_SITE_KEY));
            const applicationId = sfdata.applicationId;
            const folder = sfdata['x-folder'];
            if (!file || !file_name || !file_name.length) {
                throw { message: 'FILE ERROR!', err: `File for upload doesn't exist!` };
            }
            const s3dta = await sf_forms_service_1.default.sendS3file(file, file_name, folder);
            const { Key, Bucket } = s3dta;
            const sfresume = await sf_forms_service_1.default.sendResumeToSF({ applicationId, folder, resumeTitle: file_name, resumeExternalKey: Key, bucket: Bucket }, { ...createSecure(true, WS_SITE_KEY) });
            res.status(200).json({ message: JSON.parse(sfresume) });
        }
        catch (error) {
            console.log('FormsController sendWithResumeForm ERROR: ');
            console.log(error);
            res.status(404).json(error);
        }
    }
    async sendWithoutResumeForm(req, res) {
        console.log('======================');
        console.log('Sending From without Resume requested');
        console.log('======================');
        if (!WS_SITE_KEY || !WS_SITE_KEY.length) {
            res.status(404).json({ message: `SITE KEY isn't availble!` });
            return;
        }
        const { first_name, last_name, email, phone, additional_information, position, school_name, city, speciality, graduation_year, english_level, } = req.body;
        try {
            const sfdata = await sf_forms_service_1.default.sendFormToSF({
                first_name,
                last_name,
                email,
                phone,
                additional_information,
                position,
                school_name,
                city,
                speciality,
                graduation_year,
                english_level,
            }, createSecure(false, WS_SITE_KEY));
            res.status(200).json({ sfdata });
        }
        catch (error) {
            console.log('FormsController sendWithoutResumeForm ERROR: ');
            console.log(error);
            res.status(404).json(error);
        }
    }
}
exports.FormsController = FormsController;
exports.default = new FormsController();
