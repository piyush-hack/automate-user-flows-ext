import { ChromeMessage } from "../../chrome-messaging";
import { EventType, RecordableEvent } from "./recordable-event";

const specialKeys = [
    "Backspace", "Tab", "Enter", "Shift", "Control", "Alt", "Pause", "CapsLock",
    "Escape", "PageUp", "PageDown", "End", "Home", "ArrowLeft", "ArrowUp",
    "ArrowRight", "ArrowDown", "PrintScreen", "Insert", "Delete",
    "Meta", "ContextMenu", "NumLock", "ScrollLock", "AudioVolumeMute",
    "AudioVolumeDown", "AudioVolumeUp", "MediaTrackNext", "MediaTrackPrevious",
    "MediaStop", "MediaPlayPause", "LaunchMail", "LaunchMediaPlayer",
    "LaunchApplication1", "LaunchApplication2", "F1", "F2", "F3", "F4", "F5",
    "F6", "F7", "F8", "F9", "F10", "F11", "F12"
];

export class ExtKeyPressEvent extends RecordableEvent {
    constructor(private targetSelector: string, private key: string,
        timeGap: number = 0
    ) {
        super(EventType.KEY_PRESS , timeGap);
    }
    
    async execute(sendResponse: (arg: ChromeMessage) => void) {
        const elements = document.querySelectorAll(this.targetSelector);
        const element = elements.length === 1 ? elements[0] : document.activeElement;
        if (element) {
            if (specialKeys.includes(this.key)) {
                const eventKeyDown = new KeyboardEvent('keydown', { key: this.key });
                element.dispatchEvent(eventKeyDown);
                const eventKeyUp = new KeyboardEvent('keyup', { key: this.key });
                element.dispatchEvent(eventKeyUp);
            } else {
                document.execCommand('insertText', false, this.key);
            }
        }
    }


    static fromJSON(json: any) {
        return new ExtKeyPressEvent(json.targetSelector, json.key , json?.timeGap)
    }
}
