import axios from 'axios';

const API_KEY = '31368973-87e43af5b1d90bbdb56f4ead8';
const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: API_KEY,
    image_type: 'photo',
    safesearch: true,
    orientation: 'horizontal',
    per_page: 20,
  },
});

export async function fetchQuery(query, page) {
  const options = {
    params: {
      q: query,
      page,
    },
  };

  const result = await instance.get('', options);

  return await result.data;
}
