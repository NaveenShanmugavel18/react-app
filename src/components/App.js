import React from 'react'
import Header from './Header'
import Order from './Order'
import Inventory from './Inventory'
import sampleFishes from '../sample-fishes'
import Fish from './Fish'
import base from '../base'

class App extends React.Component {
	constructor() {
		super();

		this.addFish = this.addFish.bind(this)
		this.loadSamples = this.loadSamples.bind(this)
		this.addToOrder = this.addToOrder.bind(this)
		this.updatedFish = this.updatedFish.bind(this)
		this.removeFish = this.removeFish.bind(this)
		this.removeOrder = this.removeOrder.bind(this)

		// initial state
		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {
		// this runs before the app component is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		})

		// Check if there is any order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef) {
			this.setState({
				order: JSON.parse(localStorageRef)
			})
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref)
	}

	// this not called first time but called everytime when state and props are updated
	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
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

	updatedFish(key, updatedFish) {
		const fishes = {...this.state.fishes}
		fishes[key] = updatedFish
		this.setState({ fishes: fishes })
	}

	removeFish(key) {
		const fishes = {...this.state.fishes}
		fishes[key] = null
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

	removeOrder(key) {
		const order = {...this.state.order}
		delete order[key]
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
				<Order 
					fishes={this.state.fishes} 
					order={this.state.order} 
					params={this.props.params}
					removeOrder={this.removeOrder}
				/>
				<Inventory 
					addFish={this.addFish} 
					fishes={this.state.fishes} 
					loadSamples={this.loadSamples} 
					updatedFish={this.updatedFish}
					removeFish={this.removeFish}
					storeId={this.props.params.storeId}
				/>
			</div>
		)
	}
}

App.propTypes = {
	params: React.PropTypes.object
}

export default App