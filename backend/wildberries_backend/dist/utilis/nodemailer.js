"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// utilis/nodemailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a transporter
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail", // You can change this to "hotmail", "yahoo", etc.
        auth: {
            user: process.env.USER_EMAIL, // your Gmail address
            pass: process.env.APP_PASSWORD, // Gmail App Password if 2FA is on
        },
    });
    // Send the email
    yield transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
    console.log(`Email sent to ${to}`);
});
exports.sendEmail = sendEmail;
