# DAREG Lab Client Testing Utility
DAREG Lab Client Testing Utility is a tool for testing the DAREG Lab Client. It is capable of creating, modifying, and deleting files in a directory structure.

## How to run:

```
python main.py \
  --directory /Users/davidkonecny/Documents/school/diplomova-prace/datareg/testing/out \
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