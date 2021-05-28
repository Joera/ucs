import Ajv, {JSONSchemaType, DefinedError} from "ajv";
import Schema from "./types/schema";
import Storage from './storageService';
import CID from "cids";
const store = new Storage();
import SeedService from "./seedService";
const seedService = new SeedService();

const ajv = new Ajv();

class UCSEditor {

    body: HTMLElement;

    constructor() {

        this.body = document.getElementsByTagName('body')[0];
        this.init();
    }

    async init() {

        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('action') === 'new') {
            const schemaObject : any = await this.fetchDefinition(urlParams.get('def'));
            this.createForm(null, schemaObject,'encrypt-and-store',urlParams.get('def')); // ,,

        } else if (urlParams.has('cid')) {

            let prevCid = urlParams.get('cid');
            let dataObject : any = await this.fetchDag(prevCid)// raw ? JSON.parse(raw) : false;
            console.log(dataObject);
            if (dataObject) {
                dataObject = await this.decryptData(dataObject);


                const schemaObject : any = await this.fetchDefinition(dataObject.meta.collection || 'bafyreia5tuo46g4on7ddqv2qam7fzxhoceggwrc7r3b3hph5yf3a7b357i');

                if (this.validateData(dataObject,schemaObject)) {
                    await this.createForm(prevCid, schemaObject, 'encrypt-and-store',false);
                    await this.populateForm(dataObject);
                }
            }
        }
    }

    async decryptData(dataObject: any) {
        return dataObject
    }

    fetchDefinition(cid) {

        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: 'ipfs-JWS-get',
                data: cid
            }, response => {
                if(response.complete) {
                    resolve(response.content);
                } else {
                    reject('Something wrong');
                }
            });
        });
    }

    fetchDag(cid) {

        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: 'ipfs-JWE-get',
                data: cid
            }, response => {
                if(response.complete) {
                    resolve(response.content);
                } else {
                    reject('Something wrong');
                }
            });
        });
    }


    async validateData(dataObject : any, schemaObject: any) {

        const validate = ajv.compile(schemaObject.schema);

        if (validate(dataObject.data)) {
            return dataObject;
        } else {
            // The type cast is needed to allow user-defined keywords and errors
            // You can extend this type to include your error types as needed.
            for (const err of validate.errors as DefinedError[]) {
                console.log(err);
                switch (err.keyword) {
                    case "minimum":
                        // err type is narrowed here to have "minimum" error params properties
                        console.log(err.params.limit)
                        break
                    // ...
                }
            }
            return false;
        }
    }

    async createForm(prevCid,schemaObject: Schema, ipfsMethod, defCid) {

        this.body.innerHTML = '';

        const title = document.createElement('h1');
        this.body.appendChild(title);

        const collection = document.createElement('h2');
        collection.innerText = schemaObject.name;
        this.body.appendChild(collection);

        const form = document.createElement('form');
        form.onsubmit = (e) => this.submitForm(e, prevCid, schemaObject, ipfsMethod);

        const props = schemaObject.schema.properties;

        for (let key of Object.keys(props)) {

            let el, label, fieldgroup;

            fieldgroup = document.createElement('div');
            fieldgroup.classList.add('fieldgroup');

            switch(props[key].type) {

                case 'string' :

                    label = document.createElement('label');
                    label.innerText = key;
                    label.for = key;
                    el = (props[key].maxLength !== undefined) ? document.createElement('input') : document.createElement('textarea')
                    el.id = key;
                    el.name = key;

                    break;

                case 'array' :

                    let options = [];

                    label = document.createElement('label');
                    label.innerText = key;
                    label.for = key;
                    el = document.createElement('select');
                    el.id = key;
                    el.name = key;

                    // for (let option of options) {
                    //
                    //     option.value = '';
                    //     option.innerText = '';
                    //     el.appendChild(option)
                    // }

                    break;
            }

            fieldgroup.appendChild(label);
            fieldgroup.appendChild(el);
            form.appendChild(fieldgroup);
        }

        let button = document.createElement('button');
        button.innerText = 'add';
        button.type = 'submit';
        form.appendChild(button)
        this.body.appendChild(form);

        if (defCid) {
            document.getElementsByTagName('h2')[0].setAttribute('definition-hash', defCid)
        }
    }


    populateForm(dataObject: any) {

        document.getElementsByTagName('h1')[0].innerText = dataObject.name;

        let defHash = dataObject.meta.collection ? dataObject.meta.collection : '';

        document.getElementsByTagName('h2')[0].setAttribute('definition-hash', defHash)

        let fieldGroups = this.body.getElementsByClassName('fieldgroup');
        for (let fieldGroup of fieldGroups) {
            const inputs = fieldGroup.querySelectorAll('input');
            for (let input of inputs) {
                input.value = dataObject.data[input.name];
            }
        }
    }

    async submitForm(e, prevCid, schemaObject: Schema, ipfsMethod) {

        e.preventDefault();

        let newDataObject: any = {};
        newDataObject.name = document.getElementsByTagName('h1')[0].innerText;
        newDataObject.meta = {};
        newDataObject.meta.collection = document.getElementsByTagName('h2')[0].getAttribute('definition-hash');
        newDataObject.data = {};

        let fieldGroups = this.body.getElementsByClassName('fieldgroup');
        for (let fieldGroup of fieldGroups) {
            const inputs: HTMLInputElement[] = [].slice.call(fieldGroup.querySelectorAll('input,textarea,select'));
            for (let input of inputs) {
                let name = input.getAttribute('name');
                if(name) {
                    switch (input.tagName) {
                        case 'SELECT' :
                            newDataObject.data[name] = [input.value];
                            break;
                        default:
                            newDataObject.data[name] = input.value;
                    }
                }
            }
        }

        if (this.validateData(newDataObject, schemaObject)) {

            if (prevCid !== null) {
                newDataObject.prev = prevCid;
            }

            // let res : any = await this.saveItem(newDataObject, ipfsMethod);
            // console.log(res);
            // hier doen we store to author array ...

            // hier doen we store to schema array


            chrome.runtime.sendMessage({
                type: 'content-changed',
                method: ipfsMethod,
                data: newDataObject
            });
        }
    }

    getStoredData(key) {
        return new Promise( (resolve,reject) => {
            chrome.storage.local.get([key], (data) => {
                resolve(data[key]);
            });
        })
    }

    // async saveToEditable(prevCid,cid) {
    //
    //     // get list
    //
    //     // leeft die lijst in de app ??
    //     // wanneer save je dan naar ipfs
    // }
    //
    //

    // async saveItem(newDataObject, ipfsMethod)  {
    //
    //     return new Promise((resolve, reject) => {
    //             chrome.runtime.sendMessage({
    //                type: ipfsMethod, // 'sign-and-store','encrypt-and-store',
    //                data: newDataObject
    //            }, response => {
    //                 resolve(response);
    //         });
    //     });
    // }


}

if(window.location.host.indexOf('noknnbahhppdblamiiamlgjpfjphhjjo') > -1) {
    const ucsEditor = new UCSEditor;
}
