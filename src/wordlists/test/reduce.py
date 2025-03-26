def filter_verbs_unique_chars(input_file, output_file="filtered_verbs.txt"):
    """
    Filters a wordlist to keep only words with 7 or more unique characters.

    Args:
        input_file (str): Path to the input wordlist file (verbs.txt).
        output_file (str): Path to the output filtered file.
    """
    try:
        with open(input_file, 'r') as infile, open(output_file, 'w') as outfile:
            for line in infile:
                word = line.strip().lower()  # Normalize to lowercase
                unique_chars = set(word)

                if len(unique_chars) >= 7:
                    outfile.write(word + '\n')

        print(f"Filtered words written to {output_file}")

    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
input_file = "verbs.txt"
filter_verbs_unique_chars(input_file)
