import { Schema, model } from "mongoose";

const schema = new Schema({
  city_title: { type: String, requared: true },
  category: { type: String, requared: true },
  color: { type: String, requared: true },
  price: { type: String, requared: true },
  size: { type: String, requared: true },
  fit: { type: String, requared: true },
});

export default model("product", schema);
