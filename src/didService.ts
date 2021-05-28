// import Ceramic from '@ceramicnetwork/http-client';
// const ceramic = new Ceramic('http://localhost:7007');
// import { IDX } from '@ceramicstudio/idx';
import { randomBytes } from "@stablelib/random";

import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from '@ceramicnetwork/key-did-resolver';
import SeedService from './seedService';
import IpfsService from "./ipfsService";

const aliases = {
    "uCS": "kjzl6cwe1jw14asg4wvka6nfn9pfpzx92e59qskqn2ywo1b5cgxarpfpq9qj8yy"
}

export default class DidService {

    seedService;
    ipfsService;
    idx;
    did;
    authenticated: boolean = false;

    constructor() {
        this.seedService = new SeedService();
        this.ipfsService = new IpfsService(this);
    }

    async readSeedFromStorage() {

        let self = this;
        let seed: string;

        return new Promise(async (resolve,reject) => {

            chrome.storage.local.get(['ucs_seed'], async (data) => {

                if (data['ucs_seed']) {
                    seed = data['ucs_seed']
                } else {
                    let bytes = randomBytes(32);
                    seed = self.seedService.toHexString(bytes);
                    chrome.storage.local.set({'ucs_seed': seed});
                }

                resolve(seed);
            })

        })
    }

    async getDID() {

        if(!this.authenticated) {

            let seed: any = await this.readSeedFromStorage();
            let bytes: any = this.seedService.toByteArray(seed);
            const provider = new Ed25519Provider(bytes);
            this.did = new DID({provider, resolver: KeyResolver.getResolver()})
            await this.authenticateDID();
        }


        return(this.did._id);
    }

    async authenticateDID() {

        await this.did.authenticate();
        this.authenticated = true;
        console.log('connected with did: ' + this.did.id);
        return true;

    }

    // with ceramic
    async init() {

        let self = this;

        // let seed: any = await this.readSeedFromStorage();
        // let bytes : any = self.seedService.toByteArray(seed);
        // const provider = new Ed25519Provider(bytes);
        // await ceramic.setDIDProvider(provider);
        // self.did = new DID({ provider, resolver: KeyResolver.getResolver() })
        // await self.did.authenticate();
        // console.log('connected with did: ' + self.did.id);
        //
        // this.idx = new IDX({ ceramic, aliases });

    }
}
