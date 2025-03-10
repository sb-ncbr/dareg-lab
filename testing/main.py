import os
import random
import string
import time
import argparse

reuse_folder_probability = 0.8
delete_file_probability = 0.1
modify_file_probability = 0.3

def random_string(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def create_random_file(path, min_size, max_size, file_format):
    size = random.randint(min_size, max_size)
    mode = 'wb' if file_format == 'binary' else 'w'
    content = os.urandom(size) if file_format == 'binary' else ''.join(random.choices(string.printable, k=size))

    with open(path, mode) as f:
        f.write(content if file_format == 'text' else content)
    log_operation(f"Created file: {path} ({size} bytes)")


def modify_random_file(file_paths, file_format):
    if not file_paths:
        return

    modification_type = random.choice(["append", "truncate", "modify"])
    file_path = random.choice(file_paths)

    if modification_type == "modify":
        with open(file_path, 'r+b') as f:
            file_size = os.path.getsize(file_path)
            if file_size == 0:
                return

            offset = random.randint(0, file_size)
            f.seek(offset)
            new_content = random_string(100).encode() if file_format == 'text' else os.urandom(100)
            f.write(new_content)
        log_operation(f"Modified file (modify): {file_path}")

    if modification_type == "append":
        mode = 'a' if file_format == 'text' else 'ab'
        content = random_string(100) if file_format == 'text' else os.urandom(100)

        with open(file_path, mode) as f:
            f.write(content)
        log_operation(f"Modified file (append): {file_path}")

    if modification_type == 'truncate':
        with open(file_path, 'r+b') as f:
            size = random.randint(0, os.path.getsize(file_path))
            f.truncate(size)
        log_operation(f"Modified file (truncate): {file_path}")


def delete_random_file(file_paths):
    if not file_paths:
        return
    file_path = random.choice(file_paths)
    if os.path.exists(file_path):
        os.remove(file_path)
        file_paths.remove(file_path)
        log_operation(f"Deleted file: {file_path}")


def run_simulation(base_dir, min_size, max_size, max_nesting, min_nesting, file_format, modify, delete, duration,
                   operations_per_second, clear):
    if clear and os.path.exists(base_dir):
        for root, dirs, files in os.walk(base_dir, topdown=False):
            for file in files:
                os.remove(os.path.join(root, file))
            for dir in dirs:
                os.rmdir(os.path.join(root, dir))
        log_operation(f"Cleared directory: {base_dir}")

    start_time = time.time()
    file_paths = []
    directories = [base_dir]

    while time.time() - start_time < duration:
        if directories and random.random() < reuse_folder_probability:  # 70% chance to reuse an existing directory
            path = random.choice(directories)
        else:
            depth = random.randint(min_nesting, max_nesting)
            path = base_dir
            for _ in range(depth):
                subdir = random_string(8)
                path = os.path.join(path, subdir)
                os.makedirs(path, exist_ok=True)
            directories.append(path)

        file_name = f"{random_string(8)}.txt" if file_format == 'text' else f"{random_string(8)}.bin"
        file_path = os.path.join(path, file_name)
        create_random_file(file_path, min_size, max_size, file_format)
        file_paths.append(file_path)
        time.sleep(1 / operations_per_second)  # Sequential file creation delay

        if modify and random.random() < modify_file_probability:
            modify_random_file(file_paths, file_format)
        if delete and random.random() < delete_file_probability:
            delete_random_file(file_paths)

    print_result(base_dir)


def print_result(base_dir):
    print("Final Directory Structure:")
    for root, dirs, files in os.walk(base_dir):
        level = root.replace(base_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")


def log_operation(message):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    with open("operations.log", "a") as log_file:
        log_file.write(f"[{timestamp}] {message}\n")
    print(message)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Random File Simulation Script")
    parser.add_argument("--directory", type=str, required=True, help="Base directory to perform operations")
    parser.add_argument("--max_file_size", type=int, required=True, help="Maximum file size in bytes")
    parser.add_argument("--min_file_size", type=int, required=True, help="Minimum file size in bytes")
    parser.add_argument("--max_nesting", type=int, required=True, help="Maximum directory nesting level")
    parser.add_argument("--min_nesting", type=int, required=True, help="Minimum directory nesting level")
    parser.add_argument("--file_format", type=str, choices=["binary", "text"], required=True,
                        help="File format (binary or text)")
    parser.add_argument("--modify", action="store_true", help="Modify some generated files")
    parser.add_argument("--delete", action="store_true", help="Delete some files randomly")
    parser.add_argument("--time", type=int, required=True, help="Time duration to run the script in seconds")
    parser.add_argument("--ops_per_sec", type=float, required=False, help="Amount of operations per second", default=1)
    parser.add_argument("--clear", action="store_true", help="Clear the base directory before starting")

    args = parser.parse_args()
    run_simulation(args.directory, args.min_file_size, args.max_file_size, args.max_nesting, args.min_nesting,
                   args.file_format, args.modify, args.delete, args.time, args.ops_per_sec, args.clear)