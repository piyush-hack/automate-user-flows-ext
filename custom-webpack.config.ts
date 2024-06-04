import type { Configuration } from 'webpack';

module.exports = {
    entry: {
        content: { import: 'src/content/content.ts', runtime: false },
        'service-worker': { import: 'src/background/service-worker.ts', runtime: false }
    }
} as Configuration;