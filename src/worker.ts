import createClient from 'ipfs-http-client';
const ipfs = createClient({ url : 'http://127.0.0.1:45001/api/v0'});

onmessage = async function(e) {

    let content = 'hiyaaa';
    console.log('worker on message');

    if (e.data === 'fetchCollectionSchema') {
        console.log('worker 1 - fetch collection schema');

        const { cid } = await ipfs.add('alle kippen op een stokje')

        // @ts-ignore
        this.postMessage(cid);
    }
}

