import { MessageSubject } from "../common/chrome-messaging";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === MessageSubject.START_RECORDING) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            chrome.storage.local.set({ result: [] });
            chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
        });
    } else if (request.action === MessageSubject.STOP_RECORDING) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            chrome.tabs.sendMessage(tabs[0].id, request, sendResponse);
        });
    } else if (request.action === MessageSubject.PLAY_INTERACTION) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            if (tabs.length === 0) {
                sendResponse({ status: 'No active tab found' });
            }
            chrome.tabs.sendMessage(tabs[0].id, { action: MessageSubject.PLAY_INTERACTION, interaction: request.interaction }, (response) => {
                sendResponse({ status: response.status, response: response.result });
            });
        });
    }
});
