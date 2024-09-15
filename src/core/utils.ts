export const delay = (milliseconds: number) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(true), milliseconds);
    } catch (err) {
      reject("An error occurred in the delay function");
    }
  });
};
