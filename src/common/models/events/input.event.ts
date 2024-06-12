import { ChromeMessage } from "../../chrome-messaging";
import { EventType, RecordableEvent } from "./recordable-event";

export class ExtInputEvent extends RecordableEvent {
    constructor(private value: string, private elementSelector: any,
        timeGap: number = 0
    ) {
        super(EventType.INPUT , timeGap);
    }
    async execute(sendResponse: (arg: ChromeMessage) => void) {
        const elements = document.querySelectorAll(this.elementSelector);
        const element = elements.length === 1 ? elements[0] : document.activeElement;
        if (!element.isContentEditable) {
            element.value = this.value;
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
        } else {
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
            for (const key of this.value) {
                const eventKeyDown = new KeyboardEvent('keydown', { key });
                element.dispatchEvent(eventKeyDown);
                const eventKeyUp = new KeyboardEvent('keyup', { key });
                element.dispatchEvent(eventKeyUp);
            }
            element.innerHTML = this.value;
        }
    }

    static fromJSON(json: any) {
        return new ExtInputEvent(json?.value, json?.elementSelector , json?.timeGap)
    }
}