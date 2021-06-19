import {fetchData, query, queryAll, Focus} from "./utility.js";

const getContainerDatas = element=>{
    return {
        node: element,
        parent: element.parentElement,
        error: element.nextElementSibling.nextElementSibling
    };
}

const getFormDatas = element=>{
    return {
        node: element,
        parent: element.parentElement
    }
}

const testEmail = email=>{
    let re = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    return re.test(email);
}

const removeErrors = element=>{
    element.parent.classList.remove("invalid");
    element.node.setAttribute("aria-invalid", "false");
};

const setErrors = element=>{
    element.parent.classList.add("invalid");
    element.node.setAttribute("aria-invalid", "true");
}

class Login {
    constructor() {
        this.loginErrorRegion = query(".js-login-region");
        this.email = getContainerDatas(query("#loginEmail"));
        this.password = getFormDatas(query("#loginPassword"));

        const loginForm = query(".js-login-form");
        loginForm.addEventListener("submit", event => this.checkForm(event));
        this._setInputTransitions();
    }

    _setInputTransitions() {
        const formInputs = queryAll(".login .form__input");
        formInputs.forEach(input =>{
            input.addEventListener("input", ()=>{
                if (input.value) {
                    input.classList.add("moveup");
                } else {
                    input.classList.remove("moveup");
                }
            });
        });
    }

    checkForm(event) {
        let errorMessage = "";
        let error = false;
        this.loginErrorRegion.textContent = "";

        if (this.email.node.value && testEmail(this.email.node.value)) {
            removeErrors(this.email);
        } else {
            if (!this.email.node.value) {
                this.email.error.textContent = "please enter an email";
                errorMessage += "Please enter an email ";
            } else if(!testEmail(this.email.node.value)) {
                this.email.error.textContent = "please enter a valid email";
                errorMessage += "Please enter a valid email ";
            }
            error = true;
            setErrors(this.email);
        }
        if (this.password.node.value) {
            removeErrors(this.password);
        } else {
            setErrors(this.password);
            errorMessage += "Please enter a password";
            error = true;
        }
        if (error) {
            this.loginErrorRegion.textContent = errorMessage;
            event.preventDefault();
        }
    }
}

class Signup extends Focus{
    constructor() {
        super(
            {
                first: query(".signup form .js-close-control"),
                last: query(".signup .js-last-control")
            },
            {
                node: queryAll(".js-close-control"),
                parent: query(".signup")
            }
        );
        this.body = query("body");
        this.signupModalCover = query(".signup .modal__cover");
        this.signupForm = query(".js-signup-form");
        this.signupRegion = query(".js-signup-region");
        this.fullname = getFormDatas(query("#signupFullName"));
        this.displayname = getFormDatas(query("#signupDisplayName"));
        this.email = getContainerDatas(query("#signupEmail"));
        this.password = getContainerDatas(query("#signupPassword"));
        this.signupLoadingScreen = query(".login .bounce-loading");
        this.signupFormContainers = queryAll(".signup .form__container");
        this.signupFormInputs = queryAll(".signup .form__input");
        this.successSignupWrapper = query(".signup-success");
        this.isSubmitting = false;
        this.isTaken = false;
        this.error = false;

        const signupTrigger = query(".js-signup-trigger");
        signupTrigger.addEventListener("click", (event) =>{
            event.preventDefault();
            this.body.classList.toggle("no-scroll");
            this._openContainerWithTabs();
            this._setSignupElements();
        })
        
        this._setCloseTriggers();
        this.signupForm.addEventListener("submit", (event) => this._checkForm(event));
        this.triggers.parent.innerHTML = "";
    }

    _setSignupElements() {
        this.triggers.parent.appendChild(this.signupModalCover);
        this.triggers.parent.appendChild(this.signupForm);
        this._signupEmailFetchEvent();
    }

    _signupEmailFetchEvent() {
        this.email.node.addEventListener("change", async()=>{
            const json = await fetchData({email: this.email.node.value}, "/users/api");
            if (json) {
                this.error = true;
                this.isTaken = true;
                this.email.error.textContent = "email is already in used!";
                this.signupRegion.textContent = "Email is already in used ";
                this.email.parent.classList.add("invalid");
                this.email.node.setAttribute("aria-invalid", "true");
            } else {
                this.email.parent.classList.remove("invalid");
                this.isTaken = false;
                this.error = false;
            }
        });
    }

    _setCloseTriggers() {
        this.triggers.node.forEach(trigger => trigger.addEventListener("click", event=> this._resetSignup(event)));
    }

    _resetSignup() {
        this.body.classList.toggle("no-scroll");
        this.signupFormContainers.forEach(container => container.classList.remove("invalid"));
        this.signupFormInputs.forEach(input => {
            input.value = "";
            input.classList.remove("moveup");
        });
        setTimeout(()=>{
            this.triggers.parent.innerHTML = "";
        }, 500);
    }

    _checkForm(event) {
        event.preventDefault();
        let errorMessage = "";
        this.signupRegion.textContent = "";

        if (this.fullname.node.value) {
            removeErrors(this.fullname);
        }else {
            setErrors(this.fullname);
            errorMessage += "Please enter your fullname ";
            this.error = true;
        }
        if (this.displayname.node.value) {
            removeErrors(this.displayname);
        } else {
            setErrors(this.displayname);
            errorMessage += "Please enter your display name";
            this.error = true;
        }
        if (!this.isTaken && this.email.node.value && testEmail(this.email.node.value)) {
            removeErrors(this.email);
            this.isTaken = false;
        } else{
            if (this.isTaken) {
                this.email.error.textContent = "email is already in used!";
            errorMessage += "Email is already in used, use another one";
            }else if (!this.email.node.value) {
                this.email.error.textContent = "please enter an email";
                errorMessage += "Please enter an email ";
            } else if (!testEmail(this.email.node.value)) {
                this.email.error.textContent = "please enter a valid email";
                errorMessage += "Please enter a valid email";
            }
            this.error = true;
            setErrors(this.email);
        }
        if (this.password.node.value.length >= 6) {
            removeErrors(this.password)
        } else{
            if(!this.password.node.value) {
                this.password.error.textContent = "please enter a password";
                errorMessage += "Please enter a password ";
            } else if(this.password.node.value.length < 6) {
                this.password.error.textContent = "password must be of 6 length";
                errorMessage += "Please enter a password of at least length 6";
            }
            this.error = true;
            setErrors(this.password);
        }
        if (this.error) {
            this.signupRegion.textContent = errorMessage;
        } else if(!this.isSubmitting){
            this.body.classList.add("no-scroll");
            this.isSubmitting = true;
            const object = {
                fullName: this.fullname.node.value,
                displayName: this.displayname.node.value,
                email: this.email.node.value,
                password: this.password.node.value
            }
            this.signupLoadingScreen.classList.add("animate");
            this.signupRegion.textContent = "Submitting sign up form ";
            fetchData(object, "/users/signup").then(user =>{
                this.signupRegion.textContent = "Account successfully created You may now log in with the account";
                this._resetSignup();
                this.successSignupWrapper.classList.add("show");
                setTimeout(()=>{
                    this.signupLoadingScreen.classList.remove("animate");
                    this.triggers.parent.classList.remove("selected");
                    this.body.classList.remove("no-scroll");
                }, 300);
                setTimeout(()=>{
                    this.successSignupWrapper.classList.remove("show");
                }, 4000)
                this.isSubmitting = false;
            })
        }
    }
}

new Login();
new Signup();