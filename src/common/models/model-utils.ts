import { RecordableEventsUtils } from "./events";
import { Model, ModelType } from "./model-type";

export class ModelUtils {

    public static fromJSON(data: any): Model | null {
        let result: Model | null = null;
        if (data) {
            if (Array.isArray(data)) {
                result = ModelUtils.handleDataArray(data, result);
            } else if (typeof data === 'object') {
                result = ModelUtils.handleDataObject(data, result);
            } else {
                result = data
            }
        } else {
            result = data;
        }
        return result;
    }

    private static handleDataObject(data: any, result: Model | null) {
        if (data) {
            if (data.modelType) {
                switch (data.modelType) {
                    case ModelType.RECORDABLE_EVENT: {
                        result = RecordableEventsUtils.fromJSON(data)
                        break;
                    }
                }
            } else {
                result = data;
            }
        }
        return result;
    }

    private static handleDataArray(data: any, result: Model | null) {
        if (data && data.length) {
            result = data.map((item: any) => ModelUtils.fromJSON(item))
        }
        return result;
    }
}