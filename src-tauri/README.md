# DAREG LAB Client

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
- **DEVICE_TOKEN** - The token of the device generated in DAREG


### Windows
TODO

### MacOs
`/Users/{USER}/Library/Application Support/com.davidkonecny.dareg-lab-client`

### Linux
TODO

## Development

To run the application in development mode, run the following commands in the project's root directory.

### Install dependencies
``` shell
yarn install
```

### Start the application
To start the application, run the following command in the project's root directory:
``` shell
yarn tauri dev
```

## Build and package the application
The application is built and packaged using GitHub Actions. The build artifacts can be found on [Releases](https://github.com/CERIT-SC/dareg-lab/releases) page.
