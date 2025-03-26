import string

def filter_wordlists(files):
    """
    Filters lines in multiple text files, removing lines with less than 4 unique alphabetic characters.

    Args:
        files (list): A list of file paths to process.
    """
    for file_path in files:
        try:
            with open(file_path, 'r') as infile:
                lines = infile.readlines()

            filtered_lines = []
            for line in lines:
                line = line.strip()
                alphabetic_chars = ''.join(char.lower() for char in line if char.isalpha())
                unique_chars = set(alphabetic_chars)

                if len(unique_chars) >= 4:
                    filtered_lines.append(line + '\n')

            with open(file_path, 'w') as outfile:
                outfile.writelines(filtered_lines)

            print(f"Filtered lines in {file_path}")

        except FileNotFoundError:
            print(f"Error: File '{file_path}' not found.")
        except Exception as e:
            print(f"An error occurred: {e}")

# Example usage:
file_list = ["animals.txt", "colors.txt", "verbs.txt"]
filter_wordlists(file_list)
