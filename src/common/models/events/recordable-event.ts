import { ChromeMessage } from "../../chrome-messaging";
import { Model, ModelType } from "../model-type";

export enum EventType {
    MOUSE_DOWN = 'MOUSEDOWN',
    CLICK = "CLICK",
    SCROLL = "SCROLL",
    KEY_PRESS = "KEY_PRESS",
    INPUT = "INPUT",
    CUSTOM = "CUSTOM"
}

export abstract class RecordableEvent extends Model {
    constructor(protected type: EventType, protected timeGap: number) {
        super(ModelType.RECORDABLE_EVENT);
    }

    abstract execute(sendResponse: (arg: ChromeMessage) => void): void;
}
export abstract class RecordableEventHandler {
    abstract listen(): void
    abstract remove(): void
}