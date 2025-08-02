const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_USER_NAME||"dyp1dxd7a",
			api_key: process.env.CLOUDINARY_API_KEY||"619817595758421",
			api_secret: process.env.CLOUDINARY_API_SECRET|| "CKbzmVIiqxXjWi1e69lbnBt1TL0",
		});
		console.log('Cloudinary connected successfully')
	} catch (error) {
		console.log(error);
	}
};


