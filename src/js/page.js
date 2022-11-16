import { fetchQuery } from './fetchSearch';

export class Page {
  #page = 1;
  #query = '';

  search(query) {
    this.#query = query;
    this.#page = 1;

    return fetchQuery(query, this.#page);
  }

  loadMore() {
    this.#page += 1;

    return fetchQuery(this.#query, this.#page);
  }
}
