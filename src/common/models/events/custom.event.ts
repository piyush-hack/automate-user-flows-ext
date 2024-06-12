import { ChromeMessage, MessageSource, MessageSubject } from "../../chrome-messaging";
import { Storage, StorageKeys } from "../../storage/storage";
import { EventType, RecordableEvent } from "./recordable-event";

export class ExtCustomEvent extends RecordableEvent {
    constructor(private selector: any, private need: any, private value: any,
        timeGap: number = 0
    ) {
        super(EventType.CUSTOM, timeGap)
    }

    async execute(sendResponse: (arg: ChromeMessage) => void) {
        try {
            const response = this.extractOrTriggerEvent(this.selector, this.need, this.value);
            if (response) {

                const calcData = await Storage.getStorage(StorageKeys.CALC_DATA);
                const value = (calcData && Array.isArray(calcData)) ? calcData : [];
                value?.push(response);
                await Storage.setStorage(StorageKeys.CALC_DATA , value);
            }
            sendResponse(new ChromeMessage(MessageSource.CONTENT, MessageSubject.SUCCESS, null));
        } catch (error: any) {
            throw new Error(error);
        }
    }


    static fromJSON(json: any) {
        return new ExtCustomEvent(json?.selector, json?.need, json?.value, json?.timeGap)
    }


    /**
     * Function to extract specific information from elements selected by a CSS selector or perform events on them.
     * @param {string} selector - The CSS selector for the elements to be selected.
     * @param {string} need - The specific need, such as 'text', an attribute name like 'href', or event name like 'click'.
     * @param {any} [value] - Optional value for events like 'input'.
     * @returns {Array} - An array of extracted values from the selected elements if applicable.
     */
    private extractOrTriggerEvent(selector: any, need: any, value: any) {
        const elements = document.querySelectorAll(selector);
        const results: any[] = [];

        elements.forEach(element => {
            switch (need.toLowerCase()) {
                case 'text':
                    results.push(element.textContent);
                    break;
                case 'html':
                    results.push(element.innerHTML);
                    break;
                case 'value':
                    results.push(element.value);
                    break;
                case 'click':
                    element.click();
                    break;
                case 'mouseup':
                    element.dispatchEvent(new MouseEvent('mouseup'));
                    break;
                case 'input':
                    if (value !== undefined) {
                        element.value = value;
                        element.dispatchEvent(new Event('input'));
                    }
                    break;
                case 'change':
                    if (value !== undefined) {
                        element.value = value;
                        element.dispatchEvent(new Event('change'));
                    }
                    break;
                case 'keydown':
                    element.dispatchEvent(new KeyboardEvent('keydown', { key: value }));
                    break;
                case 'keyup':
                    element.dispatchEvent(new KeyboardEvent('keyup', { key: value }));
                    break;
                case 'mouseover':
                    element.dispatchEvent(new MouseEvent('mouseover'));
                    break;
                case 'mouseout':
                    element.dispatchEvent(new MouseEvent('mouseout'));
                    break;
                case 'mouseenter':
                    element.dispatchEvent(new MouseEvent('mouseenter'));
                    break;
                case 'mouseleave':
                    element.dispatchEvent(new MouseEvent('mouseleave'));
                    break;
                default:
                    // Assume 'need' is an attribute if it's not a common property or event
                    results.push(element.getAttribute(need));
                    break;
            }
        });

        // Only return results if we're not performing an event
        if (!['click', 'mouseup', 'input', 'change', 'keydown', 'keyup', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'].includes(need.toLowerCase())) {
            return results;
        }
        return [];
    }

}