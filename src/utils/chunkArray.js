export const chunkArray = (array, chunkSize) => {
  const numberOfChunks = Math.ceil(array.length / chunkSize);

  // create the new array of chunks
  return Array.from({ length: numberOfChunks }, (_, chunkIndex) => {
    const start = chunkIndex * chunkSize;
    const end = start + chunkSize;

    return array.slice(start, end);
  });
};
