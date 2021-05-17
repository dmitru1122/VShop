"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const email_service_1 = __importDefault(require("../../services/email/email.service"));
class EmailController {
    async sendEmail(req, res) {
        console.log('======================');
        console.log('Sending Email requested');
        console.log('======================');
        const { html, subject } = req.body;
        try {
            const email = await email_service_1.default.sendEmail({ html, subject });
            res.status(200).json({ message: email });
        }
        catch (error) {
            console.log('EmailController sendEmail ERROR: ');
            console.log(error);
            res.status(404).json(error);
        }
    }
}
exports.EmailController = EmailController;
exports.default = new EmailController();
