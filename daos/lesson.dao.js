import Lesson from "../models/lesson.model.js";
import { compareTime } from "../utils/lessons.utils.js";
import { logError } from "../utils/logger.utils.js";

// Fonction exectuté seulement pour les membres + non Loggé
const readAll = async () => {
  try {
    const skateP = await Lesson.find({ sportType: "planningSkate" });
    const surfP = await Lesson.find({ sportType: "planningSurf" });
    const sailP = await Lesson.find({ sportType: "planningSail" });

    // compareTime filtre les anciens cours et renvois que ceux
    // dont le timeStamp est supérieur a ATM
    const planningSkate = compareTime(skateP);
    const planningSurf = compareTime(surfP);
    const planningSail = compareTime(sailP);

    // console.log(
    //   surfP.filter((lesson) => {
    //     new Date(lesson.realTime) > now();
    //     console.log(`${lesson.day}-${lesson.month}`);
    //     console.log("now :", now().getTime());
    //     console.log("test date :", new Date(lesson.realTime).getTime());
    //   })
    // );

    return { planningSkate, planningSurf, planningSail }
      ? { planningSkate, planningSurf, planningSail }
      : null;
  } catch (e) {
    logError(`lessons.dao - readAll : ${e.message}`);
    return null;
  }
};

const readAllAdmin = async () => {
  try {
    const planningSkate = await Lesson.find({ sportType: "planningSkate" })
      .populate("slots")
      .exec();
    const planningSurf = await Lesson.find({ sportType: "planningSurf" })
      .populate("slots")
      .exec();
    const planningSail = await Lesson.find({ sportType: "planningSail" })
      .populate("slots")
      .exec();
    return { planningSkate, planningSurf, planningSail }
      ? { planningSkate, planningSurf, planningSail }
      : null;
  } catch (e) {
    logError(`lessons.dao - readAll : ${e.message}`);
    return null;
  }
};

const create = async (
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
) => {
  try {
    const lesson = new Lesson({
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
      slots,
    });

    const createdLesson = await lesson.save();
    return createdLesson ? createdLesson : null;
  } catch (e) {
    logError(`lesson.dao - create : ${e.message}`);
    return null;
  }
};

const deleteLesson = async (idLesson) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(idLesson);
    return deletedLesson ? deletedLesson : null;
  } catch (e) {
    logError(`lesson.dao - deleteLesson : ${e.message}`);
    return null;
  }
};

const updateSlots = async (idLesson, slotsUpdate) => {
  try {
    const lesson = await Lesson.findById(idLesson);
    // const slots = lesson.slots;

    lesson.slots.push(slotsUpdate);
    const updatedLesson = await lesson.save();

    return updatedLesson ? updatedLesson : null;
  } catch (e) {
    logError(`lesson.dao - updatedLesson : ${e.message}`);
    return null;
  }
};

const removeInSlots = async (idLesson, idMember) => {
  try {
    const lesson = await Lesson.findById(idLesson);

    // TODO : A REVOIR => suppr. TOUS les invité
    // lesson.slots.pop(idMember);
    lesson.slots.remove(idMember);
    // console.log("idMember :", idMember);
    // console.log(lesson.slots.filter((user) => user.id !== idMember));
    // TODO : lesson.utils = testArr
    // console.log(testArr(lesson.slots, idMember));

    const updatedLesson = await lesson.save();

    return updatedLesson ? updatedLesson : null;
  } catch (e) {
    logError(`lesson.dao - removeLesson : ${e.message}`);
    return null;
  }
};

const checkDuplicate = async (coach, localDay, hours, minutes) => {
  try {
    const duplicate = await Lesson.findOne({ coach, localDay, hours, minutes });

    return duplicate ? duplicate : null;
  } catch (e) {
    logError(`lesson.dao - checkDuplicate : ${e.message}`);
    return null;
  }
};

export const LessonDAO = {
  readAll,
  readAllAdmin,
  create,
  deleteLesson,
  updateSlots,
  removeInSlots,
  checkDuplicate,
};
