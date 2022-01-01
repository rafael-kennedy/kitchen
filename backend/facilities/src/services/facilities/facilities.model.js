import mongoose from "mongoose";

export function facilitiesModel(app) {
  const { Schema } = mongoose;
  const schema = new Schema({
    _id: { type: Schema.Types.String, trim: true, lowercase: true },
    name: { type: Schema.Types.String, required: true },
    status: { type: Schema.Types.String, enum: ["pending", "approved"] },
    location: {
      type: { type: Schema.Types.String, enum: ["Point"], default: "Point" },
      coordinates: [{ type: Schema.Types.Number }],
    },
    address: { type: Schema.Types.String },
    zip: { type: Schema.Types.String },
    state: { type: Schema.Types.String },
    monthly: { type: Schema.Types.Boolean, default: false },
    hourly: { type: Schema.Types.Boolean, default: false },
    description: { type: Schema.Types.String },
    capacity: { type: Schema.Types.String },
    features: [{ type: Schema.Types.String }],
    // user_id
    owners: [{ type: Schema.Types.String }],
  });
  return mongoose.model("facilities", schema, "facilities");
}
