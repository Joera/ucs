
export default class Collection {

    // collection is een dag .. waarvan laaste item de meest recente is. of andersom. ..
    //
    // verandert de cid van een dag wanneer je er blocks aan toevoegd?

    // renderen kan alleen wanneer collection did een sleutel is voor de contentITems

    did: any;
    schemae: any[] | [];
    editors: any [] | [];

    constructor(did) {

        this.schemae = [];
        this.editors = [];
    }

    update() {

    }

    store() {


    }

    remove() {

    }
}
