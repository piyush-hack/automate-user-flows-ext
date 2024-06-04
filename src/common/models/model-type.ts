export enum ModelType {
    CONTACT = 'CONTACT',
    RECORDABLE_EVENT = "RECORDABLE_EVENT",
    CHROME_MESSAGE = "CHROME_MESSAGE",
}

export abstract class Model {
    modelType: ModelType;
    constructor(modelType: ModelType) {
        this.modelType = modelType;
    }
}