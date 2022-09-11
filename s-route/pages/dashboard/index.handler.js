// [REQUIRE]
const validator = require('validator');


// [REQUIRE] Personal
const ProductOptionCollection = require('../../../s-collections/ProductOptionCollection');
const ProductCollection = require('../../../s-collections/ProductCollection');
const config_const = require('../../../s-config/const');
const h_apiSubscription = require('../../api/api-subscription/.handler.js');


// [CONST] //
const location = '/pages/dashboard/index';


module.exports = {
	/**
	 * @notice Dashboard Page Handler
	 * @param {string} req.params.tab
	 * @param {string} req.params.sort
	 * @param {string} req.params.page
	 * @param {string} req.params.limit
	 * @returns {object} Object that is requested
	*/
	index: async ({ req }) => {
		try {
			if (
				!validator.isAscii(req.params.tab) ||
				!validator.isAscii(req.params.sort) ||
				!validator.isAscii(req.params.page) ||
				!validator.isAscii(req.params.limit)
			) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid Params'
				};
			}

			// [INIT] //
			const sort = parseInt(req.params.sort);
			const limit = parseInt(req.params.limit);
			const pageIndex = parseInt(req.params.page) - 1;
			const skip = pageIndex * limit;

			const apiSubscriptionTier = await h_apiSubscription.getSubscriptionTier({
				user_id: req.user_decoded._id,
			});

			switch (req.params.tab) {
				case 'api':
					return {
						executed: true,
						status: true,
						location: location,
					};
				break;

				case 'web-content':
					return {
						executed: true,
						status: true,
						location: location,
					};
				break;

				case 'product':
					const productsObj = await ProductCollection.c_readAll_sorted_byUser({
						user_id: req.user_decoded._id,
					});

					productsObj.limit = config_const.limit;
					productsObj.apiSubscriptionTier = apiSubscriptionTier;

					return productsObj;
				break;

				case 'product-options':
					const productOptionssObj = await ProductOptionCollection.c_readAll_sorted_byUser({
						user_id: req.user_decoded._id,
					});

					productOptionssObj.limit = config_const.limit;
					productOptionssObj.apiSubscriptionTier = apiSubscriptionTier;

					return productOptionssObj;
				break;

				
				default:
					return {
						executed: true,
						status: false,
						location: location,
						message: 'Invalid tab'
					};
				break;
			}

		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`
			};
		}
	}
}