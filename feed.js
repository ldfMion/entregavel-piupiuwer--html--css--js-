//eu ia fazer um arquivo para cada componente, mas nesse jeito de renderizar o site pelo arquivo html os modulos não funcionam


class UsernameButton {
    constructor(username){
        this.username = username;
    }
    get element(){
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

class PiuOption {
    additionalClasses = '';
    piuOptionText;
    piuOptionIconSrc;
    constructor(piuOptions){
        this.piuOptions = piuOptions;
    }
    get element(){
        const piuOption = document.createElement('button');
        piuOption.classList.add('btn-terciary' + this.additionalClasses);

        const piuOptionIcon = document.createElement('img');
        piuOptionIcon.classList.add('piu-option-icon')
        piuOptionIcon.src = this.piuOptionIconSrc;

        const piuOptionText = document.createElement('p');
        piuOptionText.innerText = this.piuOptionText;

        piuOption.appendChild(piuOptionIcon);
        piuOption.appendChild(piuOptionText);
        piuOption.addEventListener('click', this.specificActions);

        return piuOption;
    }
    hidePiuOptions(){
        this.piuOptions.classList.add('piu-options-hidden');
    }
}

class PiuOptionEdit extends PiuOption {
    piuOptionText = 'Edit';
    piuOptionIconSrc = 'icons/edit.svg';
    constructor(textParagraph, ...args){
        super(...args);
        this.textParagraph = textParagraph;
    }
    specificActions = () => {
        console.log(this.textParagraph)
        this.textParagraph.contentEditable = true;
        this.hidePiuOptions();
        const finishEditingButton = document.createElement('button');
        finishEditingButton.contentEditable = false;
        finishEditingButton.classList.add('btn-primary')
        const finishEditingButtonText = document.createElement('p');
        finishEditingButtonText.classList.add('text-align-center')
        finishEditingButtonText.innerText = 'Done';
        finishEditingButton.appendChild(finishEditingButtonText);
        finishEditingButton.addEventListener('click', () => {
            this.textParagraph.contentEditable = false;
            finishEditingButton.remove();
        })
        this.textParagraph.appendChild(finishEditingButton)
    }
}

class PiuOptionDelete extends PiuOption {
    piuOptionText = 'Delete';
    piuOptionIconSrc = 'icons/delete.svg';
    constructor(piu, ...args){
        super(...args);
        console.log(piu)
        this.piu = piu;
    }
    specificActions = () => {
        console.log(this.piu)
        this.piu.remove();
    }
}

class Piu {
	constructor({ 
        text, 
        user,
    }, likeCount) {
        console.log(user)
		this.text = text;
		this.username = user.username;
        this.photo = ((user.photo === 'aleatorio' || user.photo === '') ? `https://avatars.dicebear.com/api/initials/${user.first_name[0] + user.last_name[0]}.svg` : user.photo);
        this.likeCount = likeCount;
	}
	get element() {
		const piu = document.createElement("article");
        piu.classList.add('piu');

        //USER AND TEXT
        
        const usernameButton = new UsernameButton(this.username).element;
        
        const userContainer = new UserContainer(this.photo, usernameButton).element;
        
        const optionsIcon = document.createElement('img');
        optionsIcon.src = 'icons/options.svg';
        optionsIcon.classList.add('options-icon');
        
        const piuHeader = document.createElement('header');
        piuHeader.classList.add('piu-header');
        piuHeader.appendChild(userContainer);
        piuHeader.appendChild(optionsIcon)
    
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
        actions.appendChild(new LikeAction(this.likeCount===undefined ? Math.floor(Math.random() * 100) : this.likeCount).createElement);

        piu.appendChild(actions)

        //OPTIONS

        const piuOptions = document.createElement('menu');
        piuOptions.classList.add('piu-options');
        piuOptions.appendChild(new PiuOptionEdit(textParagraph, piuOptions).element);
        piuOptions.appendChild(new PiuOptionDelete(piu, piuOptions).element);
        piuOptions.classList.add('piu-options-hidden');
        optionsIcon.addEventListener('click', () => {
            piuOptions.classList.remove('piu-options-hidden');
        })


        piuHeader.appendChild(piuOptions);

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
}

class LikeAction extends Action {
    constructor(count){
        super(count);
    }
    icon = "❤️";
    cssClass = 'like-action';
    specificActions = () => {
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
        this.inputText = inputText;
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
        cancelButtonText.classList.add('text-align-center');
        cancelButtonText.innerText = 'cancel';
        cancelButton.appendChild(cancelButtonText)
        buttons.appendChild(cancelButton);

        const submitPio = document.createElement('button');
        submitPio.disabled = true;
        submitPio.classList.add('btn-primary');
        const submitPioText = document.createElement('p');
        submitPioText.classList.add('text-align-center');
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
            piarButton.classList.remove('piar-button-hidden');
        })

        submitPio.addEventListener('click', e => {
            const piuText = inputText.value;
            e.preventDefault();
            searchArea.after(new Piu({text: piuText, user: currentUser}, 0).element);
            criarPio.remove();
            piarButton.classList.remove('piar-button-hidden');
        })

        return criarPio;
    }
}

const search = (e, uniqueUsers) => {
    const searchedText = e.target.value.toLowerCase();
    const searchResults = document.getElementById('search-results');
    const searchResultsChildren = Array.from(searchResults.children);
    if(searchResultsChildren.length){
        searchResultsChildren.forEach(result => result.remove());
    }
    if(searchedText.length === 0){
        searchResults.classList.add('search-results-inactive');
        return
    }
    searchResults.classList.remove('search-results-inactive');
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
        filteredUsers.forEach(user => {
            searchResults.appendChild(new UsernameButton(user.username).element)
        })
    }
}

const feed = document.getElementById('feed');
const searchFieldTextInput = document.getElementById("search-field-text");
const searchArea = document.getElementById('search-area');


fetch("https://arcane-sierra-77337.herokuapp.com/data")
    .then((response) => response.json()).then(pius => {

        //PEGAR OS PIUS
        pius.sort((prev, curr) => {
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
		searchFieldTextInput.addEventListener("input", e => search(e, uniqueUsers));
    })

const piarButton = document.getElementById('piar-button');

piarButton.addEventListener('click', () => {
    piarButton.classList.add('piar-button-hidden');
    document.querySelector('body').appendChild(new CriarPio().element);
})
