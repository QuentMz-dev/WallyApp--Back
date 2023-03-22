import { USER_ROLE } from "../constantes/user.constants.js";
import { createCollection, Schema } from "./mongoose.config.js";

const userSchema = new Schema(
  {
    //   title: String, // String is shorthand for {type: String}
    //   author: String,
    //   body: String,
    //   comments: [{ body: String, date: Date }],
    //   date: { type: Date, default: Date.now },
    //   hidden: Boolean,
    //   meta: {
    //     votes: Number,
    //     favs: Number,
    //   },
    userName: String,
    userFirstName: String,
    role: { type: Number, default: USER_ROLE.member },
    phone: String,
    email: {
      type: String,
      required: [true, "email_require"],
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: [true, "password_require"] },
  },
  {
    timestamps: true,
  }
);

const User = createCollection("User", userSchema);
//création d'une collection nommée "users"
//le nom donné est mis en minuscules avec un "s" => "users"

export default User;
