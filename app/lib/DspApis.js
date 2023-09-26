const axios = require('axios');
const RedisUtils = require('../helpers/RedisUtils');
const moment = require('moment');
const ValidationError = require('../errors/ValidationError');

class ApiHttp {
	dpdGeoSession = 'dpd_geo_session';
	dhlBasicAuth = 'dhl_basic_auth';
	geoClient = process.env.DPD_GEO_CLIENT;
	dpdUserName = process.env.DPD_USERNAME;
	dpdPassword = process.env.DPD_PASSWORD;

    // Function to make a GET request
	async get(url, headers) {
        const config = {
            headers
        };
        const response = await axios.get(`${url}`, config);
        return response.data;
    }

    // Function to make a POST request
    async post(url, headers, requestData = {}, bodyType = 'json') {
        //contentType = 'application/x-www-form-urlencoded',
        const config = {
            headers
        };
        const response = await axios.post(
			`${url}`,
			bodyType === 'json' ? JSON.stringify(requestData) : requestData,
			config
		);
        return response.data;
    }
};

class DPD extends ApiHttp {
	async checkGeoSessionExpired() {
		const geoSessionData = await RedisUtils.getByToken(this.dpdGeoSession);
		if (!geoSessionData || !geoSessionData?.geoSession) return false;
		const now = moment(new Date(), 'MM/D/YYYY');
		const end = moment(new Date(geoSessionData.generated_at), 'MM/D/YYYY');
		return now.isSame(end, 'date');
	}

	async requestNewGeoSession() {
		try {
			const tempString = this.dpdUserName + ':' + this.dpdPassword;
			const geoSession = Buffer.from(tempString).toString('base64');
			const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${geoSession}`
			};
			const result = await this.post(
				`${process.env.DPD_BASE_URL}/user/?action=login`,
				headers
			);
			const obj = {
				geoSession: result.data.geoSession,
				generated_at: new Date()
			}
			await RedisUtils.add(this.dpdGeoSession, obj);
			return result.data;
		} catch (err) {
			throw new Error(err);
		}
	}

	async shipmentApi(reqData) {
		try {
			if (!await this.checkGeoSessionExpired()) {
				await this.requestNewGeoSession();
			}
			const geoSessionData = await RedisUtils.getByToken(this.dpdGeoSession);
			const geoSession = geoSessionData.geoSession;
			const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
				'GeoClient': `${this.geoClient}`,
                'GeoSession': `${geoSession}`
			};
			const result = await this.post(
				`${process.env.DPD_BASE_URL}/shipping/shipment`,
				headers,
                reqData
			);
            if(result.data) {
                return result.data;
            } else if(result.error.length) {
				console.log("DPD Shipment Err :::", result?.error[0]);
                throw new ValidationError('validation_error', {
					message: result?.error[0]?.errorMessage ? 
					`${result?.error[0]?.errorMessage} - ${result?.error[0]?.obj}` : 
					'Validation Error',
				})
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async shipmentLabel(shipmentId) {
		try {
			if (!await this.checkGeoSessionExpired()) {
				await this.requestNewGeoSession();
			}
			const geoSessionData = await RedisUtils.getByToken(this.dpdGeoSession);
			const geoSession = geoSessionData.geoSession;
			const headers = {
                'Content-Type': 'application/json',
                'Accept': 'text/vnd.citizen-clp;',
                // 'Accept': 'text/html',
				'GeoClient': `${this.geoClient}`,
                'GeoSession': `${geoSession}`
			};
			const result = await this.get(
				`${process.env.DPD_BASE_URL}/shipping/shipment/${shipmentId}}/label`,
				headers,
			);
            if(result && !result.error) {
                return result;
            } else if(result.error.length) {
				console.log("DPD Shipment Label Err :::", result?.error[0]);
                throw new ValidationError('validation_error', {
					message: result?.error[0]?.errorMessage ? 
					`${result?.error[0]?.errorMessage}${result?.error[0]?.obj ? ' - ' + result?.error[0]?.obj : ''}` : 
					'Validation Error',
				})
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async shipmentTracking(trackingNumber) {
		try {
			const headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/json',
			};
			const xmlBodyStr = `<?xml version="1.0" encoding="UTF-8"?>
			<trackingrequest>
			<user>${this.dpdUserName}</user>
			<password>${this.dpdPassword}</password>
			<trackingnumbers>
			<trackingnumber>${trackingNumber}</trackingnumber>
			</trackingnumbers>
			</trackingrequest>`;
			const result = await this.post(
				`${process.env.DPD_TRACKING_URL}`,
				headers,
				xmlBodyStr,
				'xml'
			);
			return result;
		} catch (err) {
			console.log('DPD Shipment Tracking API :::', err);
			throw new Error(err);
		}
	}
}

module.exports = { DPD };