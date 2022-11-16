import axios from 'axios';

const API_KEY = '31368973-87e43af5b1d90bbdb56f4ead8';
const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
});

export async function fetchQuery(query) {
  const options = {
    params: {
      key: API_KEY,
      q: query,
      lang: 'en',
      orientation: 'horizontal',
    },
  };

  const result = await instance.get('', options);

  return await result.data;
}
