const edit = [
    {
        name: 'Item 1',
        hash: 'QmT25TeoMtuvZX11EJZxnbBXxuVabuG313WRyrTh6QKCXT',
        key: ''
    }
]

export default class Storage {



    constructor() {

    }

    get(key) {
        return new Promise( (resolve,reject) => {
            chrome.storage.local.get([key], (data) => {
                resolve(data[key]);
            });
        })
    }

    reset() {
            chrome.storage.local.set({'ucs_editable':edit});
    }
}
