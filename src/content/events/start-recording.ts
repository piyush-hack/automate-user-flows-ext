import { AppUtils } from "../app-utils";
import { ExtensionEvent } from "./extension-event";

export class StartRecording implements ExtensionEvent {

    
    constructor() {

    }

    async init(data: any, sendResponse: (arg: any) => void) {
        alert("Started recording");
        await AppUtils.saveState(true, [], null);

        const handlers = AppUtils.getAciveEventHandlers();
        handlers.forEach((_ , i) => new handlers[i](true).listen());

        sendResponse({ status: 'Success' });
    }

}