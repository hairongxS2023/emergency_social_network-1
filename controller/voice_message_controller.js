import multer from "multer";
import path from "path";
import voice_message_model from "../models/voice_msg.js";
import citizen_model from "../models/citizens.js";
import MongooseClass from "../utils/database.js";
import { fileURLToPath } from "url";
import fs from "fs";
import Time from "../utils/time.js";
const MAXMESSAGECOUNT = 4;
export default class Voice {
    constructor () { }
    static generateFileName(req, file, callback) {
        const { username } = req.body;
        const timestamp = Date.now();
        const filename = `${username}-${timestamp}.ogg`;
        callback(null, filename);
    }
    static get_upload() {
        const storage = multer.diskStorage({
            destination: "public/voice-messages",
            filename: Voice.generateFileName,
        });
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1000000 },
            fileFilter: (req, file, callback) => {
                const ext = path.extname(file.originalname); if (ext !== ".ogg") { return callback(new Error("Only .ogg files are allowed")); } callback(null, true);
            },
        });
        return upload;
    }
    static async get_all_voice_messages(req, res) {
        await MongooseClass.findAllRecords(voice_message_model).then((result) => {
            res.status(200).json({ data: result });
        }).catch((err) => {
            res.status(500).json({ status: "Error" });
        });
    }

    static async countMessagesInLastHour(username) {
        const currentTime = Date.now();
        const oneHourAgo = currentTime - 60 * 60 * 1000;

        // Query the database for messages sent by the user within the past hour
        const recentMessages = await voice_message_model.find({
            sender: username,
            timestamp: { $gt: oneHourAgo },
        });
        return recentMessages.length;

    }

    static async broadcast_and_save_voice_message(io, req, res) {
        if (!req.body.username) {
            return res.status(400).json({ status: "Bad Request", message: "Missing required fields" });
        }
        if (!req.file) {
            return res.status(400).json({ status: "Bad Request", message: "Missing file" });
        }
        const { username } = req.body;
        const { filename } = req.file;
        const url = `/voice-messages/${filename}`;
        const msgcount = await this.countMessagesInLastHour(username);
        if (msgcount > MAXMESSAGECOUNT) {
            console.log("Too many messages in the last hour")
            return res.status(429).json({ status: "Too Many Requests" });
        }
        else {
            try {
                const id = await this.save_voice_message(req, res);
                io.emit("new-voice-message");
                io.emit("voice-message", { username, url });
                return res.status(200).json({ status: "OK", id: id });
            } catch (error) {
                console.error(`Error saving voice message from ${username}: ${error}`);
                return res.status(500).json({ error: "Failed to save voice message" });
            }
        }
    }

    static async delete_voice_message(io, req, res) {
        if (!req.body.id) {
            return res.status(400).json({ status: "Bad Request", message: "Missing required fields" });
        }
        const id = req.body.id;
        try {
            const result = await MongooseClass.deleteRecord(voice_message_model, id, false, false, true);
            console.log(`Deleted voice message with id ${id}`);
        } catch (err) {
            console.log(`In voice_msg_controller: Failed to delete voice message with id ${id}`);
            return res.status(404).json({ status: "Not Found" });
        }

        io.emit("delete-voice-message");
        return res.status(204).json({ status: "No Content" });
    }

    static delete_local_file(filePath) {
        fs.unlinkSync(filePath)
        }
    static async save_voice_message(req, res) {
        if (!req.body.username) {
            return res.status(400).json({ status: "Bad Request", message: "Missing required fields" });
        }
        if (!req.file) {
            return res.status(400).json({ status: "Bad Request", message: "Missing file" });
        }
        const { username } = req.body;
        const { filename } = req.file;
        let voice_data;
        const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/voice-messages", filename);

        // if (req.file.buffer) {
        //     voice_data = req.file.buffer; // Use the buffer directly if available
        // } else {
        //     voice_data = fs.readFileSync(filePath);
        // }
        voice_data = req.file.buffer?req.file.buffer:fs.readFileSync(filePath);
        // create a new voice message instance
        const user = await MongooseClass.findAllRecords(citizen_model, { username: username });
        const emergency_status = user[ 0 ].emergency_status;
        //const user_status = user.status;
        const newVoiceMsg = new voice_message_model({
            sender: username,
            status: emergency_status,
            timesent: Time.get_time(),
            voicedata: voice_data,
        });


        // save the message to the database
        await MongooseClass.insertRecord(newVoiceMsg)
        // delete the temporary file from the server
        !req.file.buffer && this.delete_local_file(filePath);
        const id = newVoiceMsg._id.toString();
        return id
        // send a response to the client


    }

};