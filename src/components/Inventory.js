import React from 'react'
import AddFishForm from './AddFishForm'
import base from '../base'

class Inventory extends React.Component {
	constructor() {
		super()
		this.renderInventory = this.renderInventory.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.renderLogin = this.renderLogin.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.authHandler = this.authHandler.bind(this)
		this.logout = this.logout.bind(this)
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount() {
		base.onAuth(user => {
			if(user) {
				this.authHandler(null, { user })
			}
		})
	}

	handleChange(e, key) {
		const fish = this.props.fishes[key]
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		}
		this.props.updatedFish(key, updatedFish)
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's Inventory</p>
				<button className="github" onClick={() => this.authenticate('github')} >Login with github</button>
				<button className="facebook" onClick={() => this.authenticate('facebook')} >Login with facebook</button>
				<button className="twitter" onClick={() => this.authenticate('twitter')} >Login with twitter</button>
			</nav>
		)
	}

	authenticate(provider) {
		console.log(`Trying to login with ${provider}`)
		base.authWithOAuthPopup(provider, this.authHandler)
	}

	authHandler(err, authData) {
		if(err) {
			console.error(err)
			return;
		}

		const storeRef = base.database().ref(this.props.stateId)
		
		// query the firebase once for store data
		storeRef.once('value', snapshot => {
			const data = snapshot.val() || {}
			
			if(!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				})
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			})
		})
	}

	logout() {
		base.unauth();
		this.setState({
			uid:null
		})
	}

	renderInventory(key) {
		const fish = this.props.fishes[key]
		return (
			<div className="fish-edit" key={key}>
				<input type="text" placeholder="Fish Name" name="name" value={fish.name} onChange={(e) => this.handleChange(e, key)} />
				<input type="text" placeholder="Fish Price" name="price" onChange={(e) => this.handleChange(e, key)} value={fish.price} />
				<select value={fish.status} onChange={(e) => this.handleChange(e, key)} name="status">
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea value={fish.desc} onChange={(e) => this.handleChange(e, key)} name="desc" placeholder="Fish Desc" ></textarea>
				<input value={fish.image} onChange={(e) => this.handleChange(e, key)} name="image" type="text" placeholder="Fish Image" />
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	}

	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>

		if(!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}

		if(this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry you aren't the owner of this store!!</p>
					{logout}
				</div>
			)
		}

		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load more fishes</button>
			</div>
		)
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	updatedFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired,
}

export default Inventory