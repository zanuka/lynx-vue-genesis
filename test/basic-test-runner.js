import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

globalThis.customElements = {
	define: () => {},
	get: () => null,
	whenDefined: () => Promise.resolve()
};

const componentsToTest = [
	{ name: 'HelloWorld', props: { msg: 'Test Message' } },
	{ name: 'LynxCounter', props: {} }
];

const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m'
};

async function testComponent(componentName, props = {}) {
	console.log(`${colors.blue}Testing ${componentName}...${colors.reset}`);

	try {
		const componentPath = path.join(COMPONENTS_DIR, `${componentName}.vue`);

		if (!fs.existsSync(componentPath)) {
			console.log(
				`${colors.yellow}Component file not found: ${componentPath}${colors.reset}`
			);
			return false;
		}

		console.log(
			`${colors.green}✓ Component file exists: ${componentName}.vue${colors.reset}`
		);
		return true;
	} catch (error) {
		console.error(
			`${colors.red}✗ Error testing ${componentName}: ${error.message}${colors.reset}`
		);
		return false;
	}
}

async function runTests() {
	console.log(`${colors.blue}Starting simple component tests${colors.reset}`);
	console.log('-'.repeat(40));

	let passed = 0;
	let failed = 0;

	for (const component of componentsToTest) {
		const result = await testComponent(component.name, component.props);
		if (result) {
			passed++;
		} else {
			failed++;
		}
		console.log('-'.repeat(40));
	}

	console.log(`${colors.blue}Test Results:${colors.reset}`);
	console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
	console.log(`${colors.red}Failed: ${failed}${colors.reset}`);

	process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
	console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
	process.exit(1);
});
