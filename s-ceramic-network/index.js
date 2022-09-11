const { CeramicClient } = require('@ceramicnetwork/http-client')
const { DataModel } = require('@glazed/datamodel')


// [CERAMIC]
const ceramic = new CeramicClient()


// The model aliases associate human-readable names to Ceramic stream IDs or URLs
const glazedDataModel = new DataModel({
	ceramic: ceramic,
	model: {
		schemas: {
			BlogPost: 'ceramic://<schema URL>',
		},
		definitions: {},
		tiles: {
			examplePost: '<stream ID>',
		},
	}
})

async function testNode() {
	// The model exposes simple APIs over the provided model aliases
	//const blogPostSchemaURL = model.getSchemaURL('BlogPost')
	//console.log(blogPostSchemaURL)
	
	// Individual tiles defined in the model aliases can be loaded using the alias
	const examplePost = await glazedDataModel.loadTile('examplePost')
	console.log(examplePost)
	
	// New tiles can be created using the defined schema aliases
	const newPost = await glazedDataModel.createTile(
		'BlogPost',
		{
			title: 'new post',
			text: 'Hello world'
		}
	)
}

testNode()