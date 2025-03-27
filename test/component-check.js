import { parse } from '@vue/compiler-sfc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m'
};

let total = 0;
let passed = 0;
let failed = 0;
let skipped = 0;

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`);
}

function isVueComponent(filename) {
	return filename.endsWith('.vue');
}

async function checkComponent(filepath) {
	try {
		const content = fs.readFileSync(filepath, 'utf-8');
		const { descriptor, errors } = parse(content);

		if (errors && errors.length > 0) {
			log(`  ✗ Failed to parse component: ${errors[0].msg}`, colors.red);
			return false;
		}

		if (!descriptor.template) {
			log('  ⚠ No template section found', colors.yellow);
		}

		if (!descriptor.script && !descriptor.scriptSetup) {
			log('  ⚠ No script section found', colors.yellow);
		}

		log('  ✓ Component structure is valid', colors.green);
		return true;
	} catch (error) {
		log(`  ✗ Error checking component: ${error.message}`, colors.red);
		return false;
	}
}

function hasLynxElements(filepath) {
	try {
		const content = fs.readFileSync(filepath, 'utf-8');
		return content.includes('<view') || content.includes('<text');
	} catch (error) {
		return false;
	}
}

async function runComponentChecks() {
	log('='.repeat(60), colors.blue);
	log('COMPONENT VALIDATOR', colors.blue);
	log('='.repeat(60), colors.blue);

	const files = fs
		.readdirSync(COMPONENTS_DIR)
		.filter(isVueComponent)
		.map((file) => path.join(COMPONENTS_DIR, file));

	total = files.length;
	log(`Found ${total} component(s) to check\n`, colors.cyan);

	for (const file of files) {
		const filename = path.basename(file);
		const isLynxComponent = hasLynxElements(file);

		log(
			`\nChecking component: ${filename} ${isLynxComponent ? '(Lynx)' : ''}`,
			isLynxComponent ? colors.magenta : colors.blue
		);
		log('-'.repeat(60), colors.blue);

		const result = await checkComponent(file);

		if (result) {
			passed++;
		} else {
			failed++;
		}
	}

	log('\n' + '='.repeat(60), colors.blue);
	log('SUMMARY', colors.blue);
	log('='.repeat(60), colors.blue);
	log(`Total: ${total}`, colors.cyan);
	log(`Passed: ${passed}`, colors.green);
	log(`Failed: ${failed}`, colors.red);
	log(`Skipped: ${skipped}`, colors.yellow);
	log('='.repeat(60), colors.blue);

	process.exit(failed > 0 ? 1 : 0);
}

runComponentChecks().catch((error) => {
	log(`Fatal error: ${error.message}`, colors.red);
	process.exit(1);
});
