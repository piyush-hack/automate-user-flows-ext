import { ChromeMessage } from "../../chrome-messaging";
import { EventType, RecordableEvent } from "./recordable-event";

export class ExtScrollDownEvent extends RecordableEvent {
    constructor(private scrollX: number, private scrollY: number,
        private elementSelector: any,
        timeGap : number = 0
    ) {
        super(EventType.SCROLL , timeGap);
    }

    execute(sendResponse: (arg: ChromeMessage) => void): void {
        if (this.elementSelector === 'document') {
            window.scrollTo(this.scrollX, this.scrollY);
        } else {
            const element = document.querySelector(this.elementSelector);
            if (element) {
                element.scrollLeft = this.scrollX;
                element.scrollTop = this.scrollY;
            }
        }
    }

    static fromJSON(json: any) {
        return new ExtScrollDownEvent(json?.scrollX, json?.scrollY , json?.elementSelector , json?.timeGap)
    }
}