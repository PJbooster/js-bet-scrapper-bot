import mongoose from "mongoose";
import { areSame } from "./helpers.js";
import { logger } from "./logger.js";
import { Voll } from "../model/voll.js";

export async function connectDatabse() {
  return await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function save(betObj) {
  let previous = await Voll.findOne({ ig: betObj.ig })
    .sort({ _id: -1 })
    .limit(1);

  if (previous && areSame(previous, betObj)) return;

  const voll = new Voll(betObj);
  voll
    .save()
    .then((_) =>
      logger.info(
        `Added new bet object: ${betObj.ig} into database successfully.`
      )
    )
    .catch((err) => logger.error("Error during insert data into database."));
}
