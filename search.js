console.log("search.js");

const searchFieldTextInput = document.getElementById("search-field-text");
console.log(searchFieldTextInput);

fetch("https://arcane-sierra-77337.herokuapp.com/data")
	.then(response => response.json())
	.then(pius => {
		const users = pius.map(piu => piu.user);
		// console.log(users)
		// const uniqueUsers = Array.from(new Set(users));
		// console.log(uniqueUsers)
		const uniqueUsers = Array.from(new Set(users.map(user => user.id))).map(
			id => {
				return users.find(user => user.id === id);
			}
		);
		console.log(uniqueUsers);
		searchFieldTextInput.addEventListener("input", e => {
			console.log("is changing");
			const searchedText = e.target.value.toLowerCase();
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
			console.log(filteredUsers);
		});
	});

// class Handle {
//     constructor
// }