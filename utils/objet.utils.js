export const omit = (obj, key) => {
  const { [key]: ommitedKeyValue, ...otherValues } = obj;
  return otherValues;
};

export const omitMulti = (obj, keys) => {
  const otherValues = keys.reduce(
    (toBuild, key) => {
      const o = omit(toBuild, key);
      return { ...o }; // toBuild = {o} soit => {email, id}  (au premier tour)
    },
    { ...obj }
  );

  return otherValues;
};

// export const omitMulti_opti = (obj, keys) =>
//   keys.reduce((toBuild, key) => ({ ...omit(toBuild, key) }), { ...obj });
