import { AppUtils } from "src/content/app-utils";
import { ChromeMessage } from "../../chrome-messaging";
import { EventType, RecordableEvent } from "./recordable-event";
import { StorageKeys, Storage } from "src/common/storage/storage";

export class ExtScrollDownEvent extends RecordableEvent {
    static intialScroll = new Map<string, { scrollLeft: number, scrollTop: number }>()
    constructor(private scrollX: number, private scrollY: number,
        private elementSelector: any,
        timeGap: number = 0
    ) {
        super(EventType.SCROLL, timeGap);
    }

    async execute(sendResponse: (arg: ChromeMessage) => void) {
        if (this.elementSelector === 'document') {
            window.screenLeft
            window.scrollTo(this.scrollX, this.scrollY);
        } else {
            const reativeScroll = await Storage.getStorage(StorageKeys.RELATIVE_SCROLL)
            const element = document.querySelector(this.elementSelector);
            if (element) {
                if (reativeScroll && !ExtScrollDownEvent.intialScroll.get(this.elementSelector)) {
                    ExtScrollDownEvent.intialScroll.set(this.elementSelector, { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop });
                }
                console.log(element, reativeScroll, ExtScrollDownEvent.intialScroll, this.scrollX)
                element.scrollLeft = reativeScroll ? ExtScrollDownEvent.intialScroll.get(this.elementSelector)?.scrollLeft + this.scrollX : this.scrollX;
                element.scrollTop = reativeScroll ? ExtScrollDownEvent.intialScroll.get(this.elementSelector)?.scrollTop + this.scrollY : this.scrollY;
            }
        }
    }

    static fromJSON(json: any) {
        return new ExtScrollDownEvent(json?.scrollX, json?.scrollY, json?.elementSelector, json?.timeGap)
    }
}