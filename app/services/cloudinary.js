import Service from '@ember/service';
import config from 'civ/config/environment';

export default class CloudinaryService extends Service {

	deleteTokens = new Map();
	cloudinaryUrl = 'https://api.cloudinary.com/v1_1/' + config.cloudinary.cloudName;

	/**
	 * Upload an image to Cloudinary
	 * @param folder
	 * @param file
	 * @returns {Promise<string>} cloudinary id
	 */
	uploadImage(folder, file) {
		return this._sendUpload(folder, file, "image");
	}

	/**
	 * Upload a file to Cloudinary
	 * @param folder
	 * @param file
	 * @returns {Promise<string>} cloudinary id
	 */
	uploadFile(folder, file) {
		return this._sendUpload(folder, file, "raw");
	}

	/**
	 * Delete a recently uploaded Cloudinary file (10 minute window)
	 * Cloudinary API - https://cloudinary.com/documentation/upload_images#deleting_client_side_uploaded_assets
	 *
	 * @param publicId
	 * @returns {Promise<boolean>}
	 */
	async deleteRecentUpload(publicId) {
		if (!this.deleteTokens.has(publicId)) {
			// we don't have a delete token for this file
			return false;
		}

		const url = this.cloudinaryUrl  + '/delete_by_token ';

		const formData = new FormData();
		formData.append("token", this.deleteTokens.get(publicId));

		const response = await fetch(url, {
			method: 'POST',
			body: formData
		});
		return response.ok;
	}


	/**
	 * Uploads a file to Cloudinary
	 * Cloudinary API - https://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_rest_api
	 *
	 * @param folder string
	 * @param file File
	 * @param resourceType string Valid values: image, raw, video and auto to automatically detect the file type.
	 * @returns {Promise<string>} cloudinary id
	 */
	async _sendUpload(folder, file, resourceType) {
		// fetch required Cloudinary signature from backend
		const params = await this._fetchBackendSignature(folder);

		// prepare Cloudinary upload
		const formData = new FormData();
		formData.append("file", file);
		formData.append("api_key", config.cloudinary.api_key);
		formData.append("timestamp", params.timestamp);
		formData.append("signature", params.signature);
		formData.append("folder", params.folder);
		formData.append("return_delete_token", 'true');

		// resource_type is the type of file to upload. Valid values: image, raw, video and auto to automatically detect the file type.
		const url = this.cloudinaryUrl  + '/' + resourceType + '/upload';

		// upload to Cloudinary
		const response = await fetch(url, {
			method: "POST",
			body: formData
		});

		// bad request
		if (!response.ok) {
			throw response;
		}

		// get the public_id field from the response
		const json = await response.json();

		if (json.delete_token) {
			// save the delete token, this allows to directly delete the file from Cloudinary for 10 minutes
			this.deleteTokens.set(json.public_id, json.delete_token);
		}
		return json.public_id;
	}


	/**
	 * backend must sign the Cloudinary upload request
	 * @returns {Promise<any>}
	 */
	async _fetchBackendSignature(folder) {
		const baseUrl = '';
		// const baseUrl = (config.environment  === "local") ? "local_env/" : (config.environment  !== "production") ? "beta_env/" : "production_env/";
		const params = {
			timestamp: parseInt(Date.now() / 1000),
			type: baseUrl + folder,
			return_delete_token: 'true'
		};

		const url = config.APP.API_HOST + '/images/params';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});
		return response.json();
	}

}
