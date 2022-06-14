import { shallowMount } from '@vue/test-utils'
import WebContent from '../../src/components/dashboard/WebContent.vue'

describe('WebContent.vue', () => {
  it(
    'renders props.webApp when passed',
    () => {
      const wrapper = shallowMount(
        WebContent,
        {
          propsData: {
            webApp
          }
        }
      )
      expect(wrapper.text()).toMatch('Matches')
    }
  )
})
