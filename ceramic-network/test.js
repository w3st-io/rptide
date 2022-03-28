import { Core } from '@self.id/core'

//const core = new Core({ ceramic: 'testnet-clay' })

const core = new Core({
	ceramic: 'testnet-clay',
	model: {
		definitions: {
			profile: 'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
		},
	
		schemas: {
			Profile: 'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
		},
	
		tiles: {},
	}
})
  
  const profile = await core.get('profile', id)