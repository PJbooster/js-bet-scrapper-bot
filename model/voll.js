import mongoose from "mongoose";

const Schema = mongoose.Schema;

const vollSchema = new Schema(
  {
    team1: {
      type: String,
      required: true,
    },
    team2: {
      type: String,
      required: true,
    },
    ig: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: false,
    },
    mainScore: {
      type: String,
      required: false,
    },
    detailScore: {
      type: String,
      required: false,
    },
    t1so: {
      type: mongoose.Types.Decimal128,
      required: false,
    },
    t2so: {
      type: mongoose.Types.Decimal128,
      required: false,
    },
    t1mo: {
      type: mongoose.Types.Decimal128,
      required: false,
    },
    t2mo: {
      type: mongoose.Types.Decimal128,
      required: false,
    },
  },
  { timestamps: true }
);

export const Voll = mongoose.model("Voll", vollSchema);
