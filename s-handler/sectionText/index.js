// [REQUIRE] //
const validator = require('validator')


// [REQUIRE] Personal //
const ActivityCollection = require('../../s-collections/ActivityCollection')
const CommentCollection = require('../../s-collections/CommentCollection')
const SectionTextCollection = require('../../s-collections/SectionTextCollection')


// [INIT] //
const location = '/s-handler/sectionText'


module.exports = {
	createSectionText: async ({ user_id, title, cleanJSON, }) => {
		try {
			// [VALIDATE] //
			if (!title || !cleanJSON ) {
				return {
					executed: true,
					status: false,
					location: `${location}/create`,
					message: `${location}: Invalid Params`,
				}
			}

			// [COLLECTION][SectionText][CREATE] //
			const STObj = await SectionTextCollection.c_create({
				user_id: user_id,
				title: title,
				cleanJSON: cleanJSON
			})

			if (!STObj.status) { return STObj }

			// [COLLECTION][Activity][CREATE] //
			const bPActivity = await ActivityCollection.c_create({
				user_id: user_id,
				type: 'sectionText',
				sectionText_id: STObj.createdSectionText._id,
				createdSectionText_id: STObj.createdSectionText._id,
				createdComment_id: undefined,
				createdPost_id: undefined,
				createdUser_id: undefined,
			})

			if (!bPActivity.status) { return bPActivity }

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				createdSectionText: STObj.createdSectionText,
				sectionTextActivity: bPActivity,
				message: 'CREATED SectionText'
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/create`,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	deleteSectionText: async ({ user_id, sectionText_id }) => {
		try {
			// [VALIDATE] //
			if (!validator.isAscii(sectionText_id)) {
				return {
					executed: true,
					status: false,
					location: `${location}/delete`,
					message: 'Invalid Params'
				}
			}

			// [COLLECTION][Post][DELETE] //
			const deletePostObj = await SectionTextCollection.c_deleteOne_byIdAndUser({
				sectionText_id: sectionText_id,
				user_id: user_id
			})

			if (!deletePostObj.status) { return deletePostObj }

			// [COLLECTION][Comments][DELETE] //
			const deleteCommentsObj = await CommentCollection.c_deleteAll_byPost({
				sectionText_id: sectionText_id
			})
			
			if (!deleteCommentsObj.status) { return deleteCommentsObj }
			

			// [COLLECTION][activity][DELETE] *Incomplete* //


			return {
				executed: true,
				status: true,
				location: `${location}/delete`,
				message: 'DELETED SectionText',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/delete`,
				message: `Error --> ${err}`,
			}
		}
	}
}