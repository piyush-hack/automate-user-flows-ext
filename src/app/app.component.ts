import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ChromeMessage, ChromeMessaging, MessageSource, MessageSubject } from '../common/chrome-messaging';
import { Storage, StorageKeys } from '../common/storage/storage'
export enum Tabs {
  RECORD = 'RECORD',
  PLAY = 'PLAY'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {


  title = 'chrome-extension';
  manifest: chrome.runtime.Manifest = chrome.runtime?.getManifest();
  playCount: number = 1;
  playDelay: number = 1000;
  isRecording: boolean = false;
  interactions: any[] = [];
  isPlaying: any;
  currentStep: number = 0;
  progress: string = '';
  activeTab: Tabs = Tabs.RECORD;
  tabs = Tabs
  relativeScroll: boolean = false;

  constructor(
  ) {
    this.initConstructor();
  }
  private async initConstructor() {
  }


  ngAfterViewChecked(): void {
  }

  async ngOnInit(): Promise<void> {
    await this.init();
    this.listenContent();

  }

  private async init() {
    await this.loadState();

    document.getElementById('importFile')?.addEventListener('change', (event) => {
      const file = (event?.target as any)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.interactions = JSON.parse(e?.target?.result as any);
          this.progress = 'Recording imported.';
          this.saveState();
        };
        reader.readAsText(file);
      }
    });
  }

  private listenContent() {
    chrome.runtime?.onMessage.addListener(this.msgListener.bind(this))
  }

  private msgListener(msg: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    switch (msg.subject) {
      case MessageSubject.STOP_RECORDING: {
        this.interactions = msg.data.interactions;
        sendResponse(new ChromeMessage(MessageSource.POPUP, MessageSubject.SUCCESS, null));
        this.saveState();
        break;
      }
    }
    return true;
  }

  async exportResult() {
    const calcData = await Storage.getStorage(StorageKeys.CALC_DATA);
    const blob = new Blob([JSON.stringify(calcData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'result.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importRecording() {
    document.getElementById('importFile')?.click();
  }

  exportRecording() {
    const blob = new Blob([JSON.stringify(this.interactions)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async startRecording() {
    console.log("startRecording");
    await ChromeMessaging.sendMsgToActiveTab(new ChromeMessage(MessageSource.POPUP, MessageSubject.START_RECORDING, null));
    console.log("started")
    this.isRecording = true;
    this.saveState();
  }

  async stopRecording() {
    console.log("stopRecording");
    const response = await ChromeMessaging.sendMsgToActiveTab(new ChromeMessage(MessageSource.POPUP, MessageSubject.STOP_RECORDING, null));
    this.interactions = response.data;
    this.isPlaying = false;
    this.isRecording = false;
    await this.saveState()
  }

  async playRecording() {
    await Storage.setStorage(StorageKeys.CALC_DATA, [])
    this.currentStep = 0;
    await this.startPlayback(this.playCount, this.playDelay);
    await this.saveState()
  }

  async fileChange(event: any) {
    console.log(event);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.interactions = JSON.parse(e.target.result as any);
        this.progress = 'Recording imported.';
        this.saveState();
      };
      reader.readAsText(file);
    }
  }

  async startPlayback(playCount = 1, playDelay = 0) {
    this.isPlaying = true;
    console.log("play interactions", this.interactions)

    for (let currentPlayCount = 0; currentPlayCount < playCount; currentPlayCount++) {
      await ChromeMessaging.sendMsgToActiveTab(new ChromeMessage(MessageSource.POPUP, MessageSubject.START_INTERACTION_PERFORMING, null));

      for (const interaction of this.interactions) {
        try {
          await new Promise((resolve) => setTimeout(resolve, interaction.timeGap));
          const response = await ChromeMessaging.sendMsgToActiveTab(new ChromeMessage(MessageSource.POPUP, MessageSubject.PLAY_INTERACTION, interaction))
          console.log(response);
          this.progress = `Step ${this.currentStep + 1}: ${response?.status}`;
        } catch (error) {
          console.log(error);
        }
        this.currentStep++;
        console.log("info", this.isPlaying, this.currentStep, playCount);
        if (!this.isPlaying) {
          break;
        }
      }
      if (currentPlayCount < playCount) {
        await new Promise((resolve) => setTimeout(resolve, playDelay));
      }
      if (!this.isPlaying) {
        break;
      }
    }
    if (!this.isPlaying) {
      this.progress = 'Playback stopped';
    } else {
      this.progress = 'Playback completed.';
    }
    this.isPlaying = false;
  }

  async stopRecordingPlay() {
    this.isPlaying = false;
    this.currentStep = 0;
    await this.saveState()
  }

  async toggleRelativeScroll() {
    this.relativeScroll = !this.relativeScroll
    await this.saveState();
  }

  async selectElement() {
    await ChromeMessaging.sendMsgToActiveTab(new ChromeMessage(MessageSource.POPUP, MessageSubject.EXTARCT_ELEMENT, null))
  }

  async stopElementSelection() {
    await ChromeMessaging.sendMsgToActiveTab(new ChromeMessage(MessageSource.POPUP, MessageSubject.STOP_ELEMENT_EXTRACTION, null))
  }

  async saveState() {
    console.log("this.relativeScroll", this.relativeScroll)
    await Storage.setStorage(StorageKeys.INTERACTIONS, this.interactions);
    await Storage.setStorage(StorageKeys.IS_RECORDING, this.isRecording);
    await Storage.setStorage(StorageKeys.IS_PLAYING, this.isPlaying);
    await Storage.setStorage(StorageKeys.RELATIVE_SCROLL, this.relativeScroll);
  }

  async loadState() {
    this.interactions = await Storage.getStorage(StorageKeys.INTERACTIONS);
    this.isRecording = await Storage.getStorage(StorageKeys.IS_RECORDING);
    this.isPlaying = await Storage.getStorage(StorageKeys.IS_PLAYING);
    this.relativeScroll = await Storage.getStorage(StorageKeys.RELATIVE_SCROLL)
  }

  clear() {
    Storage.clear();
  }
}
