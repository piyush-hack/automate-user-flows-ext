import { MessageSubject } from "../common/chrome-messaging";


let heartbeatInterval;

async function runHeartbeat() {
    // console.log(HeartBeat);
    await chrome.storage.local.set({ 'last-heartbeat': new Date().getTime() });
}

/**
 * Starts the heartbeat interval which keeps the service worker alive. Call
 * this sparingly when you are doing work which requires persistence, and call
 * stopHeartbeat once that work is complete.
 */
async function startHeartbeat() {
    // Run the heartbeat once at service worker startup.
    runHeartbeat().then(() => {
        // Then again every 20 seconds.
        heartbeatInterval = setInterval(runHeartbeat, 20 * 1000);
    });
}


startHeartbeat();


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
