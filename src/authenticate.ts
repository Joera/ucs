import Web3 from 'web3';

import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';
// import ThreeIdProvider from '3id-did-provider';
import { Ed25519Provider } from 'key-did-provider-ed25519'

import { randomBytes } from '@stablelib/random';


const threeIdConnect = new ThreeIdConnect();

import Ceramic from '@ceramicnetwork/http-client';

class Authenticator {

    web3;
    ceramic;
    authProvider;

    constructor() {
       this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/bf4dcb4cee454b5b9c07653358ada14b'));
       this.ceramic = new Ceramic('https://gateway-clay.ceramic.network');
    }

    async init(){

        const seed = randomBytes(32);
        const provider = new Ed25519Provider(seed);
        await this.ceramic.setDIDProvider(provider);

    }

    // async connectThroughWallet() {
    //     // metamask does not connect to chrome extension
    //
    //     const account = this.web3.eth.accounts.create();
    //     // console.log(this.web3.eth.accounts[0]);
    //     console.log(account);
    //     this.authProvider = new EthereumAuthProvider(this.web3.eth,account.address);
    //     this.authenticate();
    // }






}
const authenticator = new Authenticator();
authenticator.init() ;
// console.log(window);
