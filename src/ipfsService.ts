import buffer from 'buffer';
import IPFS from 'ipfs';
// @ts-ignore
import Block from '@ipld/block/defaults';
import createClient from 'ipfs-http-client';
import dagJose from 'dag-jose';
// @ts-ignore
import multiformats from 'multiformats/basics';
// @ts-ignore
import legacy from 'multiformats/legacy';
import CID from "cids";
multiformats.multicodec.add(dagJose);
const dagJoseFormat = legacy(multiformats,dagJose.name);

import { encode, decode } from '@ipld/dag-cbor'


export default class IpfsService {

    didService;
    ipfs;

    constructor(didService) {
        this.didService = didService;
       // this.init();
    }

    async init() {
        // custom ipld formats only work with in process node for now https://github.com/ipfs/go-ipfs/issues/7909
        // @ts-ignore
       // this.ipfs = await IPFS.create({ url: 'http://127.0.0.1:45001', ipld: { formats: [dagJoseFormat]}});

    }

    async connect() {
        // @ts-ignore
        this.ipfs = await IPFS.create({ ipld: { formats: [dagJoseFormat]}});
    }

    get(cid) {

        const self = this;

        return new Promise(async (resolve,reject) => {
            const c = await self.ipfs.object.get(cid);
            resolve(c);
        });
    }

    addSignedObject(payload) {

        const self = this;

        return new Promise(async (resolve,reject) => {

            const { jws, linkedBlock } = await self.didService.did.createDagJWS(payload);
            const jwsCid = await self.ipfs.dag.put(jws);
            console.log(jwsCid);
            // put payload into ipfs dag
            const b = await self.ipfs.block.put(linkedBlock, { cid: jws.link });

             const retrievedDag = await self.ipfs.dag.get(jwsCid);
             console.log(retrievedDag.value);

             const pl = await self.ipfs.dag.get(jwsCid, { path: '/link'});
             console.log(pl.value);

            //  const verification = await self.didService.did.verifyJWS(jws);
            // console.log(verification);


            resolve({
                blockCid : b.cid,
                jwsCid: jwsCid
            });
        })
    }

    getSignedObject(jwsCid) {

        const self = this;
        return new Promise(async (resolve,reject) => {
            const pl = await self.ipfs.dag.get(jwsCid, { path: '/link'});
            resolve(pl.value);
        });
    }

    addEncryptedObject(data,dids) : any {

        const self = this;

        return new Promise( async(resolve,reject) => {

            const newJWE = await self.didService.did.createDagJWE(data,[self.didService.did.id])
            const dagCid = await self.ipfs.dag.put(newJWE);

            resolve({
                cid : dagCid.toString(),
                dids : [self.didService.did.id]
            });
        })

    }

    addDIDmetdata(data: any) : any {

        const self = this;

        const metaData = {
            name: 'joera',
            editable: []
        }

      //  const block = Block.encoder( metaData, 'json');

        const JsonToArray = function(json)
        {
            var str = JSON.stringify(json, null, 0);
            var ret = new Uint8Array(str.length);
            for (var i = 0; i < str.length; i++) {
                ret[i] = str.charCodeAt(i);
            }
            return ret
        };


        return new Promise( async(resolve,reject) => {

            // create unencrypted dag root with did
            const didCid = await self.ipfs.dag.put(encode({did : data.did_id}));

            const contentBlock = await self.ipfs.block.put(encode(metaData), { cid : didCid})

            setTimeout( async () => {
                const first = await self.ipfs.dag.get(didCid.toString());
                const second: any = await self.ipfs.block.get(contentBlock.cid.toString());
                // add block with metadata

                console.log(second.cid.toString());

                console.log(decode(second.data));

                resolve({
                    rootCid : didCid.toString(),
                    first : decode(first.value),
                  //  second: secondContent
                });
            },5000);



        });
    }
}
