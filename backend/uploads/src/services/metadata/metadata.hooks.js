import mongoose from "mongoose";

export const metadataHooks = {
  after: {
    create: [updateModel],
    patch: [updateModel],
    remove: [unsetModel],
  },
};

async function updateModel(context) {
  const resultArray = Array.isArray(context.result)
    ? context.result
    : [context.result];
  await Promise.all(
    resultArray.map(async (result) => {
      if (result.model_type && result.model_id && result.model_path) {
        await mongoose.connection
          .collection(result.model_type)
          .updateOne(
            { _id: result.model_id },
            { $set: { [result.model_path + "." + result.hash]: result } }
          );
      }
    })
  );
}
async function unsetModel(context) {
  const resultArray = Array.isArray(context.result)
    ? context.result
    : [context.result];
  await Promise.all(
    resultArray.map(async (result) => {
      if (result.model_type && result.model_id && result.model_path) {
        await mongoose.connection
          .collection(result.model_type)
          .updateOne(
            { _id: result.model_id },
            { $unset: { [result.model_path + "." + result.hash]: "" } }
          );
      }
    })
  );
}
