import { createCollection, ObjectId, Schema } from "./mongoose.config.js";

const lessonSchema = new Schema(
  {
    sportType: String,
    coach: String,
    eventName: String,
    localDay: String,
    day: Number,
    month: Number,
    year: Number,
    hours: Number,
    minutes: Number,
    duration: String,
    endHours: Number,
    endMinutes: Number,
    realTime: String,
    slotsNbr: String,
    slots: [{ type: ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Lesson = createCollection("Lesson", lessonSchema);
//création d'une collection nommée "users"
//le nom donné est mis en minuscules avec un "s" => "users"

export default Lesson;
