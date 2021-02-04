// to do .. move ipfs task to web worker.
// first i need to figure out if/how npm modules are loaded for use of worker
import createClient from 'ipfs-http-client';
const ipfs = createClient({ url : 'http://127.0.0.1:45001/api/v0'});
import concat  from 'it-concat';
import ipns from 'ipns';

chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {

    switch (msg.type) {

        case 'ipfs-schema' :

            const cid = 'k51qzi5uqu5di1u6arh2e3s1p51vaul0s9gnfd8ce6gwk58035wmytj4ov1p51';
            concat(ipfs.cat('/ipns/' + cid)).then( (content) => {
                sendResponse({complete: true, content: JSON.parse(content.toString('utf-8'))});
            });
            break;

        case 'add-to-ipfs' :

            ipfs.add('alle kippen op een stokje').then(({ cid }) => {
                sendResponse({complete: true, cid: cid});
            });
            break;

        case 'publish-to-ipfs' :

            const key = '';
           // ipns.create(privateKey, value, sequenceNumber, lifetime)

            ipfs.add('alle kippen op een stokje').then(({ cid }) => {
                sendResponse({complete: true, cid: cid});
            });
            break;

        default :
            sendResponse({complete: true});
    }
    return true;
});



// const ipfsWorker = new Worker(chrome.runtime.getURL('js/worker.js'));
// ipfsWorker.postMessage('fetchCollectionSchema', msg.data);
// ipfsWorker.onmessage = (e) => {
//     console.log('Message received from worker');
//     sendResponse(e);
// }

// this needs to be here or connection is closed prematurely

//
//     return true;
// }


