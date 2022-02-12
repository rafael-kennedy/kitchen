import mongoose from "mongoose";

export function metadataModel(app) {
  const { Schema } = mongoose;
  const schema = new Schema(
    {
      _id: { type: Schema.Types.String, trim: true, lowercase: true },

      filename: { type: Schema.Types.String, trim: true },
      hash: { type: Schema.Types.String, index: true },
      mimetype: { type: Schema.Types.String },
      isPublic: { type: Schema.Types.Boolean, default: false },

      publicUrl: { type: Schema.Types.String },
      thumbUrl: { type: Schema.Types.String },
      medUrl: { type: Schema.Types.String },

      size: { type: Schema.Types.Number },
      info: { type: Schema.Types.Mixed },

      // document specific fields
      expiresAt: { type: Schema.Types.Date },
      documentType: { type: Schema.Types.String },

      // model fields
      model_type: { type: Schema.Types.String, index: true },
      model_id: { type: Schema.Types.String, index: true },
      model_path: { type: Schema.Types.String, index: true },

      owners: [{ type: Schema.Types.String }],
    },
    { timestamps: true }
  );
  return mongoose.model("metadata", schema, "uploads_metadata");
}
