import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config'
import { sendResponse } from "./response"

const ensureUploadDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};


const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp'];


// export const uploadProfilePicture = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     console.log("req.files",req.files)
//     const profilePicture = req.files?.profilePicture;

//     if (typeof profilePicture === 'string') {
//       req.body.profilePicture = profilePicture;
//       next();
//       return;
//     }

//     if (profilePicture && typeof profilePicture === 'object') {
//       const file = profilePicture as UploadedFile;
//       const extension = path.extname(file.name).toLowerCase();

//       if (!allowedExtensions.includes(extension)) {
//         res.status(400).json({
//           error: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
//         });
//         return;
//       }

//       const folder = 'uploads/profile-pictures';
//       const uploadDir = path.join(__dirname, '..', folder);
//       ensureUploadDir(uploadDir);

//       const timestamp = Date.now();
//       const newFileName = `${timestamp}${extension}`;
//       const filePath = path.join(uploadDir, newFileName);

//       await file.mv(filePath);

//       const relativePath = path.join(folder, newFileName).replace(/\\/g, '/');
//       req.body.profilePicture = config.API_URL + "profile-pictures/" + newFileName;

//       next();
//       return;
//     }

//     res.status(400).json({ error: 'Invalid profilePicture input' });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ error: 'File upload failed' });
//   }
// };


export const uploadProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profilePicture = req.files?.profilePicture;

    // if (typeof profilePicture === 'string') {
    //   req.body.profilePicture = profilePicture;
    //   return next();
    // }

    if (profilePicture && typeof profilePicture === 'object') {
      const file = profilePicture as UploadedFile;
      const extension = path.extname(file.name).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return sendResponse(res, 400, {
          status: false,
          message: 'Invalid file type',
          errors: [{ profilePicture: `Allowed types: ${allowedExtensions.join(', ')}` }],
        });
      }

      const folder = 'uploads/profile-pictures';
      const uploadDir = path.join(__dirname, '..', folder);
      ensureUploadDir(uploadDir);

      const timestamp = Date.now();
      const newFileName = `${timestamp}${extension}`;
      const filePath = path.join(uploadDir, newFileName);

      await file.mv(filePath);

      const imageUrl = `${config.API_URL}images/profile-pictures/${newFileName}`;
      req.body.profilePicture = imageUrl;

      next()
      return
    }

    // return sendResponse(res, 400, {
    //   status: false,
    //   message: 'Invalid profilePicture input',
    //   errors: [{ profilePicture: 'No file uploaded or invalid format' }],
    // });
    next()
    return
  } catch (err) {
    console.error('Upload error:', err);
    return sendResponse(res, 500, {
      status: false,
      message: 'Internal server error',
      errors: [{ error: 'File upload failed' }],
    });
  }
};
