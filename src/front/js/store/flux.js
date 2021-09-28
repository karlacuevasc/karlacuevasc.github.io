import { useHistory } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: JSON.parse(localStorage.getItem("token")),
			random: [],
			cocktails: [],
			alcoholic: [],
			nonAlcoholic: [],
			favorites: [],
			filteredCocktails: [],
			activeUser: []
		},
		actions: {
			allCocktailsDescription: async () => {
				const store = getStore();
				try {
					let waitForCocktailsDescription = await fetch(
						`${process.env.APIURL}/${process.env.APIKEY}/search.php?s=margarita`
					);
					let jsonOfCocktailsDescription = await waitForCocktailsDescription.json();
					setStore({ cocktails: jsonOfCocktailsDescription.drinks });
				} catch (error) {
					console.log(error);
				}
			},
			randomcocktailsInfo: () => {
				const randomEndPoint = `${process.env.APIURL}/${process.env.APIKEY}/randomselection.php`;
				fetch(randomEndPoint)
					.then(response => response.json())
					.then(data => {
						setStore({
							random: data.drinks
						});
					});
			},
			fetchalcoholicInfo: async () => {
				const store = getStore();
				try {
					let waitForAlcoholicCocktails = await fetch(
						`${process.env.APIURL}/${process.env.APIKEY}/filter.php?a=Alcoholic`
					);
					let jsonOfAlcoholicCocktails = await waitForAlcoholicCocktails.json();
					setStore({ alcoholic: jsonOfAlcoholicCocktails.drinks });
				} catch (error) {
					console.log(error);
				}
			},

			fetchnonalcoholicInfo: async () => {
				const store = getStore();
				try {
					let waitForNonAlcoholicCocktails = await fetch(
						`${process.env.APIURL}/${process.env.APIKEY}/filter.php?a=Non_Alcoholic`
					);
					let jsonOfNonAlcoholicCocktails = await waitForNonAlcoholicCocktails.json();
					setStore({ nonAlcoholic: jsonOfNonAlcoholicCocktails.drinks });
				} catch (error) {
					console.log(error);
				}
			},

			searchCocktailsInfo: searchParam => {
				const cocktailStore = getStore().cocktails;
				const filteredName = cocktailStore.filter(cocktail =>
					cocktail.strDrink.toLowerCase().includes(searchParam.toLowerCase())
				);
				const filteredIngredient = cocktailStore.filter(cocktail =>
					cocktail.strIngredient1.toLowerCase().includes(searchParam.toLowerCase())
				);
				setStore({ filteredCocktails: filteredName });
				// setStore({ filteredCocktails: filteredIngredient });
			},

			getCocktailByID: async cocktailID => {
				const cocktailsEndPoint = `${process.env.APIURL}/${process.env.APIKEY}/lookup.php?i=${cocktailID}`;
				const response = await fetch(cocktailsEndPoint);
				const data = await response.json();
				setStore({ cocktails: data.drinks });
				return data.drinks.find(cocktail => true);
			},

			favoritesInfo: item => {
				let myFavorites = getStore().favorites;
				let selected = myFavorites.find(element => element === item);
				if (selected) {
					myFavorites = myFavorites.filter(element => item !== element);
					setStore({ favorites: myFavorites });
				} else {
					myFavorites = [...myFavorites, item];
					setStore({ favorites: myFavorites });
				}
				console.log(getStore().favorites);
			},

			getActiveUser: async email => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/user/active`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email })
					});
					const activeUser = await res.json();
					setStore({ activeUser: activeUser });
					sessionStorage.setItem("activeUser", activeUser.first_name);
				} catch (error) {
					throw Error("Wrong email or password");
				}
			},

			login: async (email, password) => {
				try {
					const res = await fetch(`${process.env.BACKEND_URL}/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password })
					});
					if (res.ok) {
						const token = await res.json();
						// localStorage.setItem("first_name", JSON.stringify(first_name));
						localStorage.setItem("token", JSON.stringify(token));
						console.log("The response is ok", res);
						getActions().getActiveUser(email);

						return true;
					} else {
						throw "Something went wrong";
					}
				} catch (error) {
					throw Error("Wrong email or password");
				}
			},

			ageCheck: date => {
				let currentDate = new Date();
				let currentYear = currentDate.getFullYear();
				let userDate = new Date(date);
				let userYear = userDate.getFullYear();
				let yearDiff = currentYear - userYear;
				if (yearDiff < 21) {
					console.log("You must be 21+ to sign up");
					return false;
				} else {
					console.log("");
					return true;
				}
			},

			// handleLogOut: () => {
			// 	localStorage.clear();
			// 	sessionStorage.clear();
			// 	history.push("/login");
			// },

			signup: async (email, password, first_name, last_name, date, setMessageState, history) => {
				console.log("I am the signup function");
				if (!getActions().ageCheck(date)) {
					setMessageState({ isActive: true, message: "You must be 21+ to sign up" });
					return;
				}

				console.log(first_name);

				try {
					const res = await fetch(`${process.env.BACKEND_URL}/user`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password, first_name, last_name, date })
					});
					if (res.ok) {
						const token = await res.json();

						// localStorage.setItem("first_name", JSON.stringify(first_name));
						localStorage.setItem("token", JSON.stringify(token));
						console.log("The response is ok", res);
						getActions().getActiveUser(email);
						history.push("/profile");

						return true;
					} else {
						throw "Something went wrong";
					}
				} catch (error) {
					throw Error("Something went wrong");
				}
			}
		}
	};
};

export default getState;
