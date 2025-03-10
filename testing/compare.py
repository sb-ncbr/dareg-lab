import argparse
import os
import tarfile
import tempfile
import subprocess
import filecmp
import hashlib
import shutil
import getpass


def download_tar(provider_url, dir_id, auth_token, output_path):
    """Downloads a tar archive from the given provider URL."""
    # Step 1: Get the download location
    curl_command = (
        f'curl -sD - -H "X-Auth-Token: {auth_token}" '
        f'-X GET "{provider_url}/api/v3/oneprovider/data/{dir_id}/content" | grep location'
    )

    result = subprocess.run(curl_command, shell=True, capture_output=True, text=True)
    if "location:" not in result.stdout:
        raise ValueError("Failed to get the download URL")

    download_url = result.stdout.split("location: ")[-1].strip()

    # Step 2: Download the tar file
    download_command = f'curl {download_url} > {output_path}'
    subprocess.run(download_command, shell=True, check=True)


def extract_tar(tar_path, extract_dir):
    """Extracts the tar archive and returns the path of the extracted folder inside."""
    with tarfile.open(tar_path, "r") as tar:
        tar.extractall(path=extract_dir)
        extracted_folders = [name for name in os.listdir(extract_dir) if os.path.isdir(os.path.join(extract_dir, name))]
        if len(extracted_folders) != 1:
            raise ValueError("Unexpected archive structure. Expected a single root directory inside the tar.")
        return os.path.join(extract_dir, extracted_folders[0])


def compute_checksum(file_path):
    """Computes the SHA256 checksum of a file."""
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(4096):
            hasher.update(chunk)
    return hasher.hexdigest()


import os
import filecmp
import hashlib


def compute_checksum(filepath):
    """Compute SHA-256 checksum of a file."""
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()


def compare_directories(dir1, dir2):
    """Recursively compares two directories and logs differences and matches."""

    def recursive_compare(dcmp, rel_path=""):
        for name in dcmp.left_only:
            print(f"Only in LOCAL: {name}")
        for name in dcmp.right_only:
            print(f"Only in DAREG: {name}")
        for name in dcmp.diff_files:
            print(f"Different file: {os.path.join(rel_path, name)}")
            file1 = os.path.join(dcmp.left, name)
            file2 = os.path.join(dcmp.right, name)
            checksum1 = compute_checksum(file1)
            checksum2 = compute_checksum(file2)
            if checksum1 != checksum2:
                print(f"Checksum mismatch: {os.path.join(rel_path, name)}")
            else:
                print(f"Checksum match: {os.path.join(rel_path, name)}")
        for name in dcmp.same_files:
            print(f"Same file: {os.path.join(rel_path, name)}")
        for sub_name, sub_dcmp in dcmp.subdirs.items():
            recursive_compare(sub_dcmp, os.path.join(rel_path, sub_name))

    comparison = filecmp.dircmp(dir1, dir2)
    recursive_compare(comparison)


def main():
    parser = argparse.ArgumentParser(description="Download and compare directory with tar archive")
    parser.add_argument("--path", required=True, help="Path to the directory to compare")
    parser.add_argument("--dir_id", required=True, help="Directory ID for the provider")
    parser.add_argument("--auth_token", required=True, help="Authentication token")
    parser.add_argument("--provider_url", required=True, help="Provider URL")

    args = parser.parse_args()

    with tempfile.TemporaryDirectory() as temp_dir:
        tar_path = os.path.join(temp_dir, "downloaded.tar")
        extract_path = os.path.join(temp_dir, "extracted")

        os.makedirs(extract_path, exist_ok=True)

        # Download and extract tar file
        download_tar(args.provider_url, args.dir_id, args.auth_token, tar_path)
        extracted_dir = extract_tar(tar_path, extract_path)

        # Change ownership to the current user
        current_user = getpass.getuser()
        subprocess.run(["chown", "-R", current_user, extracted_dir], check=True)

        # Compare directories
        compare_directories(args.path, extracted_dir)


if __name__ == "__main__":
    main()
