import { Storage } from "@google-cloud/storage";

// Creates a client
export const storage = process.env.USE_FAKE_STORAGE
  ? new Storage({
      apiEndpoint: "http://fake_storage:4443",
      projectId: "test",
    })
  : new Storage();

export const prefixedPrivateWriteStream = (prefix) =>
  function handlePrivateWriteStream(...args) {
    console.log(args);
    const bucket = storage.bucket("private-files");
    const fileRef = bucket.file("filename.ext");
    return fileRef.createWriteStream({
      metadata: { testing: true },
    });
  };
