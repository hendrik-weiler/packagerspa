class View {
  constructor() {
    this._template = '';
  }

  setTemplate(template) {
    this._template = template;
  }

  render() {
    return this._template;
  }
}