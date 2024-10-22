import { AttributeRepository } from "../repositories/AttributeRepository.js";
import { Attributes } from "../models/Attributes.js";

class AttributeService {
  constructor() {
    this.attributeRepository = new AttributeRepository();
  }

  async create(attribute) {
    const newAttribute = new Attributes(attribute.groupName, attribute.options);
    return this.attributeRepository.create(newAttribute);
  }
}

export { AttributeService };