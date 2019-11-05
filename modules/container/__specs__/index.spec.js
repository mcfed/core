class saga {
  fetch(action) {}
}

function createSaga(saga) {
  console.log(saga.prototype);
  for (s in saga.prototype) {
    console.log('');
    console.log(saga[s]);
  }
}

describe('Container unit test', () => {
  it('create saga gen', () => {
    createSaga(saga);
  });
});
