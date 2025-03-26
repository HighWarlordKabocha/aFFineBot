import random
import string

def combine_wordlists_with_random_chars(colors_file, verbs_file, animals_file, num_combinations=10):
    """
    Combines words from three wordlists and injects 2 random characters (start and end).

    Args:
        colors_file (str): Path to the colors wordlist file.
        verbs_file (str): Path to the verbs wordlist file.
        animals_file (str): Path to the animals wordlist file.
        num_combinations (int): Number of combined words to generate.

    Returns:
        list: A list of combined words with injected characters.
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
        for _ in range(num_combinations):
            color = random.choice(colors)
            verb = random.choice(verbs)
            animal = random.choice(animals)
            combined_word = color + verb + animal

            # Generate 2 unique random characters
            unique_chars = set(combined_word)
            available_chars = [char for char in string.ascii_lowercase if char not in unique_chars]

            if len(available_chars) < 2:
                random_chars = "".join(random.choices(string.ascii_lowercase, k=2)) # If there aren't enough unique, just make it random.
            else:
                random_chars = "".join(random.sample(available_chars, 2))

            # Inject random characters at start and end
            combined_word = random_chars[0] + combined_word + random_chars[1]
            combined_words.append(combined_word)

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

combined_words = combine_wordlists_with_random_chars(colors_file, verbs_file, animals_file, num_combinations=20)

if combined_words:
    for word in combined_words:
        print(word)
else:
    print("Failed to generate combined words.")
