import formidable from "formidable";
import { prefixedPrivateWriteStream } from "../storage.js";

export function registerFilesService(app) {
  console.log("registering files service");

  const uploadMiddleware = (configOverwrite) => (req, res, next) => {
    const prefix = req.feathers.userId.replace("|", "_");
    const config = {
      maxFileSize: 5 * 1024 * 1024,
      hashAlgorithm: "sha256",
      filename(filename) {
        return filename.replace(/[\r\n\[\]()\s]/g, "-");
      },
      fileWriteStreamHandler: prefixedPrivateWriteStream(prefix),
    };
    const form = formidable({ ...config, ...configOverwrite });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ fields, files });
    });
  };

  app.post("/files", uploadMiddleware({}));
}
