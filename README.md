# wild-circus #

The wild-circus project is a (fictitious) project whose objective is the 
creation of a showcase site for a circus.

## Project Structure
``` bash
.
├── config/
│   ├── config.js                             # Main project config
├── src/
│   ├── main.js                               # App entry file
│   └── assets/                               # Module assets (processed by webpack)
│   └── icons/                                # Icons used by webpack notifiier
├── public/                                   # Store html file and favicon
├── .babelrc                                  # Babel config
├── .eslintrc                                 # Eslint config
├── .gitignore                                # Sensible defaults for gitignore
├── .postcssrc                                # Postcss config
├── sass-lint.yml                             # sass lint config
├── wm.webpack.js                             # Manage webpack configuration
├── package.json                              # Build scripts and dependencies
└── README.md                                 # Default README file
```

## Getting Started

### Prerequisites

1. Check node is installed
2. Check yarn or npm is installed

### Install

1. Clone this project
3. Run `npm install` or `yarn install`

### Working

1. Run `yarn run serve` to launch webpack dev server
2. Run `yarn run dev` to build project in development environment
3. Run `yarn run watch` to build project in development environment (continuous)
4. Run `yarn run build` to build project

## Versioning
