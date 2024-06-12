import { ExtensionEvent } from "./extension-event";
import { CustomEventHandler } from "./recordable-events/custom.handler";


export class ElementRecorder implements ExtensionEvent {
    constructor(private listen: boolean) {
    }

    async init(data: any, sendResponse: (arg: any) => void) {
        const handlers = [CustomEventHandler];
        if (this.listen) {
            await (new CustomEventHandler()).listen();
        } else {
            (new CustomEventHandler()).remove();
        }
        sendResponse({ status: 'Success' });
    }

}