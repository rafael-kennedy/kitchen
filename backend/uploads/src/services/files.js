import formidable from "formidable";
import errs from "@feathersjs/errors";
import {
  getBucket,
  imageWriteStream,
  prefixedWriteStream,
  storage,
} from "../storage.js";

export function registerFilesService(app) {
  console.log("registering files service");

  const uploadMiddleware = (configOverwrite) => (req, res, next) => {
    const prefix = req.feathers.userId.replace("|", "_");
    const config = {
      maxFileSize: 5 * 1024 * 1024,
      hashAlgorithm: "sha256",
      keepExtensions: true,
      filename(filename, ext) {
        return prefix + "/" + filename.replace(/[\r\n\[\]()\s]/g, "-") + ext;
      },
      fileWriteStreamHandler: prefixedWriteStream(false),
      parse(fields, files, req) {
        const metadataPayloads = Object.values(files).map((file) => ({
          _id: file.newFilename,
          filename: file.originalFilename,
          hash: file.hash,
          size: file.size,
          mimetype: file.mimetype,
          isPublic: !!file.publicUrl,
          publicUrl: file.publicUrl,
          info: fields.info && JSON.parse(fields.info),
          model_type: req.query.model,
          model_id: req.query.id,
          model_path: req.query.path,
          owners: [req.feathers.userId],
        }));

        return app.service("metadata").create(metadataPayloads);
      },
    };
    const form = formidable({ ...config, ...configOverwrite });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      const parsePromise = configOverwrite.parse
        ? configOverwrite.parse(fields, files, req)
        : config.parse(fields, files, req);

      return parsePromise
        .then((data) => {
          res.json(data);
        })
        .catch((error) => {
          next(error);
        });
    });
  };

  const imageUploadMiddleWare = uploadMiddleware({
    fileWriteStreamHandler: imageWriteStream,
    async parse(fields, files, req) {
      const { file } = files;
      const metadataPayloads = [
        {
          _id: file.newFilename,
          filename: file.originalFilename,
          hash: file.hash,
          size: file.size,
          mimetype: file.mimetype,
          isPublic: true,
          publicUrl: file.sizeNames?.large,
          thumbUrl: file.sizeNames?.thumb,
          medUrl: file.sizeNames?.med,

          info: fields.info && JSON.parse(fields.info),
          model_type: req.query.model,
          model_id: req.query.id,
          model_path: req.query.path,
          owners: [req.feathers.userId],
        },
      ];

      return await app.service("metadata").create(metadataPayloads);
    },
  });
  app.post("/images", imageUploadMiddleWare);

  app.post("/files", uploadMiddleware({}));
  app.post("/remove-file", async (req, res, next) => {
    try {
      const { _id } = req.body;
      const metadata = await app
        .service("metadata")
        .get(_id, { query: req.query });
      if (!metadata) {
        throw new errs.NotFound(
          "The file was not found. It may already have been deleted."
        );
      }
      const deleteResult = await getBucket(!metadata.isPublic)
        .file(_id)
        .delete({ ignoreNotFound: true });
      await app.service("metadata").remove(_id);
    } catch (err) {
      next(err);
    }
  });
}
