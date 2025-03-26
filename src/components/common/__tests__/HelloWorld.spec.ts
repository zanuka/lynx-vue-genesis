/**
 * @vitest-environment jsdom
 */
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HelloWorld from './HelloWorld.vue';

describe('HelloWorld', () => {
	const renderComponent = (props = {}) => {
		return shallowMount(HelloWorld, {
			props: {
				msg: 'Default Test Message',
				...props
			}
		});
	};

	it('renders properly', () => {
		const wrapper = renderComponent();
		expect(wrapper.html()).toContain('Default Test Message');
	});

	it('displays custom message when provided', () => {
		const customMsg = 'Custom Hello Message';
		const wrapper = renderComponent({ msg: customMsg });
		expect(wrapper.html()).toContain(customMsg);
	});
});
