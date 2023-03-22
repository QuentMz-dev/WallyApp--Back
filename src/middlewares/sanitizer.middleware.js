import escape from "validator/lib/escape.js";
import { log } from "../utils/logger.utils.js";
import { isString } from "../utils/string.utils.js";

const sanitize = (obj) => {
  const keys = Object.keys(obj);

  const sanitized = keys.reduce((toBuild, key) => {
    const value = obj[key];
    const escaped = isString(value) ? escape(value) : value;
    return { ...toBuild, [key]: escaped };
  }, {});

  return { ...sanitized };
};

export const sanitizerMiddleware = (req, res, next) => {
  req.body = sanitize(req.body);
  req.param = sanitize(req.param);
  next();
};

// export const sainitizerMiddleware_opti = (req, res, next) => {
//   const keys = Object.keys(req.body);

//   const sanitizedBody = keys.reduce(
//     (tb, k) => ({
//       ...tb,
//       [k]: isString(req.body[k]) ? escape(req.body[k]) : req.body[k],
//     }),
//     {}
//   );

//   req.body = { ...sanitizedBody };

//   next();
// };

// const sainitizerMiddleware_alt2 = (req, res, next) => {
//   const keys = Object.keys(req.body);

//   const sanitizedBody = {};

//   keys.forEach((key) => {
//     const value = req.body[key];

//     sanitizedBody[key] = isString(value) ? escape(value) : value;
//   });

//   req.body = { ...sanitizedBody };

//   next();
// };

// const sainitizerMiddleware_alt = (req, res, next) => {
//   const keys = Object.keys(req.body);

//   const email = req.body["email"];

//   for (let i = 0; i < keys.length; i++) {
//     const key = keys[i];

//     console.log(key);
//     console.log(req.body[key]);
//   }

//   next();
// };
