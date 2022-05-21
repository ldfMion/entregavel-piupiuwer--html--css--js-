console.log('teste');
const feed = document.getElementById('feed');

class Piu {
	constructor({ 
        text, 
        user,
    }) {
		this.text = text;
		this.username = '@'+ user.username;
        this.photo = user.photo;
	}
	get element() {
		const piu = document.createElement("article");
        piu.classList.add('piu');

        //USER AND TEXT

        const usernameParagraph = document.createElement("p");
        usernameParagraph.appendChild(document.createTextNode(this.username))
        const usernameButton = document.createElement("button");
        usernameButton.appendChild(usernameParagraph);
        usernameButton.classList.add('btn-terciary');
        
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

        actions.appendChild(new RepiarAction(10).createElement);
        actions.appendChild(new CommentAction(10).createElement);
        actions.appendChild(new LikeAction(10).createElement);

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


fetch("https://arcane-sierra-77337.herokuapp.com/data")
    .then((response) => response.json()).then(pius => {
        console.log(pius);
        pius.forEach(piu => {
            feed.appendChild(new Piu(piu).element);
        })
        
    })
