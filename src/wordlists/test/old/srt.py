def combine_wordlists_all_combinations(colors_file, verbs_file, animals_file):
    """
    Combines every instance of words from three wordlists.

    Args:
        colors_file (str): Path to the colors wordlist file.
        verbs_file (str): Path to the verbs wordlist file.
        animals_file (str): Path to the animals wordlist file.

    Returns:
        list: A list of all possible combined words.
    """
    try:
        with open(colors_file, 'r') as c_file, \
             open(verbs_file, 'r') as v_file, \
             open(animals_file, 'r') as a_file:

            colors = [line.strip() for line in c_file]
            verbs = [line.strip() for line in v_file]
            animals = [line.strip() for line in a_file]

        if not colors or not verbs or not animals:
            return []  # Return empty list if any file is empty

        combined_words = []
        for color in colors:
            for verb in verbs:
                for animal in animals:
                    combined_words.append(color + verb + animal)

        return combined_words

    except FileNotFoundError:
        print("One or more wordlist files not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# Example usage:
colors_file = "colors.txt"
verbs_file = "verbs.txt"
animals_file = "animals.txt"

combined_words = combine_wordlists_all_combinations(colors_file, verbs_file, animals_file)

if combined_words:
    for word in combined_words:
        print(word)
    print(f"\nTotal combinations: {len(combined_words)}")
else:
    print("Failed to generate combined words.")
