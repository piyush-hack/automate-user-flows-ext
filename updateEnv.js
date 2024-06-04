const fs = require('fs');

const environmentPath = './src/environment.ts';
const mainfestPath = './src/manifest.json';

// Modify environment.ts
const args = process.argv.slice(2);
let prod = true;
if (args.includes('--local-build')) {
    prod = false;
}
fs.readFile(environmentPath, 'utf8', (err, data) => {
    if (err) {
        console.error('An error occurred:', err);
        return;
    }

    let result = '';
    if (!prod) {
        result = data.replace(/production = true/g, 'production = false');
    } else {
        result = data.replace(/production = false/g, 'production = true');
    }

    fs.writeFile(environmentPath, result, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('An error occurred while writing:', writeErr);
            return;
        }
        console.log('Updated production value in environment.ts');
    });
});


// Modify manifest.json
if (prod) {
    const manifestContent = JSON.parse(fs.readFileSync(mainfestPath, 'utf8'));
    if (manifestContent.version) {
        const versionParts = manifestContent.version.split('.');
        versionParts[1] = (parseInt(versionParts[1], 10) + 1).toString();
        manifestContent.version = versionParts.join('.');
        fs.writeFileSync(mainfestPath, JSON.stringify(manifestContent, null, 2));
    }
    console.log('Updated mainfest version!', manifestContent?.version || '');
}
