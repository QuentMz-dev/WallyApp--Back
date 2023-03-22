import User from "../models/user.model.js";
import { logError } from "../utils/logger.utils.js";
import { formatUser, formatUsers } from "../utils/user.utils.js";

const create = async (
  userName,
  userFirstName,
  phone,
  email,
  password,
  role
) => {
  try {
    const user = new User({
      userName,
      userFirstName,
      phone,
      email,
      password,
      role,
    });

    const createdUser = await user.save();

    return createdUser ? formatUser(createdUser) : null;
  } catch (e) {
    logError(`user.dao - create : ${e.message}`);
    return null;
  }
};

const readByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).exec();
    return user ? formatUser(user) : null;
  } catch (e) {
    logError(`user.dao - readByEmail : ${e.message}`);
    return null;
  }
};

const readAll = async () => {
  try {
    const users = await User.find();
    return users ? formatUsers(users) : null;
  } catch (e) {
    logError(`user.dao - readAll : ${e.message}`);
    return null;
  }
};

const readById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? formatUser(user) : null;
  } catch (e) {
    logError(`user.dao - readById : ${e.message}`);
    return null;
  }
};

const updateMemberToAdmin = async (member) => {
  console.log("idMember", member.id);
  try {
    const user = await User.findById(member.id);
    user.role = 1;

    const updatedMember = await user.save();

    return updatedMember ? updatedMember : null;
  } catch (e) {
    logError(`user.dao - updatedMemberToAdmin : ${e.message}`);
    return null;
  }
};

const updateAdminToMember = async (member) => {
  console.log("idMember", member.id);
  try {
    const user = await User.findById(member.id);
    user.role = 2;

    const updatedMember = await user.save();

    return updatedMember ? updatedMember : null;
  } catch (e) {
    logError(`user.dao - updatedAdminToMember : ${e.message}`);
    return null;
  }
};

export const UserDAO = {
  create,
  readAll,
  readByEmail,
  readById,
  updateMemberToAdmin,
  updateAdminToMember,
};
