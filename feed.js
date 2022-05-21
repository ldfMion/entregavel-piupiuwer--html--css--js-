console.log('teste');
const feed = document.getElementById('feed');
const searchFieldTextInput = document.getElementById("search-field-text");
const searchArea = document.getElementById('search-area');


fetch("https://arcane-sierra-77337.herokuapp.com/data")
    .then((response) => response.json()).then(pius => {

        //PEGAR OS PIUS
        console.log(pius);
        pius.sort((prev, curr) => {
            console.log('sort')
            console.log(typeof prev.created_at, curr.created_at)
            return new Date(prev.created_at) - new Date(curr.created_at)
        }).forEach(piu => {
            feed.appendChild(new Piu(piu).element);
        })
        
        //FUNCTIONALIDADE SEARCH
        const users = pius.map(piu => piu.user);
		const uniqueUsers = Array.from(new Set(users.map(user => user.id))).map(
			id => {
				return users.find(user => user.id === id);
			}
		);
		console.log(uniqueUsers);
		searchFieldTextInput.addEventListener("input", e => search(e, uniqueUsers));
    })

const piarButton = document.getElementById('piar-button');

piarButton.addEventListener('click', () => {
    piarButton.classList.add('piar-button-hidden');
    document.querySelector('body').appendChild(new CriarPio().element);
})


class UsernameButton {
    constructor(username){
        this.username = username;
        console.log('is on username button constructor')
    }
    get element(){
        console.log('is on get elemetn on username button')
        const usernameParagraph = document.createElement("p");
        usernameParagraph.appendChild(document.createTextNode("@" + this.username))
        const usernameButton = document.createElement("button");
        usernameButton.appendChild(usernameParagraph);
        usernameButton.classList.add('btn-terciary');
        return usernameButton;
    }
}

class UserContainer {
    constructor(photoSrc, usernameButton){
        this.photoSrc = photoSrc;
        this.usernameButton = usernameButton;
    }
    get element(){
        const profileImg = document.createElement("img");
		profileImg.src = this.photoSrc;
        profileImg.classList.add('profile-img')
        profileImg.alt = 'profile photo';

        const userContainer = document.createElement("div");
        userContainer.classList.add('user-container');
        userContainer.appendChild(profileImg);
        userContainer.appendChild(this.usernameButton);
        return userContainer;
    }
}

class Piu {
	constructor({ 
        text, 
        user,
    }) {
		this.text = text;
		this.username = user.username;
        this.photo = user.photo;
	}
	get element() {
		const piu = document.createElement("article");
        piu.classList.add('piu');

        //USER AND TEXT

        const usernameButton = new UsernameButton(this.username).element;

        const userContainer = new UserContainer(this.photo, usernameButton).element;

        const piuHeader = document.createElement('header');
        piuHeader.classList.add('piu-header');
        piuHeader.appendChild(userContainer);
    
		const textParagraph = document.createElement("p");
        textParagraph.classList.add('text-paragraph')
		const text = document.createTextNode(this.text);
		textParagraph.appendChild(text);

        const userAndText = document.createElement('div');
        userAndText.classList.add('user-and-text');
        userAndText.appendChild(piuHeader);
        userAndText.appendChild(textParagraph);

        piu.append(userAndText);

        //ACTIONS

        const actions = document.createElement('div');
        actions.classList.add('actions')

        actions.appendChild(new RepiarAction(Math.floor(Math.random() * 100)).createElement);
        actions.appendChild(new CommentAction(Math.floor(Math.random() * 100)).createElement);
        actions.appendChild(new LikeAction(Math.floor(Math.random() * 100)).createElement);

        piu.appendChild(actions)

		return piu;
	}
}

class Action {
    icon;
    cssClass;
    constructor(count){
        this.count = count;
    }
    get createElement(){
        const action = document.createElement('button');
        action.classList.add(this.cssClass)
        const icon = document.createElement('p')
        icon.appendChild(document.createTextNode(this.icon))
        const count = document.createElement('p');
        count.appendChild(document.createTextNode(this.count));
        action.appendChild(icon)
        action.appendChild(count)

        action.addEventListener('click', this.specificActions)
        this.actionElement = action;
        this.countElement = count;
        return action;
    }
    //specificActions;
}

