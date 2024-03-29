export const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

export const convertEpochToDate = epoch =>
    new Date(epoch * 1000).toString();