console.log('teste');
const feed = document.getElementById('feed');
const searchFieldTextInput = document.getElementById("search-field-text");


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

        pius.forEach(piu => {
            console.log(new Date(piu.created_at))
        })
        
        //FUNCTIONALIDADE SEARCH
        const users = pius.map(piu => piu.user);
		const uniqueUsers = Array.from(new Set(users.map(user => user.id))).map(
			id => {
				return users.find(user => user.id === id);
			}
		);
		console.log(uniqueUsers);
		searchFieldTextInput.addEventListener("input", e => {
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
		});
    })


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
        
		const profileImg = document.createElement("img");
		profileImg.src = this.photo;
        profileImg.classList.add('profile-img')
        //profileImg.alt = 'profile photo';

        const userContainer = document.createElement("div");
        userContainer.classList.add('user-container');
        userContainer.appendChild(profileImg);
        userContainer.appendChild(usernameButton);

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

const search = (e, uniqueUsers) => {

}