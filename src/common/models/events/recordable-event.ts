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
    constructor(public type: EventType, public timeGap: number) {
        super(ModelType.RECORDABLE_EVENT);
    }

    abstract execute(sendResponse: (arg: ChromeMessage) => void): Promise<void>;
}
export abstract class RecordableEventHandler {
    abstract listen(): void
    abstract remove(): void
}