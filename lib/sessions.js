class Sessions {
  constructor() {
    this.data = {};
    this.lastId = 0;
  }

  setCookie(name) {
    this.lastId++;
    this.data[this.lastId] = name;
    return this.lastId;
  }

  getName(id) {
    return this.data[id];
  }
}

module.exports = { Sessions };
