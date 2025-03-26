from itertools import combinations

def load_wordlist(filename):
    """Loads words from a text file into a list."""
    with open(filename, 'r') as f:
        return [line.strip() for line in f]

def unique_letters_in_combination(pokemon1, pokemon2):
    """Calculates the number of unique letters in a pair of Pokemon names."""
    combined_letters = set(pokemon1 + pokemon2)
    return len(combined_letters)

# Load the Pokemon list
pokemon_list = load_wordlist("pokemon.txt")

# Generate all pairs of Pokemon
pokemon_pairs = list(combinations(pokemon_list, 2))

# Find the pair with the maximum unique letters
max_unique_count = 0
best_pair = ()

for pair in pokemon_pairs:
    unique_count = unique_letters_in_combination(pair[0], pair[1])
    if unique_count > max_unique_count:
        max_unique_count = unique_count
        best_pair = pair

# Print the result
print(f"The Pokemon pair with the most unique letters is: {best_pair[0]} and {best_pair[1]}")
print(f"Number of unique letters: {max_unique_count}")
