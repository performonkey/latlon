import { h, Component } from 'preact';
import throttle from 'lodash/throttle';
import Mapbox from 'mapbox';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import s from './style.css';

if (module.hot) {
	require('preact/debug');
}

const token =
	'pk.eyJ1IjoicGVyZm9ybW9ua2V5IiwiYSI6IllXakw0ZWcifQ.0QaI5ebzrL14wxgZvDshFw';
mapboxgl.accessToken = token;
const mapbox = new Mapbox(token);

export default class App extends Component {
	bindRef = x => {
		this.elem = x;
	};

	state = {
		pointLngLat: {
			lng: -0.13,
			lat: 51.5
		}
	};

	handleUpdateLngLat = throttle(
		e => this.setState({ pointLngLat: e.lngLat }),
		60
	);

	handleSearchPlace = e => {
		if (e.keyCode === 13) {
			mapbox.geocodeForward(e.target.value, (err, res) => {
				if (err) return;

				const place =
					res.features.find(x => x.place_type.includes('place')) ||
					res.features[0];
				if (!place) return;

				this.map.flyTo({
					center: place.center,
					maxDuration: 1
				});
			});
		}
	};

	componentDidMount() {
		const {
			pointLngLat: { lng, lat }
		} = this.state;
		this.map = new mapboxgl.Map({
			container: this.elem,
			style: 'mapbox://styles/performonkey/cj98392ko0kpq2sprbcg0gdg4',
			zoom: 12,
			center: [lng, lat]
		});

		this.map.on('mousemove', this.handleUpdateLngLat);
	}

	render() {
		const { pointLngLat } = this.state;
		const lat = pointLngLat.lat && pointLngLat.lat.toFixed(5);
		const lng = pointLngLat.lng && pointLngLat.lng.toFixed(5);

		return (
			<div className={s.app}>
				<input
					className={s.search}
					placeholder="Search place"
					onKeyDown={this.handleSearchPlace}
				/>
				<div className={s.map} ref={this.bindRef} />
				<div className={s.info}>
					<div>
						<b>Latitude, Longitude: </b>
						{lat}, {lng}
					</div>
					<div>
						<b>WKT: </b>
						POINT({lng} {lat})
					</div>
					<div>
						<b>GeoJSON: </b>
						{'{'} "type": "Point", "coordinates": [{lng}, {lat}] {'}'}
					</div>
					<div>
						<b>Wikipedia: </b>
						{'{{'}Coord|{lng}|{lat}|display=title{'}}'}
					</div>
				</div>
			</div>
		);
	}
}
