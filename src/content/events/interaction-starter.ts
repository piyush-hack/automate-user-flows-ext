import { ExtScrollDownEvent } from "src/common";
import { ExtensionEvent } from "./extension-event";

export class InteractionStarter implements ExtensionEvent {

    async init(data: any, sendResponse: (arg: any) => void) {
        ExtScrollDownEvent.intialScroll.clear()
        sendResponse({ status: "Success" })
    }

}