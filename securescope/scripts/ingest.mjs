const fs = require('fs');
const path = require('path');

async function ingest() {
    const apiKey = process.env.SENSO_API_KEY;
    if (!apiKey || apiKey === 'your_senso_api_key_here') {
        console.error('Please set a valid SENSO_API_KEY in your environment.');
        process.exit(1);
    }

    const filePath = path.join(__dirname, '../../access_control_policy.md');
    if (!fs.existsSync(filePath)) {
        console.error(`Policy file not found at: ${filePath}`);
        process.exit(1);
    }

    console.log('Ingesting policy to Senso...');

    const { FormData } = await import('formdata-node');
    const { fileFromPath } = await import('formdata-node/file-from-path');

    const formData = new FormData();
    formData.append('file', await fileFromPath(filePath, 'text/markdown'));
    formData.append('title', 'Access Control Policy');

    const response = await fetch('https://sdk.senso.ai/api/v1/content/file', {
        method: 'POST',
        headers: {
            'X-API-Key': apiKey,
        },
        body: formData,
    });

    if (response.ok) {
        console.log('Successfully ingested policy!');
        const data = await response.json();
        console.log('Content Details:', data);
    } else {
        console.error('Failed to ingest policy:', await response.text());
    }
}

ingest();
