import { Storage } from "@google-cloud/storage";
import { PassThrough } from "stream";
import sharp from "sharp";
import ReadableStreamClone from "readable-stream-clone";
// Creates a client
export const storage = process.env.USE_FAKE_STORAGE
  ? new Storage({
      apiEndpoint: "http://fake_storage:4443",
      projectId: "test",
    })
  : new Storage();

export function getBucket(isPrivate) {
  return storage.bucket(isPrivate ? "private-files" : "public-files");
}
const publicUrl = (fileRef) => {
  const url = fileRef.publicUrl();
  if (process.env.NODE_ENV === "development") {
    return url.replace("fake_storage", "localhost");
  } else {
    return url;
  }
};
export const prefixedWriteStream = (isPrivate) => {
  return function handleWriteStream(file) {
    const bucket = getBucket(isPrivate);
    const fileRef = bucket.file(file.newFilename);
    const opts = {
      resumable: false,
      metadata: { name: file.newFilename },
    };
    if (!isPrivate) {
      opts.predefinedAcl = "publicRead";
    }
    file.publicUrl = isPrivate ? undefined : publicUrl(fileRef);
    return fileRef.createWriteStream(opts);
  };
};

export function imageWriteStream(file) {
  const bucket = getBucket(false);
  file.sizeNames = {};
  const passThrough = new PassThrough();
  [
    ["large", { width: 1200, withoutEnlargement: true }],
    [
      "thumb",
      {
        width: 75,
        height: 75,
      },
    ],
    ["med", { width: 200 }],
  ].forEach(([sizeName, resizeConfig]) => {
    const filename = file.newFilename.replace("/", `/${sizeName}/`);
    const fileRef = bucket.file(filename);
    file.sizeNames[sizeName] = publicUrl(fileRef);
    new ReadableStreamClone(passThrough)
      .pipe(sharp().resize(resizeConfig))
      .pipe(
        fileRef.createWriteStream({
          resumable: false,
          metadata: { name: filename },
          size: sizeName,
        })
      );
  });

  return passThrough;
}

async function ensureBucket(name) {
  try {
    await storage.createBucket(name);
    console.log("bucket created: " + name);
  } catch (err) {
    if (err.code !== 409) {
      console.error("Error creating bucket: " + name, err);
    }
  }
}

Promise.all([ensureBucket("private-files"), ensureBucket("public-files")]).then(
  () => {
    console.log("Buckets OK");
  }
);
