import React from 'react'
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import sampleFishes from '../sample-fishes'
import Fish from './Fish'

class App extends React.Component {
	constructor() {
		super();

		this.addFish = this.addFish.bind(this)
		this.loadSamples = this.loadSamples.bind(this)
		this.addToOrder = this.addToOrder.bind(this)

		// initial state
		this.state = {
			fishes: {},
			order: {}
		};
	}

	addFish(fish) {
		// Best practice to get a copy of fishes
		const fishes = {...this.state.fishes}
		let timestamp = Date.now()
		// add fish
		fishes[`fish-${timestamp}`] = fish
		// update state
		this.setState({ fishes: fishes })
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		})
	}

	addToOrder(key) {
		const order = {...this.state.order}
		order[key] = order[key] + 1 || 1;
		this.setState({ 
			order: order
		})
	}

	render() {
		return(
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} /> )
						}
					</ul>
				</div>
				<Order />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
			</div>
		)
	}
}

export default App