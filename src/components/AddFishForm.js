import React from 'react'

class AddFishForm extends React.Component {

	createFish(e) {
		e.preventDefault()

		const fish = {
			name: this.name.value ? this.name.value : '',
			price: this.price.value ? this.price.value : '',
			status: this.status.value ? this.status.value : '',
			desc: this.description.value ? this.description.value : '',
			image: this.image.value ? this.image.value : '',
		}
		this.props.addFish(fish)
		this.fishForm.reset()
	}

	render() {
		return (
			<form ref={(input) => this.fishForm = input } action="" className="fish-edit" onSubmit={(e) => this.createFish(e)}>
				<input type="text" placeholder="Fish Name" ref={(input) => {this.name = input}} />
				<input type="text" placeholder="Fish Price" ref={(input) => {this.price = input}} />
				<select ref={(input) => {this.status = input}}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea ref={(input) => {this.description = input}} placeholder="Fish Desc"></textarea>
				<input ref={(input) => {this.image = input}} type="text" placeholder="Fish Image"/>
				<button type="submit">+ Add Item</button>
			</form>
		)
	}
}

AddFishForm.propTypes = {
	addFish: React.PropTypes.func.isRequired
}

export default AddFishForm