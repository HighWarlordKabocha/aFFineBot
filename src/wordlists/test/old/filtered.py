import string

def filter_lines_with_unique_chars(input_file, output_file="filtered_combo.txt"):
    """
    Reads lines from a file, filters lines with at least 7 unique alphabetic characters,
    and writes the filtered lines to a new file.

    Args:
        input_file (str): Path to the input text file.
        output_file (str): Path to the output text file.
    """
    try:
        with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
            for line in infile:
                line = line.strip()
                alphabetic_chars = ''.join(char.lower() for char in line if char.isalpha()) #get only alpha characters
                unique_chars = set(alphabetic_chars)

                if len(unique_chars) >= 7:
                    outfile.write(line + '\n')

        print(f"Filtered lines written to {output_file}")

    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
input_file = "combo.txt"
filter_lines_with_unique_chars(input_file)
