import { Errors } from "./models/erros";
import { Model, ModelType } from "./models/model-type";
import { ModelUtils } from "./models/model-utils";

export class ChromeMessaging {

    static sendMsgToExtension(msg: ChromeMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(msg, (response) => {
                    resolve(response);
                })
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }


    static getActiveTab(): Promise<number | undefined> {
        return new Promise((resolve => {
            chrome.tabs?.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                resolve(tabs[0].id);
            });
        }));
    }

    static sendMsgToActiveTab(msg: ChromeMessage) {
        return this.getActiveTab()
            .then(tabid => this.sendMessageToTab(msg, tabid));
    }

    static sendMessageToTab(msg: ChromeMessage, tabid: number | undefined): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            console.log("tabid", tabid);
            if (tabid != undefined && tabid >= 0) {
                chrome.tabs.sendMessage(
                    tabid || 0, msg, function (data: any) {
                        if (chrome.runtime.lastError) {
                            console.log("chrome.runtime.lastError", chrome.runtime.lastError);
                            reject(chrome.runtime.lastError);
                        }
                        try {
                            if (data) {
                                const response = ModelUtils.fromJSON(data);
                                console.log(response);
                                resolve(response);
                            } else {
                                reject(Errors.NO_RESPONSE);
                            }
                        } catch (error) {
                            console.log("error in send message to tab", error)
                        }
                    });
            }
        });
    }
}


export enum MessageSource {
    CONTENT = 'CONTENT',
    POPUP = 'POPUP',
    BACKGROUND_JS = "BACKGROUND_JS"
}

export enum MessageSubject {
    GET_CURRENT_URL = 'GET_CURRENT_URL',
    START_RECORDING = "START_RECORDING",
    STOP_RECORDING = "STOP_RECORDING",
    SUCCESS = "SUCCESS",
    PLAY_INTERACTION = "PLAY_INTERACTION",
    EXTARCT_ELEMENT = "EXTARCT_ELEMENT",
    STOP_ELEMENT_EXTRACTION = "STOP_ELEMENT_EXTRACTION",
    START_INTERACTION_PERFORMING = "START_INTERACTION_PERFORMING"
}

export class ChromeMessage extends Model {

    from: MessageSource;
    subject: MessageSubject;
    data: any;
    constructor(source: MessageSource, subject: MessageSubject, data: any) {
        super(ModelType.CHROME_MESSAGE)
        this.from = source;
        this.subject = subject;
        this.data = data;
    }

    static fromJSON(json: any) {
        return new ChromeMessage(json.source, json.subject, ModelUtils.fromJSON(json.data))
    }

}

