# DAREG Lab Client Testing Utility
DAREG Lab Client Testing Utility is a tool for testing the DAREG Lab Client. It is capable of creating, modifying, and deleting files in a directory structure.

## File generation
This utility can generate files in a directory structure. The files can be of a specified size, format, and nesting level. The files can be modified and deleted at a specified rate.

### How to run:

```
python main.py \
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

## Compare OneData Files With Local Files
The utility can compare files in a directory structure on OneData with files in a local directory. The files are compared by their content and size.

### How to run:

```bash
sudo python3 compare.py \
    --path /Users/davidkonecny/Documents/school/diplomova-prace/datareg/testing/out \
    --dir_id $DIR_ID \
    --auth_token $TOKEN \
    --provider_url https://oneprovider01.devel.onedata.e-infra.cz
```