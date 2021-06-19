import {query, queryAll, Focus, messageTemplate} from "./utility.js";
const socket = io();
const pathName = window.location.pathname;
const path = pathName.substring(pathName.lastIndexOf("/")+1);

// join the channel
socket.emit("joinChannel", path)

class Channel extends Focus{
    constructor() {
        super(
            {
                first: query(".js-channel-first"),
                last: query(".js-channel-last")
            },
            {
                node: queryAll(".js-channel-trigger"),
                parent: query(".js-channel-trigger").parentElement
            }
        );     
    }
}

new Channel();

class Account extends Focus {
    constructor() {
        super(
            {
                first: query(".js-account-first"),
                last: query(".js-account-last")
            },
            {
                node: queryAll(".js-account-trigger"),
                parent: query(".account")
            }
        );
    }
}

new Account();

class ControlOptions extends Focus{
    constructor() {
        super(
            {
                first: query(".control__options button"),
                last: query(".btn__roundr-control")
            },
            {
                node: queryAll(".js-control-open"),
                parent: query(".js-control-option")
            }
        );
    }
}

new ControlOptions();

class Content {
    constructor() {
        this.contentHolder = query(".js-content-holder");
        this.contentHolder.scrollTop = this.contentHolder.scrollHeight - this.contentHolder.clientHeight;
        socket.on("output", data=>{
            const content = messageTemplate(data);
            const li = document.createElement("li");
            li.innerHTML = content;
            this.contentHolder.appendChild(li);
            this.contentHolder.scrollTop = this.contentHolder.scrollHeight - this.contentHolder.clientHeight;
        })
    }
}

new Content();

class Message {
    constructor() {
        this.email = query("[data-address]").textContent;
        const messageForm = query(".js-message-control");
        messageForm.addEventListener("submit", event => this._formEvaluate(event));
    }

    _formEvaluate(event) {
        event.preventDefault();
        const message = event.target.message.value;
        if (message) {
            const data = {
                message: message,
                channel: event.target.dataset.channel,
                email: this.email
            };
            socket.emit("message", data);
            event.target.message.value = "";
        }
    }
}

new Message();