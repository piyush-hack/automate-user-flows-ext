import Dexie from 'dexie';
import { Injectable } from '@angular/core';

enum CollectionNames {
    TASKS = 'tasks'
}


@Injectable()
export class IndexDBService {



    private db: Dexie | null = null;

    private static readonly VERSION_INIT = 1;
    private static readonly PRIMARY_KEY = 'pkey';

    async init() {
        if (!this.db) {
            console.log("Creating Dexie")
            this.db = new Dexie('chrome_extension');
        }
        this.db.version(IndexDBService.VERSION_INIT).stores({
            [CollectionNames.TASKS]: `${IndexDBService.PRIMARY_KEY}`
        });

        if (!this.db.isOpen()) {
            console.log(`Opening Dexie DB`);
            await this.db.open();
        }
        console.log(`Finished Initializing Dexie`);
    }

    async clear(): Promise<void> {
        if (this.db) {
            await Promise.all([
                this.db.table(CollectionNames.TASKS).clear()
            ]);
        }

    }


}
