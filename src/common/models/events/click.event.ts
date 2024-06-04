import { ChromeMessage } from "../../chrome-messaging";
import { RecordableEvent, EventType } from "./recordable-event";

export class ExtMouseDownEvent extends RecordableEvent {
    constructor(public x: number, public y: number , 
        timeGap: number = 0
    ) {
        super(EventType.MOUSE_DOWN , timeGap);
    }

    execute(): void {
    }

    static fromJSON(data: any) {
        return new ExtMouseDownEvent(data.x, data.y , data?.timeGap)
    }
}

export class ExtClickEvent extends RecordableEvent {
    constructor(private down: ExtMouseDownEvent,
        private up: {
            x: number, y: number
        },
        timeGap: number = 0
    ) {
        super(EventType.CLICK , timeGap);
    }

    execute(sendResponse: (arg: ChromeMessage) => void): void {
        const downEvent = new MouseEvent('mousedown', {
            clientX: this.down.x,
            clientY: this.down.y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        const upEvent = new MouseEvent('mouseup', {
            clientX: this.up.x,
            clientY: this.up.y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        const clickEvent = new MouseEvent('click', {
            clientX: this.up.x,
            clientY: this.up.y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        const element = document.elementFromPoint(this.up.x, this.up.y);
        element?.dispatchEvent(downEvent);
        element?.dispatchEvent(upEvent);
        element?.dispatchEvent(clickEvent);
    }

    static fromJSON(json: any) {
        return new ExtClickEvent(ExtMouseDownEvent.fromJSON(json?.down), { x: json?.up?.x, y: json?.up?.y } , json?.timeGap)
    }
}