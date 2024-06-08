import { ChromeMessage, MessageSubject } from "../common/chrome-messaging";
import { ModelUtils } from "../common/models/model-utils";
import { StartRecording } from "./events";
import { ExtensionEvent } from "./events/extension-event";
import { PerformInteractions } from "./events/perform-interactions";
import { ElementRecorder } from "./events/element-recorder";
import { StopRecording } from "./events/stop-recording";
import { InteractionStarter } from "./events/interaction-starter";
import { CONTENT_CSS } from "./content.css";

export class Content {

    events = new Map<MessageSubject, ExtensionEvent>();

    private constructor() {
        this.events.set(MessageSubject.START_INTERACTION_PERFORMING, new InteractionStarter());
        this.events.set(MessageSubject.START_RECORDING, new StartRecording());
        this.events.set(MessageSubject.STOP_RECORDING, new StopRecording());
        this.events.set(MessageSubject.PLAY_INTERACTION, new PerformInteractions());
        this.events.set(MessageSubject.EXTARCT_ELEMENT, new ElementRecorder(true));
        this.events.set(MessageSubject.STOP_ELEMENT_EXTRACTION, new ElementRecorder(false));
        this.injectCSS();
        chrome.runtime.onMessage.addListener(this.msgListener.bind(this));
    }

    static async construct() {
        const content = new Content();
        return content;
    }

    private msgListener(message: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
        this.events.get(message.subject)?.init(ModelUtils.fromJSON(message.data), sendResponse.bind(this))
        return true;
    }

    
    private injectCSS() {
        let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.appendChild(document.createTextNode(CONTENT_CSS));
        (document.head || document.documentElement).appendChild(styleElement);
    }

}

Content.construct();