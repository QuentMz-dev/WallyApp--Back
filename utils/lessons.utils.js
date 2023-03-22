import { now } from "mongoose";

export const formatLesson = (lesson) => {
  return { id: user._id, lesson };
};

export const formatLessons = (lessons) => {
  return lessons.map(formatLesson);
};

export const compareTime = (planning) => {
  return planning.filter(
    (lesson) => new Date(lesson.realTime).getTime() > now().getTime()
  );
};
