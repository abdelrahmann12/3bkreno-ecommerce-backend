
import multer from "multer";

const storage = multer.memoryStorage();
// save file in ram not server
// save in req.file.buffer

export const upload = multer({ storage });
// middleware 

