import os
import sys

def rename_jpg_files(directory):
    # Walk through the directory and all its subdirectories
    for root, _, files in os.walk(directory):
        for filename in files:
            # Check if the file ends with .JPG (case-sensitive)
            if filename.endswith(".JPG"):
                # Form the full path to the file
                old_file = os.path.join(root, filename)
                # Create an intermediate file name (with a temporary extension)
                temp_file = os.path.join(root, filename[:-4] + ".tmp")
                new_file = os.path.join(root, filename[:-4] + ".jpg")
                
                # Rename to a temporary file first, then to the final file
                os.rename(old_file, temp_file)
                os.rename(temp_file, new_file)

                print(f"Renamed: {old_file} -> {new_file}")

if __name__ == "__main__":
    # Check if a directory is provided as a command-line argument
    if len(sys.argv) != 2:
        print("Usage: python rename_jpg_recursive.py <directory>")
    else:
        directory = sys.argv[1]
        # Call the function to rename the files recursively
        rename_jpg_files(directory)
