# DAREG LAB Client
The repository contains the DAREG Lab Client application. The application is a desktop client for the DAREG API. It is built using [Tauri](https://tauri.studio/) and [React](https://reactjs.org/).

## Project structure
- `src-tauri` - Tauri application source code
- `src` - React application source code
- `public` - Static files
- `testing` - Testing utility for DAREG Lab Client file synchronization

## Config
To configure the application, place a file named `config.json` in the application's config directory.
The data directory is platform dependent. See bellow for platform specific config paths.

`config.json`
```json
{
  "dareg_url": "{DAREG_API_URL}",
  "token": "{DEVICE_TOKEN}"
}
```

- **DAREG_API_URL** - The URL of the DAREG API
- **DEVICE_TOKEN** - The token of the device generated in administrator interface DAREG


### Windows
`C:\Users\{USER}\AppData\Roaming\com.davidkonecny.dareg-lab-client`

### MacOs
`/Users/{USER}/Library/Application Support/com.davidkonecny.dareg-lab-client`

### Linux
`/home/{USER}/.local/share/com.davidkonecny.dareg-lab-client`

## Development
To run the application in development mode, run the following commands in the project's root directory.

### Prerequisites
The following prerequisites are required to run the application in development mode:
- [Node.js](https://nodejs.org/en/download/) (v18.0.0 or later)
- [Yarn](https://yarnpkg.com/getting-started/install) (v1.22.0 or later)
- [Rust](https://www.rust-lang.org/tools/install) (v1.60.0 or later)

### Install dependencies
``` shell
yarn install
```

### Start the application
To start the application, run the following command in the project's root directory:
``` shell
yarn tauri dev
```

## Generating the DAREG API client
To generate the DAREG API client, run the following command in the root of the repository:
``` shell
yarn gen:api
```
This command generates a TypeScript client to `/src/api.ts` for the DAREG API using the OpenAPI specification. 
The source for the OpenAPI specification can be configured in `orval.config.ts` file.

## Testing
### Frontend
To run the frontend tests, run the following command in the project's root directory:
``` shell
yarn test
```
### Backend
To run the backend tests, run the following command in the `src-tauri` directory:
``` shell
cargo test
```

### Testing utility
The testing utility is located in the `testing` directory. It is a Python script that can be used to test the DAREG Lab Client. 
The script can be used to generate files in a directory structure, modify files, and delete files. 
It can also compare files in a directory structure on OneData with files in a local directory. The documentation is located in the `testing/README.md` file.


## Build and package the application
The application is built and packaged using GitHub Actions. The build artifacts can be found on [Releases](https://github.com/CERIT-SC/dareg-lab/releases) page.
