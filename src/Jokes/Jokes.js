import React, { Component } from 'react';
import axios from 'axios';
import Joke from '../Joke/Joke';
import './Jokes.css';

class Jokes extends Component {
	static defaultProps = {
		numJokesToGet: 10
	};

	state = {
		jokes: JSON.parse(localStorage.getItem('jokes')) || [],
		loading: false
	};

	seenJokes = new Set(this.state.jokes.map((j) => j.joke));

	componentDidMount = () => {
		if (this.state.jokes.length === 0) {
			this.getJokes();
		}
	};

	getJokes = async () => {
		try {
			let jokes = [];
			while (jokes.length < this.props.numJokesToGet) {
				const config = { headers: { Accept: 'application/json' } };
				const response = await axios.get('https://icanhazdadjoke.com/', config);
				const newJoke = response.data.joke;
				if (!this.seenJokes.has(newJoke)) {
					jokes.push({ joke: newJoke, score: 0, id: response.data.id });
					this.seenJokes.add(newJoke);
				} else {
					console.log('FOUND A DUPLICATE!');
					console.log(newJoke);
				}
			}

			this.setState(
				(st) => {
					return {
						jokes: [ ...st.jokes, ...jokes ],
						loading: false
					};
				},
				() => localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
			);
		} catch (e) {
			alert(e);
			this.setState({ loading: false });
		}
	};

	handleVotes = (id, delta) => {
		this.setState(
			(st) => {
				return {
					jokes: st.jokes.map((j) => (j.id === id ? { ...j, score: j.score + delta } : j))
				};
			},
			() => localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
		);
	};

	addJokes = () => {
		this.setState({ loading: true }, this.getJokes);
	};

	render() {
		if (this.state.loading) {
			return (
				<div className="Jokes-spinner">
					<i className="far fa-8x fa-laugh fa-spin" />
					<h1 className="Jokes-title">Loading...</h1>
				</div>
			);
		}
		const sortedJokes = this.state.jokes.sort((a, b) => b.score - a.score);
		const jokes = sortedJokes.map((j) => (
			<Joke
				key={j.id}
				score={j.score}
				joke={j.joke}
				upvote={this.handleVotes.bind(this, j.id, 1)}
				downvote={this.handleVotes.bind(this, j.id, -1)}
			/>
		));
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
					<button className="Jokes-getMore" onClick={this.addJokes}>
						Fetch Jokes
					</button>
				</div>

				<div className="Jokes-jokes">{jokes}</div>
			</div>
		);
	}
}

export default Jokes;
