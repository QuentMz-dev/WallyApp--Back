import { UserDAO } from "../daos/user.dao.js";
import { jwtSign } from "../utils/jwt.utils.js";
import { omitMulti } from "../utils/objet.utils.js";
import { emailIsValid } from "../utils/regex.utils.js";
import { stringAreFilled } from "../utils/string.utils.js";

const read = async (req, res) => {
  const users = await UserDAO.readAll();
  if (!users) return res.status(400).json({ message: `can't retrieve users` });
  res.status(200).json({ users });
};

const signUp = async (req, res) => {
  const userName = req.body.userName;
  const userFirstName = req.body.userFirstName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;

  // SET DEFAULT ADMIN
  const ADMIN = process.env.ADMIN;
  const role = email === ADMIN ? 1 : 2;

  if (!emailIsValid(email.toLowerCase()))
    return res.status(400).json({ message: "invalid_email" });

  if (!stringAreFilled([userName, userFirstName, phone, email, password])) {
    return res.status(400).json({ message: "incorrect_data" });
  }

  const user = await UserDAO.create(
    userName,
    userFirstName,
    phone,
    email,
    password,
    role
  );

  if (!user) return res.status(403).json({ message: "email_already_exist" });
  const token = jwtSign(user.id);

  return res.status(201).json({
    message: "user_created",
    data: true,
    user: omitMulti(user, ["email", "password", "id", "name", "phone"]),
    token,
  });
};

const signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!stringAreFilled([email, password])) {
    return res
      .status(401)
      .json({ message: "email or password is not correct" });
  }

  const user = await UserDAO.readByEmail(email);

  if (user?.password === password) {
    const token = jwtSign(user.id);
    return res.status(200).json({
      message: "ok",
      // user: omitMulti(user, ["password"]),
      token,
      data: true,
      role: user.role,
    });
  } else {
    return res.status(401).json({ data: null, message: "login_failed" });
  }
};

const checkRole = async (req, res) => {
  const userId = req.body.userId;
  const user = await UserDAO.readById(userId);
  if (!user) return res.status(400).json({ message: "failed" });
  res.status(200).json({ role: user.role, id: user.id });
};

const setAdmin = async (req, res) => {
  const userMail = req.body.newAdmin;
  const user = await UserDAO.readByEmail(userMail);
  if (!user) return res.status(400).json({ message: "failed_user_not_found" });
  console.log(user);
  const updatedUser = await UserDAO.updateMemberToAdmin(user);

  res.status(200).json({
    role: updatedUser.role,
    id: updatedUser.id,
    message: "new_admin_added",
  });
};

const deleteAdmin = async (req, res) => {
  const userMail = req.body.oldAdmin;
  const user = await UserDAO.readByEmail(userMail);
  if (!user) return res.status(400).json({ message: "failed_user_not_found" });
  console.log(user);
  const ADMIN = process.env.ADMIN;
  if (user.email === ADMIN)
    return res
      .status(403)
      .json({ message: "FORBIDDEN_cant_delete_this_main_admin" });
  const updatedUser = await UserDAO.updateAdminToMember(user);

  res.status(200).json({
    role: updatedUser.role,
    id: updatedUser.id,
    message: "admin_role_deleted",
  });
};

export const UsersController = {
  read,
  signUp,
  signIn,
  checkRole,
  setAdmin,
  deleteAdmin,
};
