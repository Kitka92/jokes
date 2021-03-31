import React, { Component } from 'react';
import axios from 'axios';
import Joke from '../Joke/Joke';
import './Jokes.css';

class Jokes extends Component {
	static defaultProps = {
		numJokesToGet: 10
	};
	state = {
		jokes: []
	};

	componentDidMount = async () => {
		let jokes = [];
		while (jokes.length < this.props.numJokesToGet) {
			try {
				const config = { headers: { Accept: 'application/json' } };
				const response = await axios.get('https://icanhazdadjoke.com/', config);
				jokes.push(response.data);
			} catch (e) {
				console.log('Something went wrong', e);
			}
		}
		console.log(jokes);
		this.setState({
			jokes: jokes
		});
	};

	render() {
		const jokes = this.state.jokes.map((j) => <Joke key={j.id} score={j.score} joke={j.joke} />);
		return (
			<div className="Jokes">
				<div className="Jokes-sidebar">
					<h1 className="Jokes-title">
						<span>Dad</span> Jokes
					</h1>
					<img
						alt="Funny face"
						src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
					/>
					<button className="Jokes-getMore">New Jokes</button>
				</div>

				<div className="Jokes-jokes">{jokes}</div>
			</div>
		);
	}
}

export default Jokes;