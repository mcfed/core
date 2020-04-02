import {Injectable, Factory} from '../index';

class Api {
  fetch() {
    console.log('fetch');
  }
}
@Injectable
class Action {
  constructor(public api: Api) {}
  fetchAction() {
    this.api.fetch();
  }
}

it('create saga gen', () => {
  Factory(Action).api.fetch();
});
