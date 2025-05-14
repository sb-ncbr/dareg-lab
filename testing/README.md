# DAREG Lab Client Testing Utility
DAREG Lab Client Testing Utility is a tool for testing the DAREG Lab Client. It is capable 
of creating, modifying, and deleting files in a directory structure.

## Requirements
- Python 3.6 or higher
  Activate the virtual environment and run the following command:
```bash
source .venv/bin/activate
```

## File generation
This utility can generate files in a directory structure. The files can be of a specified size, 
format, and nesting level. The files can be modified and deleted at a specified rate.

### How to run:
Run the main script with the following command:
```bash
python3 main.py \
  --directory /path/to/direcory \
  --max_file_size 52428800 \
  --min_file_size 2428800 \
  --max_nesting 5 \
  --min_nesting 2 \
  --file_format text \
  --time 120 \
  --modify \
  --delete \
  --ops_per_sec 0.1 \
  --clear
```

### Available arguments
- `directory [PATH]` - Specifies the output directory
- `max_file_size [SIZE_IN_BYTES]` - Specifies the generated file’s max size
- `min_file_size [SIZE_IN_BYTES]` - Specifies the generated file’s minimum size
- `max_nesting [INTEGER]` - Specifies the maximum nesting level tree nesting
- `min_nesting [INTEGER]` - Specifies the minimum nesting level tree nesting
- `file_format [text | bytes]` - Specifies the file format, either text or bytes
- `time [TIME_IN_SECONDS]` - Specifies the time to run the testing
- `modify` - flag if the modification of files operation should be performed 
- `delete` - flag if the deletion of files operation should be performed
- `ops_per_sec [FLOAT]` - operations per second that will be performed 
- `clear` - if the output directory should be cleared before running

## Compare OneData Files With Local Files
The utility can compare files in a directory structure on OneData with files in a local
directory. The files are compared by their content and size.

### How to run:
Run the compare script with the following command:
```bash
sudo python3 compare.py \
    --path /Users/davidkonecny/Documents/school/diplomova-prace/datareg/testing/out \
    --dir_id $DIR_ID \
    --auth_token $TOKEN \
    --provider_url https://oneprovider01.devel.onedata.e-infra.cz
```
### Available arguments
- `path [OUTPUT_PATH]` - Path to compare the Onedata content with
- `dir_id [ONE_DATA_DIRECTORY_ID]` - Onedata folder identifier
- `auth_token [ONEDATA_AUTH_TOKEN]` - Onedata auth token with access to content to compare
- `provider_url [PROVIDER_URL]` - Onedata provider URL where the content is located