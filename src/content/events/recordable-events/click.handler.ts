import { ExtClickEvent, ExtCustomEvent, ExtMouseDownEvent, RecordableEventHandler } from "../../../common";
import { AppUtils } from "../../app-utils";


export class ClickEventHandler extends RecordableEventHandler {

    static mouseDownEvent: ExtMouseDownEvent | null = null

    constructor(private isRecording: boolean) {
        super()
        console.log(isRecording , this.isRecording);
    }

    listen() {
        document.addEventListener('mousedown', this.recordMouseDown.bind(this));
        document.addEventListener('mouseup', this.recordMouseUp.bind(this));
    }


    remove() {
        document.removeEventListener('mousedown', this.recordMouseDown.bind(this));
        document.removeEventListener('mouseup', this.recordMouseUp.bind(this));
    }



    private async recordMouseDown(event: any) {
        console.log("this.isRecording" , this.isRecording);
        if (!this.isRecording) return;
        ClickEventHandler.mouseDownEvent = new ExtMouseDownEvent(event.clientX, event.clientY);
    }

    private async recordMouseUp(event: any) {
        console.log("this.recordMouseUp" , ClickEventHandler.mouseDownEvent);
        if (!this.isRecording) return;

        const interaction = new ExtClickEvent(ClickEventHandler.mouseDownEvent, {
            x: event.clientX,
            y: event.clientY
        })
        await AppUtils.saveInteraction(interaction);
        ClickEventHandler.mouseDownEvent = null;
    }
}