class LikeAction extends Action {
    constructor(count){
        super(count);
    }
    icon = "❤️";
    cssClass = 'like-action';
    specificActions = () => {
        console.log(this)
        if(!this.liked){
            this.liked = true;
            this.count++;
            this.countElement.innerText = this.count;
            this.actionElement.classList.add('liked')
        } else {
            this.liked = false;
            this.count--;
            this.countElement.innerText = this.count;
            this.actionElement.classList.remove('liked')
        }
    }
}

class CommentAction extends Action {
    constructor(count){
        super(count);
    }
    icon = "💬";
    cssClass = 'comment-action';
}

class RepiarAction extends Action {
    constructor(count){
        super(count);
    }
    icon = "🐥";
    cssClass = 'repiar-action';
}

const currentUser = {
    username: 'lorenzodfmion',
    first_name: 'Lorenzo',
    last_name: 'Mion',
    photo: 'user-image.jpg'
}

class CriarPio {
    constructor(automaticallyAddedText){
        this.automaticallyAddedText = automaticallyAddedText;
    }
    get element(){
        const criarPio = document.createElement('form');
        criarPio.classList.add('criar-pio')

        criarPio.appendChild(new UserContainer(currentUser.photo, new UsernameButton(currentUser.username).element).element);

        const inputText = document.createElement('textarea');
        criarPio.appendChild(inputText);

        const errorArea = document.createElement('div');
        errorArea.classList.add('error-area');
        const errorMessage = document.createElement('p');
        errorMessage.classList.add('warning-text');
        errorArea.appendChild(errorMessage);
        const charCount = document.createElement('p');
        charCount.innerText = '140'
        charCount.classList.add('text-align-right');
        errorArea.appendChild(charCount);
        criarPio.appendChild(errorArea);


        const buttons = document.createElement('div');
        buttons.classList.add("criar-pio-buttons")

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn-terciary');
        const cancelButtonText = document.createElement('p');
        cancelButtonText.innerText = 'cancel';
        cancelButton.appendChild(cancelButtonText)
        buttons.appendChild(cancelButton);

        const submitPio = document.createElement('button');
        submitPio.disabled = true;
        submitPio.classList.add('btn-primary');
        const submitPioText = document.createElement('p');
        submitPioText.innerText = 'piar';
        submitPio.appendChild(submitPioText)
        buttons.appendChild(submitPio);

        criarPio.appendChild(buttons);

        inputText.addEventListener('keyup', e => {
            const remainingChars = 140 - e.target.value.length;
            charCount.innerText = remainingChars;
            if(remainingChars < 0){
                submitPio.disabled = true;
                charCount.classList.add('warning-text');
                errorMessage.innerText = 'Escreva no máximo 140 caracteres';
            } else if (remainingChars === 140){
                submitPio.disabled = true;
                charCount.classList.add('warning-text');
                errorMessage.innerText = 'O piu não pode estar vazio';
            } 
            else {
                submitPio.disabled = false;
                charCount.classList.remove('warning-text');
                errorMessage.innerText = '';
            }
        });

        cancelButton.addEventListener('click', e => {
            criarPio.remove();
            console.log('os going to remove this class');
            piarButton.classList.remove('piar-button-hidden');
        })

        submitPio.addEventListener('click', e => {
            const piuText = inputText.value;
            e.preventDefault();
            searchArea.after(new Piu({text: piuText, user: currentUser}).element);
        })

        return criarPio;
    }
}

const search = (e, uniqueUsers) => {
    const searchedText = e.target.value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    const searchResultsChildren = Array.from(searchResults.children);
    if(searchResultsChildren.length){
        console.log(searchResultsChildren);
        searchResultsChildren.forEach(result => result.remove());
    }
    if(searchedText.length === 0){
        searchResults.classList.add('search-results-inactive');
        return
    }
    searchResults.classList.remove('search-results-inactive');
    console.log(searchedText);
    const filteredUsers = uniqueUsers.filter(
        user =>
            user.username.toLowerCase().includes(searchedText) ||
            (
                user.first_name.toLowerCase() +
                " " +
                user.last_name.toLowerCase()
            ).includes(searchedText)
    );
    if(filteredUsers.length === 0){
        searchResults.classList.add('search-results-inactive');
    } else {0
        console.log(filteredUsers);
        filteredUsers.forEach(user => {
            searchResults.appendChild(new UsernameButton(user.username).element)
        })
    }
}