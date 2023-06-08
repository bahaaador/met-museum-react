// for more flexibility and better browser support, replace fetch API with a library such as Axios

const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

export const fetchMetCollection = async (keyword, signal) => {
  const response = await fetch(
    `${BASE_URL}/search?hasImages=true&q=${keyword}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchItemDetails = async (id, signal) => {
  var response = await fetch(
    `${BASE_URL}/objects/${id}`,
    { cache: "force-cache", signal } // using "force-cache" is a quick and inexpensive way to force browser to cache these subsequent calls since these will most likely be static result
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
