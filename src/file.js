import fs from "fs";

export const fileName = "data.json";

export async function saveToFile(betObj) {
  let jsonObjects = [];
  let json;
  try {
    jsonObjects = await fs.readFileSync(fileName);
    json = JSON.stringify([...JSON.parse(jsonObjects), betObj], null, 4);
  } catch (e) {
    console.log("File is empty.");
    json = JSON.stringify([betObj], null, 4);
  }

  await fs.writeFileSync(fileName, json);
  console.log("A new bet object has added successfully.");
}
