

const content = [
    {
        name: 'item 1',
        hash: 'k51qzi5uqu5di1u6arh2e3s1p51vaul0s9gnfd8ce6gwk58035wmytj4ov1p51'
    }
]

class UCSPopup {

    content_list_El: HTMLElement | null;

    constructor(

    ) {
        this.content_list_El = document.getElementById('content_list') || null
        this.init();
    }

    init() {

        this.populateContentList();
    }

    populateContentList() {

        if(this.content_list_El === null) { return; }

        for (let item of content) {

            let li = document.createElement('li');
            li.innerText = item.name;
            li.onclick = () => {
                chrome.tabs.create({ url : 'ipns://' + item.hash }, () => {})
            }

            this.content_list_El.appendChild(li)
        }
    }










}

const ucsPopup = new UCSPopup();
