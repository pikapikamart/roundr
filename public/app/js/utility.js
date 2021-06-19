async function fetchData(value, route){
    const options = {
        headers: {
            'Content-Type': 'application/json'
          },
        method: "POST",
        body: JSON.stringify(value)
    };
    const callAPI = await fetch(route, options);
    return await callAPI.json();
}

function query(param) {
    return document.querySelector(param);
}

function queryAll(param) {
    return document.querySelectorAll(param);
}

class Focus {
    constructor(focus, triggers) {
        this.focus = focus;
        this.triggers = triggers;
        this.isItTab = false;
        this.isSelected = false;

        this._setFocusEvent();

        this.triggers.node.forEach(node =>{
            node.addEventListener("click", ()=> this._openContainerWithTabs());
        })
    }

    _setFocusEvent() {
        this.focus.last.addEventListener("blur", ()=>{
            if (this.isItTab) {
                this.focus.first.focus();
            }
        });

        this.focus.first.addEventListener("blur", ()=>{
            if (!this.isItTab) {
                this.focus.last.focus();
            }
        })
    }

    _keyPressed(event) {
        if (event.key == "Tab") {
            this.isItTab = true;
        } if (event.shiftKey && event.key == "Tab") {
            this.isItTab = false;
        }
    }

    _openContainerWithTabs() {
        this.triggers.parent.classList.toggle("selected");
        if (!this.isSelected) {
            this.isSelected = true;
            document.addEventListener("keydown", event => this._keyPressed(event));
        } else{
            this.isSelected = false;
            document.removeEventListener("keydown", this._keyPressed);
        }
    }
}

const messageTemplate = (data) =>{
    const template = `       
        <div class="content__container"> 
            <div class="avatar"> 
                <img class="avatar__image" src="/app/images/person-image.svg"/>
            </div>
            <div class="content__wrapper"> 
              <p class="content__user">
                <span class="content__displayName">${data.displayName}</span>
                <span class="content__time">${data.time}</span>
            </p>
              <div class="content__selection"> 
                <button aria-label="click to open up target user options"></button>
              </div>
              <p class="content__message">${data.message}</p>
              <div class="comments"> 
                <div class="comments__toggles"> 
                  <button class="js-message-reply" aria-label="click to add a reply"> </button>
                  <button class="js-message-like" aria-label="click to like the message" data-like="id"></button>
                </div>
              </div>
            </div>
        </div>
    `;

    return template;
};


export {fetchData, query, queryAll, Focus, messageTemplate};
