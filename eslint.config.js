import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	eslint.configs.recommended,

	// Node.js related rules
	nodePlugin.configs['flat/recommended-module'],
	{
		rules: {
			'n/file-extension-in-import': ['error', 'always'],
			'n/prefer-node-protocol': 'error',
			'n/no-extraneous-import': [
				'error',
				{
					allowModules: ['vitest']
				}
			],
			'n/no-unpublished-import': 'off',
			'n/no-missing-import': 'off',
			'n/hashbang': 'off'
		}
	},

	// Unicorn plugin rules for better code quality
	{
		plugins: {
			unicorn: eslintPluginUnicorn
		},
		rules: {
			'unicorn/consistent-function-scoping': 'error',
			'unicorn/empty-brace-spaces': 'error',
			'unicorn/expiring-todo-comments': 'error',
			'unicorn/no-abusive-eslint-disable': 'error',
			'unicorn/no-anonymous-default-export': 'error',
			'unicorn/no-array-callback-reference': 'error',
			'unicorn/no-array-push-push': 'error',
			'unicorn/no-await-expression-member': 'error',
			'unicorn/no-await-in-promise-methods': 'error',
			'unicorn/no-console-spaces': 'error',
			'unicorn/no-hex-escape': 'error',
			'unicorn/no-invalid-remove-event-listener': 'error',
			'unicorn/no-lonely-if': 'error',
			'unicorn/no-negated-condition': 'error',
			'unicorn/no-nested-ternary': 'error',
			'no-nested-ternary': 'off',
			'unicorn/no-new-array': 'error'
		}
	},

	// Import plugin for managing imports
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	{
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json'
				}
			},
			'import/internal-regex': '^@lynx-js/'
		},
		rules: {
			'import/no-commonjs': 'error',
			'import/no-cycle': 'error',
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/order': [
				'error',
				{
					groups: [
						'builtin', // Built-in imports (come from NodeJS native) go first
						'external', // <- External imports
						'internal', // <- Absolute imports
						['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
						'index', // <- index imports
						'unknown' // <- unknown
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			],
			'import/consistent-type-specifier-style': 'warn',
			'sort-imports': [
				'error',
				{
					ignoreCase: false,
					ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					allowSeparatedGroups: true
				}
			]
		}
	},

	// Global settings
	{
		languageOptions: {
			globals: {
				...globals.nodeBuiltin,
				...globals.es2021
			}
		},
		linterOptions: {
			reportUnusedDisableDirectives: true
		}
	},

	// TypeScript-specific configuration
	{
		files: ['**/*.ts', '**/*.tsx'],
		ignores: ['**/*.md/**'],
		extends: [
			tseslint.configs.eslintRecommended,
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked
		],
		plugins: {
			'@typescript-eslint': tseslint.plugin
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				projectService: {
					allowDefaultProject: ['./*.js'],
					defaultProject: './tsconfig.json'
				},
				tsconfigRootDir: import.meta.dirname
			}
		}
	},

	// JavaScript-specific configuration
	{
		files: ['**/*.{js,jsx,cjs,mjs}'],
		extends: [tseslint.configs.disableTypeChecked],
		rules: {
			// turn off type-aware rules
			'deprecation/deprecation': 'off',
			'@typescript-eslint/internal/no-poorly-typed-ts-props': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off'
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true
				},
				jsxPragma: null
			}
		}
	},

	// Browser environment config for specific directories
	{
		files: [
			'e2e/**',
			'examples/**/*.{js,mjs,cjs,jsx,ts,tsx}',
			'website/**/*.{js,mjs,cjs,jsx,ts,tsx}'
		],
		languageOptions: {
			globals: globals.browser,
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				},
				jsxPragma: null
			}
		}
	},

	// Vitest testing configuration
	{
		files: ['**/*.test.ts', '**/*.test-d.ts'],
		plugins: {
			vitest
		},
		rules: {
			...vitest.configs.recommended.rules
		},
		settings: {
			vitest: {
				typecheck: true
			}
		},
		languageOptions: {
			globals: {
				...vitest.environments.env.globals
			}
		}
	},

	// CommonJS configuration
	{
		files: ['**/*.cjs'],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021
			},
			parserOptions: {
				sourceType: 'commonjs'
			}
		},
		rules: {
			'import/no-commonjs': 'off'
		}
	},

	// Turning off rules already handled by Biome
	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/adjacent-overload-signatures': 'off',
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'default-param-last': 'off',
			'@typescript-eslint/default-param-last': 'off',
			'no-empty': 'off',
			'no-empty-static-block': 'off',
			'no-empty-function': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-extra-non-null-assertion': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-invalid-void-type': 'off',
			'@typescript-eslint/no-misused-new': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'no-redeclare': 'off',
			'@typescript-eslint/no-redeclare': 'off',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/no-unnecessary-type-constraint': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': 'off',
			'no-useless-constructor': 'off',
			'@typescript-eslint/no-useless-constructor': 'off',
			'@typescript-eslint/no-useless-empty-export': 'off',
			'no-throw-literal': 'off',
			'@typescript-eslint/only-throw-error': 'off',
			'@typescript-eslint/prefer-as-const': 'off',
			'@typescript-eslint/prefer-enum-initializers': 'off',
			'@typescript-eslint/prefer-for-of': 'off',
			'@typescript-eslint/prefer-function-type': 'off',
			'@typescript-eslint/prefer-literal-enum-member': 'off',
			'@typescript-eslint/prefer-optional-chain': 'off',
			'@typescript-eslint/require-await': 'off'
		}
	},

	// Project-specific customizations
	{
		rules: {
			// Add any project-specific rule overrides here
			indent: ['error', 'tab'], // Enforce tabs for indentation
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single', { avoidEscape: true }],
			semi: ['error', 'true']
		}
	}
];
