import mongoose from "mongoose";
const { Schema } = mongoose;

export const pricingSchema = new Schema(
  {
    clientType: {
      type: Schema.Types.String,
      trim: true,
      enum: ["hourly", "monthly"],
      required: true,
    },
    priceType: {
      type: Schema.Types.String,
      enum: ["rental", "deposit", "daily-fee", "one-time-fee"],
      required: true,
    },
    dollarValue: { type: Schema.Types.Number, required: true },
    name: { type: Schema.Types.String, trim: true, required: true },
    optional: { type: Schema.Types.Boolean, default: false },
    dailyMinimum: { type: Schema.Types.Number },
    dailyMaximum: { type: Schema.Types.Number },
  },
  { timestamps: true, _id: false }
);

const featureSchema = new Schema(
  {
    type: { type: Schema.Types.String, required: true },
    additionalFee: { type: Schema.Types.Boolean },
    availableHourly: { type: Schema.Types.Boolean },
    availableMonthly: { type: Schema.Types.Boolean },
    byAppointment: { type: Schema.Types.Boolean },
    notes: { type: Schema.Types.String },
  },
  { _id: false }
);

export function clientsModel(app) {
  const schema = new Schema({
    _id: { type: Schema.Types.String, trim: true, lowercase: true },
    name: { type: Schema.Types.String, trim: true, required: true },
    status: {
      type: Schema.Types.String,
      trim: true,
      enum: ["pending", "approved"],
    },
    location: {
      type: {
        type: Schema.Types.String,
        trim: true,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [{ type: Schema.Types.Number }],
    },
    address: { type: Schema.Types.String, trim: true },
    phone: { type: Schema.Types.String, trim: true },
    links: {
      website: { type: Schema.Types.String, trim: true },
      facebook: { type: Schema.Types.String, trim: true },
      twitter: { type: Schema.Types.String, trim: true },
    },
    zip: { type: Schema.Types.String, trim: true },
    state: { type: Schema.Types.String, trim: true },
    monthly: { type: Schema.Types.Boolean, default: false },
    hourly: { type: Schema.Types.Boolean, default: false },
    summary: { type: Schema.Types.String, trim: true },
    description: { type: Schema.Types.String, trim: true },
    capacity: { type: Schema.Types.String, trim: true },
    features: [featureSchema],

    hourlyPricing: [pricingSchema],
    monthlyPricing: [pricingSchema],

    clientDocumentRequirements: [
      {
        name: { type: Schema.Types.String, required: true, trim: true },
        templateHash: { type: Schema.Types.String, trim: true },
        recommendedDocumentType: { type: Schema.Types.String, trim: true },
        optional: { type: Schema.Types.Boolean, default: false },
      },
    ],

    owners: [{ type: Schema.Types.String, trim: true }],
    uploads_images: { type: Schema.Types.Mixed },
    uploads_documents: { type: Schema.Types.Mixed },
    uploads_documentTemplates: { type: Schema.Types.Mixed },
  });
  const model = mongoose.model("clients", schema, "clients");
  schema.index({ location: "2dsphere" });
  return model;
}
