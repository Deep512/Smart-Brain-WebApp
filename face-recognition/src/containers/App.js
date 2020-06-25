import React from "react";
import "./App.css";
import Navigation from "../components/Navigation/Navigation";
import Logo from "../components/Logo/Logo";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import Rank from "../components/Rank/Rank";
import Register from "../components/Register/Register";
import SignIn from "../components/SignIn/SignIn";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import { connect } from "react-redux";
import { setInputField } from "../actions/input";

const mapStateToProps = (state) => {
	return {
		input: state.input,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onInputChange: (event) => {
			dispatch(setInputField(event.target.value));
		},
	};
};

const app = new Clarifai.App({
	apiKey: "998f5196941e4e9f923a9d483ea74b8a",
});
const particlesOptions = {
	particles: {
		number: {
			value: 150,
			density: {
				enable: true,
				value_area: 700,
			},
		},
		interactivity: {
			detect_on: "canvas",
			events: {
				onhover: {
					enable: true,
					mode: "repulse",
				},
				onClick: {
					enable: true,
					mode: "repulse",
				},
			},
		},
	},
};

const initialState = {
	// input: "",
	imageUrl: "",
	boxes: [],
	box: {},
	route: "signin",
	isSignedIn: false,
	user: {
		id: "",
		name: "",
		email: "",
		entries: 0,
		joined: "",
	},
};
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			// input: "",
			imageUrl: "",
			boxes: [],
			box: {},
			route: "signin",
			isSignedIn: false,
			user: {
				id: "",
				name: "",
				email: "",
				entries: 0,
				joined: "",
			},
		};
	}
	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions;
		const image = document.getElementById("inputImage");
		const width = Number(image.width);
		const height = Number(image.height);
		var boxes = [];
		clarifaiFace.forEach((region) => {
			const face = region.region_info.bounding_box;
			const x = {
				leftCol: face.left_col * width,
				topRow: face.top_row * height,
				rightCol: width - face.right_col * width,
				bottomRow: height - face.bottom_row * height,
			};
			boxes.push(x);
		});
		return boxes;

		// return {
		// 	leftCol: clarifaiFace.left_col * width,
		// 	topRow: clarifaiFace.top_row * height,
		// 	rightCol: width - clarifaiFace.right_col * width,
		// 	bottomRow: height - clarifaiFace.bottom_row * height
		// };
	};

	displayFaceBox = (boxes) => {
		this.setState({ boxes: boxes });
	};

	// onInputChange = (event) => {
	// 	this.setState({ input: event.target.value });
	// };

	onPictureSubmit = () => {
		this.setState({ imageUrl: this.props.input });
		app.models
			.predict(Clarifai.FACE_DETECT_MODEL, this.props.input)
			.then((response) => {
				if (response) {
					fetch("http://localhost:3000/image", {
						method: "put",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) =>
							this.setState(Object.assign(this.state.user, { entries: count }))
						);
				}
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch((err) => console.log(err));
	};

	onRouteChange = (route) => {
		if (route === "signout") {
			this.setState(initialState);
		} else if (route === "home") {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	render() {
		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />
				<Navigation
					isSignedIn={this.state.isSignedIn}
					onRouteChange={this.onRouteChange}
				/>
				{this.state.route === "home" ? (
					<div>
						<Logo />
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.props.onInputChange}
							onPictureSubmit={this.onPictureSubmit}
						/>
						<FaceRecognition
							boxes={this.state.boxes}
							imageUrl={this.state.imageUrl}
						/>
					</div>
				) : this.state.route === "signin" ? (
					<SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
				) : (
					<Register
						onRouteChange={this.onRouteChange}
						loadUser={this.loadUser}
					/>
				)}
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
