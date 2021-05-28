import Tab = chrome.tabs.Tab;

import dagCBOR from 'ipld-dag-cbor';
import Storage from './storageService';
import SeedService from "./seedService";
const store = new Storage();

const schemas = [
    {
        name: 'Portfolio',
        cid: 'bafyreia5tuo46g4on7ddqv2qam7fzxhoceggwrc7r3b3hph5yf3a7b357i',
        key: ''
    }
]

class UCSPopup {

    content_list_El: HTMLElement | null;
    schema_list_El: HTMLElement | null;
    seedService;
    author;


    constructor(

    ) {
        this.seedService = new SeedService();
        this.content_list_El = document.getElementById('content_list') || null;
        this.schema_list_El = document.getElementById('schema_list') || null
        this.init();
    }

    async init() {

        // to do : await ipfs start

        const did_id = await this.task('did-get',{});

        // const profile = await this.task('did-metadata');


        // fetch or add meta-data
        // encrypt did for DAG root
        // add json linked to DAG ROOT

        // what do i create first? root or linked data ?
        // can you add links to the root
        // or does it link the other way?

        // let itemList;
        // let myFiles = await store.get('ucs_editable');

        // const profile : any = await this.idxRead('basicProfile');
        // const did_id : any = await this.getDid();
        // const ucs_data : any = await this.idxRead('uCS');

        // wait for ipfs node on background;
        // setTimeout(async () => {

        await this.task('ipfs-connect',{did_id : did_id});

        await this.task('add-metadata',{did_id : did_id});

        // }, 1000)

            // if (ucs_data.editable) {
            //     itemList = await this.getAuthorList(ucs_data.editable);
            //     // alert(JSON.stringify(itemList));
            // } else {
            //     let { newAuthorCid, itemList } : any = await this.writeAuthorList([],did_id);
            //     await this.writeToIDX('uCS','editable', newAuthorCid);
            // }

            // get or create dag for this profile
       //     this.populateProfile({});
            //
            // this.populateContentList(myFiles);
            // this.populateSchemaList();
            //
        // }, 1000)

    }

    async task(task: string, data: any) {

           return new Promise((resolve, reject) => {

                chrome.runtime.sendMessage({
                    type: task,
                    data: data,
                }, response => {
                    if(response.complete) {
                        resolve(response.content);
                    } else {
                        reject('Something wrong');
                    }
                });
           });
    }


    // async writeAuthorList(list,did) {
    //
    //     return new Promise((resolve, reject) => {
    //         chrome.runtime.sendMessage({
    //             type: 'ipfs-write-encrypted',
    //             data: list,
    //             dids: [did],
    //         }, response => {
    //             if(response.complete) {
    //                 resolve({
    //                     newAuthorCid : response.cid,
    //                     itemList : response.itemList
    //                 });
    //             } else {
    //                 reject('Something wrong');
    //             }
    //         });
    //     });
    // }
    //
    // async getAuthorList(cid) {
    //
    //     return new Promise((resolve, reject) => {
    //         chrome.runtime.sendMessage({
    //             type: 'ipfs-read-encrypted',
    //             cid: cid
    //         }, response => {
    //             if(response.complete) {
    //                 resolve(response.list)
    //             } else {
    //                 reject('Something wrong');
    //             }
    //         });
    //     });
    // }
    //
    // async writeToIDX(alias,key,value) {
    //
    //     return new Promise((resolve, reject) => {
    //         chrome.runtime.sendMessage({
    //             type: 'idx-write',
    //             alias: alias,
    //             key : key,
    //             value: value
    //         }, response => {
    //             if(response.complete) {
    //                 resolve(response.content);
    //             } else {
    //                 reject('Something wrong');
    //             }
    //         });
    //     });
    // }
    //
    //
    // async idxRead(alias) {
    //
    //     return new Promise((resolve, reject) => {
    //
    //         chrome.runtime.sendMessage({
    //             type: 'idx-read',
    //             alias: alias
    //         }, response => {
    //             if(response.complete) {
    //                 resolve(response.content);
    //             } else {
    //                 reject('Something wrong');
    //             }
    //         });
    //     });
    // }
    //
    //
    // populateProfile(basicProfile) {
    //
    //         const span: HTMLElement | null = document.getElementById('did-name');
    //         if(span) {
    //             span.innerText = 'joera'; //basicProfile.name;
    //         }
    // }
    //
    // populateContentList(items) {
    //
    //     const self = this;
    //
    //     if(this.content_list_El === null) { return; }
    //
    //    for (let item of items) {
    //
    //         let li = document.createElement('li');
    //         li.innerText = item.cid; //
    //         li.onclick = () => {
    //             chrome.tabs.create({ url : chrome.extension.getURL("editor.html?cid=" + item.cid) }, () => {})
    //         }
    //
    //         this.content_list_El.appendChild(li)
    //    }
    // }
    //
    // populateSchemaList() {
    //
    //     if(this.schema_list_El === null) { return; }
    //
    //     for (let item of schemas) {
    //
    //         let li = document.createElement('li');
    //         let span = document.createElement('span');
    //         span.innerText = item.name;
    //
    //         let editButton = document.createElement('button');
    //         editButton.innerText = 'edit';
    //         editButton.onclick = () => {
    //             chrome.tabs.create({ url : chrome.extension.getURL("definition.html?action=edit&def=" + item.cid) }, () => {})
    //         }
    //
    //         let newButton = document.createElement('button');
    //         newButton.innerText = 'new';
    //         newButton.onclick = () => {
    //             chrome.tabs.create({ url : chrome.extension.getURL("editor.html?action=new&def=" + item.cid) }, () => {})
    //         }
    //
    //         li.appendChild(span);
    //         li.appendChild(editButton);
    //         li.appendChild(newButton);
    //         this.schema_list_El.appendChild(li)
    //     }
   // }

}

const ucsPopup = new UCSPopup();
