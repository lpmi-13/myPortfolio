'use strict';

var angular = require('angular');
var template = require('./play.html');

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Rx = require('rx');

// sub components
var headerComponent = require('../../components/header/header');
var footerComponent = require('../../components/footer/footer');

// directive name:
//		namespaceTypeName (examples: wtComponentAvatar or dinoViewPlay )
// 
// template use:
// <namespace:type-name></namespace:type-name> (examples: <wt:component-avatar></wt:component-avatar> or <dino:view-play></dino:view-play> )

module.exports = angular.module('myApp.views.play', [
	headerComponent.name,
	footerComponent.name
])
.directive('myViewPlay', function (
) {
	return {
		restrict: 'E',
		template: template,
		controller: 'MyViewPlayCtrl as Play',
		replace: true,
		scope: {
			key: '='
		},
		link: function (scope, elem, attrs, controller) {
		}
	};
})
.controller('MyViewPlayCtrl', function (
) {
	// var Play = this;


	/* ********************
		 Constants
	******************** */

	const FLICKR_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
	const FLICKR_KEY = '145497634e565c0f3845ec7913e64f45';
	const FLICKR_IMAGE_SIZE_SMALL = 's';
	const FLICKR_IMAGE_SIZE_LARGE = 'b';

	/* ********************
		 Private methods
	******************** */

	function getFlickrImageUrl (item, size = FLICKR_IMAGE_SIZE_LARGE) {
		return `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_${size}.jpg`;
	}

	function searchFlickr (term, num = 3) {
		return $.ajax({
			url: FLICKR_URL,
			dataType: 'json',
			data: {
				api_key: FLICKR_KEY,
				nojsoncallback: 1,
				per_page: num,
				format: 'json',
				tags: term
			}
			}).promise();
	}

	function searchWikipedia (term) {
		return $.ajax({
			url: 'https://en.wikipedia.org/w/api.php',
			dataType: 'jsonp',
			data: {
				action: 'opensearch',
				format: 'json',
				search: term
			}
			}).promise();
	}

	/* ********************
		 React components (split into different files)
	******************** */

	let Photo = React.createClass({
		render: function () {
			return (
				<img className="photo" src={this.props.data.url} title={this.props.data.description} />
			)
		}
	});

	let PhotoResults = React.createClass({

		render: function() {
		let resultNodes = [];
			if (this.props.results) {
				resultNodes = this.props.results.map(function(result) {
					return (
						<Photo data={result} key={result.id} />
					);
				});
			}
			return (
				<div className="photoresults">
				{resultNodes}
				</div>
			);
		}
	});

	let SearchResult = React.createClass({
		render: function () {
			return (
				<div className="result">
					<hr/>
					<h3>{this.props.data.val} <a href={this.props.data.url}>read more</a></h3>
					<p>{this.props.data.description}</p>
				</div>
			)
		}
	});

	let SearchResults = React.createClass({

		render: function() {
			let resultNodes = [];
			if (this.props.results) {
				resultNodes = this.props.results.map(function(result) {
					return (
						<SearchResult data={result} key={result.id} />
					);
				});
			}
			
			return (
				<div className="searchresults">
				{resultNodes}
				</div>
			);
		}
	});

	let SearchBox = React.createClass({

		componentDidMount: function () {

			let keyups = Rx.Observable.fromEvent($('input'), 'keyup')
				.pluck('target', 'value')
				.filter( (text) => {
					return text.length > 2;
				});

			/* Now debounce the input for 500ms */
			let debounced = keyups
				.debounce(500 /* ms */);

			/* Now get only distinct values, so we eliminate the arrows and other control characters */
			let distinct = debounced
				.distinctUntilChanged();

			let suggestions = distinct
				.flatMapLatest(searchWikipedia);

			let photoSuggestions = distinct
				.flatMapLatest( (term) => {
					return searchFlickr(term, 6);
				});

			suggestions.subscribe( data => {
					// wikipedia results come back in 3 separate arrays
					// with shared index...
					let values = data[1];
					let descriptions = data[2];
					let links = data[3];
					// ...so lets merge them into one manageable array
					let results = values.map( (value, index) => {
						return {
							id: value,
							val: value,
							description: descriptions[index],
							url: links[index]
						};
					});

					this.setState({results: results});
				}, error => {
					console.warn(error);
				});

			photoSuggestions.subscribe( (data) => {
					let results = data.photos.photo.map( (item, index) => {
						return {
							id: item.id,
							description: item.title,
							url: getFlickrImageUrl(item, FLICKR_IMAGE_SIZE_SMALL)
						};
					});

					this.setState({photos: results});
				}, (error) => {
					console.warn(error);
				});
		},

		getInitialState: function() {
			return {
				results: [],
				photos: []
			};
		},

		handleInputKeyUp: function (e) {
			var text = e.target.value;
			this.setState({lookUpValue: text});

			return e;
		},
		render: function () {
			return (
				<div className="searchbox">
				<h3>Searching wikipedia and flickr... with React and RxJS</h3>
				<fieldset className="my-skin-form">
					<label>
						<input-title>Type something</input-title>
						<input type="text" onKeyUp={this.handleInputKeyUp} />
					</label>
				</fieldset>
				<hr />
				<PhotoResults results={this.state.photos} />
				<SearchResults results={this.state.results} />
				</div>
			)
		}
	});

	ReactDOM.render(
		<SearchBox />,
		document.getElementById('play-react-content')
	);



});