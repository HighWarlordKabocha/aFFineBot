def analyze_wordlist(filepath):
    """
    Analyzes a wordlist file and prints statistics.

    Args:
        filepath (str): Path to the wordlist file.
    """
    try:
        with open(filepath, 'r') as file:
            words = [line.strip().lower() for line in file]

        if not words:
            print("The file is empty.")
            return

        total_words = len(words)
        length_counts = {}
        unique_char_counts = {}

        for word in words:
            length = len(word)
            length_counts[length] = length_counts.get(length, 0) + 1
            unique_chars = len(set(word))
            unique_char_counts[unique_chars] = unique_char_counts.get(unique_chars, 0) +1

        print(f"Total words: {total_words}")
        print("\nWord Length Statistics:")
        sorted_lengths = sorted(length_counts.keys())
        for length in sorted_lengths:
            count = length_counts[length]
            print(f"- {length} letters: {count} words")

        print("\nUnique Character Statistics:")
        sorted_unique_chars = sorted(unique_char_counts.keys())
        for unique_chars in sorted_unique_chars:
            count = unique_char_counts[unique_chars]
            print(f"- {unique_chars} unique chars: {count} words")

        five_or_more = sum(count for length, count in length_counts.items() if length >= 5)
        print(f"\nWords with 5 or more letters: {five_or_more}")

    except FileNotFoundError:
        print(f"Error: File '{filepath}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
filepath = "verbs.txt"
analyze_wordlist(filepath)
