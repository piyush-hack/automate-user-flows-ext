import { ExtensionEvent } from "./extension-event";
import { CustomEventHandler } from "./recordable-events/custom.handler";


export class ElementRecorder implements ExtensionEvent {
    constructor(private listen: boolean) {
    }

    async init(data: any, sendResponse: (arg: any) => void) {
        const handlers = [CustomEventHandler];
        if (this.listen) {
            handlers.forEach((_, i) => new handlers[i]().listen());
        } else {
            handlers.forEach((_, i) => new handlers[i]().remove());
        }
        sendResponse({ status: 'Success' });
    }

}