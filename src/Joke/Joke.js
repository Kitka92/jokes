import React, { Component } from 'react';

class Joke extends Component {
	render() {
		return (
			<div>
				{/* <button>Up vote</button>
				<button>Down vote</button>
				<span>{this.props.score}</span> */}
				<p>{this.props.joke}</p>
				{/* <img /> */}
			</div>
		);
	}
}

export default Joke;
