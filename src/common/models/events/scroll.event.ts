import { AppUtils } from "src/content/app-utils";
import { ChromeMessage } from "../../chrome-messaging";
import { EventType, RecordableEvent } from "./recordable-event";
import { StorageKeys, Storage } from "src/common/storage/storage";

export class ExtScrollDownEvent extends RecordableEvent {
    static intialScroll = new Map<string, { scrollLeft: number, scrollTop: number }>();

    constructor(
        public scrollX: number,
        public scrollY: number,
        private elementSelector: any,
        timeGap: number = 0
    ) {
        super(EventType.SCROLL, timeGap);
    }

    async execute(sendResponse: (arg: ChromeMessage) => void) {
        const reativeScroll = await Storage.getStorage(StorageKeys.RELATIVE_SCROLL);
        if (this.elementSelector === 'document') {
            this.handleScroll(window, reativeScroll);
        } else {
            const element = document.querySelector(this.elementSelector);
            if (element) {
                this.handleScroll(element, reativeScroll);
            }
        }
    }

    private handleScroll(element: Window | Element, reativeScroll: boolean) {
        const selector = this.elementSelector === 'document' ? 'document' : this.elementSelector;
        if (reativeScroll && !ExtScrollDownEvent.intialScroll.has(selector)) {
            if (element instanceof Window) {
                ExtScrollDownEvent.intialScroll.set(selector, { scrollLeft: window.scrollX, scrollTop: window.scrollY });
            } else {
                ExtScrollDownEvent.intialScroll.set(selector, { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop });
            }
        }

        const initialScroll = ExtScrollDownEvent.intialScroll.get(selector) || { scrollLeft: 0, scrollTop: 0 };
        const scrollLeft = reativeScroll ? initialScroll.scrollLeft + this.scrollX : this.scrollX;
        const scrollTop = reativeScroll ? initialScroll.scrollTop + this.scrollY : this.scrollY;

        if (element instanceof Window) {
            window.scrollTo(scrollLeft, scrollTop);
        } else {
            element.scrollLeft = scrollLeft;
            element.scrollTop = scrollTop;
        }
    }

    static fromJSON(json: any) {
        return new ExtScrollDownEvent(json?.scrollX, json?.scrollY, json?.elementSelector, json?.timeGap);
    }
}
