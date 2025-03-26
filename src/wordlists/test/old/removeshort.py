import os

def filter_short_words(filepath):
    """
    Removes words of length 1 or 2 from a text file.

    Args:
        filepath (str): The path to the text file.
    """
    try:
        with open(filepath, 'r') as file:
            words = [line.strip() for line in file]

        filtered_words = [word for word in words if len(word) > 2]

        with open(filepath, 'w') as file:
            for word in filtered_words:
                file.write(word + '\n')

        print(f"Filtered short words in {filepath}")

    except FileNotFoundError:
        print(f"File not found: {filepath}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
files_to_filter = ["animals.txt", "colors.txt", "verbs.txt"]

for file_path in files_to_filter:
    filter_short_words(file_path)
