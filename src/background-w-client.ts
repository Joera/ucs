// // to do .. move ipfs task to web worker.
// // first i need to figure out if/how npm modules are loaded for use of worker
// import createClient from 'ipfs-http-client';
// const ipfs = createClient({ url : 'http://127.0.0.1:45001/api/v0'});
// import concat  from 'it-concat';
//
//
// chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
//
//     switch (msg.type) {
//
//         case 'ipfs-content' :
//             concat(ipfs.cat('/ipfs/' + msg.data)).then( (content) => {
//                 sendResponse({complete: true, content: JSON.parse(content.toString('utf-8'))});
//             });
//             break;
//
//         // case 'ipfs-schema' :
//         //
//         //     concat(ipfs.cat('/ipfs/' + msg.data)).then( (content) => {
//         //         sendResponse({complete: true, content: JSON.parse(content.toString('utf-8'))});
//         //     });
//         //     break;
//
//         case 'add-to-ipfs' :
//
//             ipfs.add('alle kippen op een stokje').then(({ cid }) => {
//                 sendResponse({complete: true, cid: cid});
//             });
//             break;
//
//         case 'save-item' :
//             console.log(msg.data);
//             try {
//                 ipfs.add(JSON.stringify(msg.data)).then(({cid}) => {
//                     sendResponse({complete: true, cid: cid.toString()});
//                 });
//             } catch(error) {
//                 sendResponse({complete: false, error: error});
//             }
//             break;
//
//         case 'publish-to-ipfs' :
//
//             const key = '';
//            // ipns.create(privateKey, value, sequenceNumber, lifetime)
//
//             ipfs.add('alle kippen op een stokje').then(({ cid }) => {
//                 sendResponse({complete: true, cid: cid.toString()});
//             });
//             break;
//
//         default :
//             sendResponse({complete: true});
//     }
//     return true;
// });
