

export default class AuthorService {

    ipfsService;
    didService;
    editable;

    constructor(ipfsService,didService) {

        this.ipfsService = ipfsService;
        this.didService = didService;

        setTimeout( async () => {
            this.refresh();
        },2000);
    }

    async init() {



    }

    async refresh() {

        let self = this;

        // this.didService.idx.get('uCS').then( async (ucs_data) => {
        //     self.ipfsService.ipfs.dag.get(ucs_data.editable).then((content) => {
        //         self.didService.did.decryptDagJWE(content.value).then( (cleartext) => {
        //             console.log('yo');
        //             console.log(cleartext);
        //             self.editable = cleartext;
        //         });
        //     });
        //     // sendResponse({complete: true, content: data });
        // })
    }


    async create() {
        // create DAG
       // return cid;
        let cid = 'x'
        let list = [];

        return { cid, list}
    }

    insert() {

    }

    splice() {

    }
}
