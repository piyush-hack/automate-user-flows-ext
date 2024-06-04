import { ExtClickEvent, ExtMouseDownEvent } from "./click.event";
import { ExtCustomEvent } from "./custom.event";
import { ExtInputEvent } from "./input.event";
import { ExtKeyPressEvent } from "./key-press.event";
import { EventType } from "./recordable-event";
import { ExtScrollDownEvent } from "./scroll.event";

const eventTypeClasses: Record<EventType, any> = {
    [EventType.CLICK]: ExtClickEvent,
    [EventType.SCROLL]: ExtScrollDownEvent,
    [EventType.KEY_PRESS]: ExtKeyPressEvent,
    [EventType.INPUT]: ExtInputEvent,
    [EventType.CUSTOM]: ExtCustomEvent,
    [EventType.MOUSE_DOWN]: ExtMouseDownEvent
}


export class RecordableEventsUtils {
    static fromJSON(json: any) {
        return eventTypeClasses[json.type as EventType].fromJSON(json);
    }
}