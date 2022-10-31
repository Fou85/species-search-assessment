import React, { useState } from 'react';
import PropTypes from 'prop-types';

const initialValues = {
	query: ''
}

const QueryForm = ({ change }) => {
	const [state, setState] = useState(initialValues);

	const handleChange = e => {
		let { value, name } = e.target;
		setState({
			...state,
			[name]: value
		});
	};

	const handleSubmit = () => {
		change(state);
		setState(initialValues);
	};

	return (
		<>
			<div className="row">
				<div className="col m6 s12">
					<label htmlFor="query"></label>
					<input
						id="query"
						name="query"
						type="string"
						placeholder="Search species"
						value={state.query}
						onChange={handleChange}
					/>
					<span>
						<button
						id="search-btn"
						className="btn-search"
						type="button"
						disabled={state.query === ''}
						onClick={handleSubmit}
					>
					Search
						</button>
					</span>
				</div>
			</div>
		</>
	);
};

QueryForm.propTypes = {
	change: PropTypes.func.isRequired
};

export default QueryForm;
