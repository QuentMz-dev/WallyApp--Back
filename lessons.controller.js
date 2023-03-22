import { LessonDAO } from "../daos/lesson.dao.js";
import { UserDAO } from "../daos/user.dao.js";
import Lesson from "../models/lesson.model.js";
import { stringAreFilled } from "../utils/string.utils.js";

const read = async (req, res) => {
  // const token = req.headers.authorization;
  // // Check si Token Ok
  // const userId = jwtVerify(token);
  // if (!userId) return res.status(403).json({ message: "unauthorized" });

  // si JwtMiddleware actif, commenter le reste au dessus
  // const userId = req.body.userId;
  const { planningSkate, planningSurf, planningSail } =
    await LessonDAO.readAll();

  if (!planningSkate || !planningSurf || !planningSail)
    return res.status(400).json({ message: `can't retrieve lessons` });
  res.status(200).json({ planningSkate, planningSurf, planningSail });
};
const readAdmin = async (req, res) => {
  // Check si Admin
  const userId = req.body.userId;
  const user = await UserDAO.readById(userId);
  if (!user) return res.status(405).json({ message: "failed" });
  if (user.role !== 1) return res.status(401).json({ message: "Unauthorized" });
  //==

  const { planningSkate, planningSurf, planningSail } =
    await LessonDAO.readAllAdmin();

  if (!planningSkate || !planningSurf || !planningSail)
    return res.status(400).json({ message: `can't retrieve lessons` });
  res.status(200).json({ planningSkate, planningSurf, planningSail });
};

const postOne = async (req, res) => {
  const sportType = req.body.sportType;
  const coach = req.body.coach;
  const eventName = req.body.eventName;
  const localDay = req.body.localDay;
  const day = req.body.day;
  const month = req.body.month;
  const year = req.body.year;
  const hours = req.body.hours;
  const minutes = req.body.minutes;
  const duration = req.body.duration;
  const endHours = req.body.endHours;
  const endMinutes = req.body.endMinutes;
  const realTime = req.body.realTime;
  const slotsNbr = req.body.slotsNbr;
  const slots = req.body.slots;

  // CHECK SI ADMIN
  const userId = req.body.userId;
  const user = await UserDAO.readById(userId);
  if (!user) return res.status(401).json({ message: "failed" });
  if (user.role !== 1) return res.status(405).json({ message: "Unauthorized" });

  if (
    !stringAreFilled([
      sportType,
      coach,
      eventName,
      localDay,
      duration,
      slotsNbr,
    ]) ||
    hours === "" ||
    minutes === "" ||
    endHours === null ||
    endMinutes === null
  ) {
    return res.status(400).json({ message: "incorrect_data" });
  }

  const duplicate = await LessonDAO.checkDuplicate(
    coach,
    localDay,
    hours,
    minutes
  );
  if (duplicate)
    return res.status(409).json({ message: "lesson_already_exist" });

  const lesson = await LessonDAO.create(
    sportType,
    coach,
    eventName,
    localDay,
    day,
    month,
    year,
    hours,
    minutes,
    duration,
    endHours,
    endMinutes,
    realTime,
    slotsNbr,
    slots
  );

  if (!lesson) return res.status(403).json({ message: "creation_failed" });

  res.status(201).json({
    message: "lesson created",
    data: lesson,
  });
};

const deleteOne = async (req, res) => {
  // CHECK SI ADMIN
  const userId = req.body.userId;

  const user = await UserDAO.readById(userId);
  if (!user) return res.status(405).json({ message: "failed_unlogged" });
  if (user.role !== 1) return res.status(401).json({ message: "Unauthorized" });

  const idLesson = req.body.id;
  const deleted = await LessonDAO.deleteLesson(idLesson);
  if (!deleted)
    return res.status(400).json({ message: `can't delete lessons` });
  res.status(200).json({ deleted });
};

// const updateAddOneInSlots = async (req, res) => {
//   // CHECK SI ADMIN
//   const userId = req.body.userId;

//   const user = await UserDAO.readById(userId);
//   if (!user) return res.status(400).json({ message: "failed" });
//   if (user.role !== 1) return res.status(400).json({ message: "Unauthorized" });
//   //==
//   const idLesson = req.body.id;
//   // const slotsUpdate = req.body.slots;
//   const updated = await LessonDAO.updateSlots(idLesson, user.id);
//   if (!updated)
//     return res.status(400).json({ message: `can't update lessons` });
//   res.status(200).json({ updated });
// };

const updateAddMemberInSlots = async (req, res) => {
  // CHECK SI ADMIN
  const userId = req.body.userId;
  const user = await UserDAO.readById(userId);

  if (!user) return res.status(405).json({ message: "failed" });
  if (!user.role) return res.status(401).json({ message: "Unauthorized" });

  const idLesson = req.body.id;

  //controle duplication membre
  const lesson = await Lesson.findById(idLesson);

  if (lesson.slots.length >= Number(lesson.slotsNbr)) {
    return res.status(401).json({
      message: "lesson_full",
    });
  }

  if (user.role === 2 && lesson.slots.includes(user.id))
    return res.status(409).json({ message: "You already join this lesson" });
  //===

  //===
  const updated = await LessonDAO.updateSlots(idLesson, user.id);
  if (!updated)
    return res.status(400).json({ message: `can't update lessons` });
  res.status(200).json({ message: "Member_added", updated });
};

const updateRemoveOneInSlots = async (req, res) => {
  // CHECK SI ADMIN
  const userId = req.body.userId;
  const user = await UserDAO.readById(userId);
  if (!user) return res.status(405).json({ message: "failed" });
  if (!user.role) return res.status(401).json({ message: "Unauthorized" });

  // TODO : Check si membre pas deja inscrit
  // Pass droit pour les admins
  const idLesson = req.body.idLesson;
  const idMember = req.body.idMember;
  // console.log(idMember);
  // console.log(idLesson);
  const updated = await LessonDAO.removeInSlots(idLesson, idMember);
  if (!updated)
    return res.status(400).json({ message: `can't update lessons` });
  res.status(200).json({ updated });
};

export const LessonsController = {
  read,
  readAdmin,
  postOne,
  deleteOne,
  // updateAddOneInSlots,
  updateAddMemberInSlots,
  updateRemoveOneInSlots,
};
