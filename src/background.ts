import concat from "it-concat";

import DidService from './didService';
import IpfsService from "./ipfsService";
import AuthorService from "./authorService";
const didService = new DidService();
const ipfsService = new IpfsService(didService);
import SeedService from "./seedService";
import Storage from "./storageService";
const seedService = new SeedService();
const authorService = new AuthorService(ipfsService,didService);
const store = new Storage();

class Listeners {

    didService;
    ipfsService;

    constructor() {

    }
    init() {

        let self = this;
        let o = {};

        chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {

            switch (msg.type) {

                case 'did-get':
                    didService.getDID().then( (res) => {
                        console.log(res);
                        sendResponse({complete: true, content : res});
                    })
                    break;

                case 'ipfs-connect':
                    ipfsService.connect().then( (res) => {
                        sendResponse({complete: true , content: {}});
                    });
                    break;

                case 'add-metadata':
                    ipfsService.addDIDmetdata(msg.data).then( (res) => {
                        console.log(res);
                        sendResponse({complete: true , content: { rootCid : res.rootCid}});
                    });
                    break;

                case 'did-metadata':
                    ipfsService.addEncryptedObject(msg.data, msg.dids).then( (res) => {
                        sendResponse({complete: true , cid: res.cid, itemList: msg.data});
                    });
                    break;

                case 'ipfs-write-encrypted':
                    ipfsService.addEncryptedObject(msg.data, msg.dids).then( (res) => {
                        sendResponse({complete: true , cid: res.cid, itemList: msg.data});
                    });
                    break;

                case 'ipfs-read-encrypted':
                    ipfsService.ipfs.dag.get(msg.cid).then((content) => {
                        didService.did.decryptDagJWE(content.value).then( (cleartext) => {
                            // console.log(cleartext);
                            sendResponse({complete: true, list: cleartext});
                        });
                    });
                    break;

                case 'idx-read':
                        // didService.idx.get(msg.alias).then( (data) => {
                        //     sendResponse({complete: true, content: data });
                        // })
                    break;

                case 'idx-write':

                    // o[msg.key] = msg.value;
                    // console.log(o);
                    // didService.idx.set(msg.alias,o).then( (res) => {
                    //     console.log(res);
                    //     sendResponse({complete: true, content : res});
                    // })
                    break;


                // case 'idx-get-did':
                //     sendResponse({complete: true, content: didService.did._id });
                //     break;

                // case 'ipfs-content':
                //
                //     ipfsService.ipfs.object.get(msg.data).then((content: any) => {
                //         // content.Data is uint8array .. hoe maak ik daar een string van?>
                //         let string = seedService.toHexString(content.Data);
                //         console.log(string);
                //         sendResponse({complete: true, content: string});
                //     });
                //     break;

                case 'ipfs-JWE-get':

                    console.log(msg.data);
                    ipfsService.ipfs.dag.get(msg.data).then((content) => {
                        console.log(content);
                        didService.did.decryptDagJWE(content.value).then( (cleartext) => {
                            console.log(cleartext);
                            sendResponse({complete: true, content: cleartext});
                        });
                    });
                    break;

                case 'ipfs-JWS-get':

                    ipfsService.getSignedObject(msg.data).then((content) => {
                            sendResponse({complete: true, content: content});
                    });
                    break;

                case 'save-item':
                    try {
                        ipfsService.ipfs.add(JSON.stringify(msg.data)).then(({cid}) => {
                            sendResponse({complete: true, cid: cid.toString()});
                        });
                    } catch (error) {
                        sendResponse({complete: false, error: error});
                    }
                    break;

                case 'sign-and-store':
                    try {
                        ipfsService.addSignedObject(msg.data).then( (res: any) => {
                            sendResponse({complete: true, cid: res.jwsCid});
                        });
                    } catch (error) {
                        sendResponse({complete: false, error: error});
                    }
                    break;

                case 'encrypt-and-store':
                    try {
                        ipfsService.addEncryptedObject(msg.data, msg.dids).then( (res) => {
                            sendResponse({cid: res.cid, dids: res.dids});
                        });
                    } catch (error) {
                        sendResponse({complete: false, error: error});
                    }
                    break;

                case 'content-changed':

                    try {

                        if (msg.method === 'sign-and-store') {


                        } else if (msg.method === 'encrypt-and-store') {

                            ipfsService.addEncryptedObject(msg.data,[didService.did._id]).then( (res) => {
                                console.log(res);
                                self.saveToLocalStorage(msg.data.prev,msg.data.name,res.cid, res.dids);
                                // save to authorList

                                sendResponse({complete: true});
                            });

                        }
                    } catch (error) {
                        sendResponse({complete: false, error: error});
                    }
                    break;

                default :

                    sendResponse({complete: false, error: 'wrong msg type'});
            }
            return true;
        });
    }

    async saveToLocalStorage(prevCid,name,cid,owners) {

        let myFiles = await store.get('ucs_editable');
        let array: any = (Array.isArray(myFiles)) ? myFiles : [];

        array.push({
            name : name,
            cid : cid,
            owners : owners
        });

        let prevItemIndex = array.indexOf(array.find( (i) => i.cid === prevCid));

        console.log(prevItemIndex);

        if (prevItemIndex > -1) {
            console.log('hasPrevItem');
            array.splice(prevItemIndex,1)
        }

        // array = array.slice(array.length -2,array.length -1);

        chrome.storage.local.set({'ucs_editable': array});
    }
}

const listeners = new Listeners();
listeners.init();
