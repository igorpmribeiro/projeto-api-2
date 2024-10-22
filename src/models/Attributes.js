class Attributes {
  constructor(groupName, options) {
    this.groupName = groupName;
    this.options = options.map(option => {
      if (typeof option === 'object' && !Array.isArray(option)) {
        return { ...option };
      }
      return option;
    });
  }
}

export { Attributes };