class Sessions {
  constructor() {
    this.data = {};
    this.lastId = 0;
  }

  setSession(name) {
    this.lastId++;
    this.data[this.lastId] = name;
    return this.lastId;
  }

  getSession(id) {
    return this.data[id];
  }

  deleteSession(id) {
    return delete this.data[id];
  }
}

module.exports = { Sessions };
