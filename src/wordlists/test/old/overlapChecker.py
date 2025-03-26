import random
from itertools import combinations
import time
import multiprocessing

def load_wordlist(filename):
    """Loads words from a text file into a list."""
    with open(filename, 'r') as f:
        return [line.strip() for line in f]

def preprocess_pokemon(pokemon_list):
    """Preprocesses Pokemon names to create a letter set dictionary."""
    pokemon_letters = {}
    for pokemon in pokemon_list:
        pokemon_letters[pokemon] = set(pokemon)
    return pokemon_letters

def check_letter_overlap_preprocessed(phrase_letters, pokemon1_letters, pokemon2_letters):
    """Checks if a phrase shares letters with both Pokemon names using preprocessed data."""
    return bool(phrase_letters.intersection(pokemon1_letters) and phrase_letters.intersection(pokemon2_letters))

def process_verb_chunk(verb_chunk, colors, animals, pokemon_letters):
    """Worker function to process a chunk of verbs."""
    overlapping_combinations = []  # Initialize an empty list
    pokemon_names = list(pokemon_letters.keys())
    pokemon_pairs = list(combinations(pokemon_names, 2))

    for verb in verb_chunk:
        for color in colors:
            for animal in animals:
                phrase = f"{verb} {color} {animal}"
                phrase_letters = set(phrase)
                for pokemon1, pokemon2 in pokemon_pairs:
                    pokemon1_letters = pokemon_letters[pokemon1]
                    pokemon2_letters = pokemon_letters[pokemon2]
                    if check_letter_overlap_preprocessed(phrase_letters, pokemon1_letters, pokemon2_letters):
                        overlapping_combinations.append((phrase, pokemon1, pokemon2))
                        break
    return overlapping_combinations

def find_overlapping_combinations_parallel(verbs, colors, animals, pokemon_letters, num_processes):
    """Finds overlapping combinations using parallel processing."""
    overlapping_combinations = []  # Initialize an empty list
    with multiprocessing.Pool(processes=num_processes) as pool:
        verb_chunks = [verbs[i::num_processes] for i in range(num_processes)]
        results = pool.starmap(process_verb_chunk, [(chunk, colors, animals, pokemon_letters) for chunk in verb_chunks])

    # Combine results from all processes
    for result in results:
        overlapping_combinations.extend(result)
    return overlapping_combinations

# Load wordlists
verbs = load_wordlist("verbs.txt")
colors = load_wordlist("colors.txt")
animals = load_wordlist("animals.txt")
pokemon_list = load_wordlist("pokemon.txt")

# Preprocess Pokemon data
pokemon_letters = preprocess_pokemon(pokemon_list)

# Determine number of processes to use (you can adjust this)
num_processes = multiprocessing.cpu_count()  # Use all available CPU cores

# Find overlapping combinations using parallel processing
start_time = time.time()
overlapping_combinations = find_overlapping_combinations_parallel(verbs, colors, animals, pokemon_letters, num_processes)
end_time = time.time()

print(f"Total execution time: {end_time - start_time:.2f} seconds")

# Print results
for phrase, pokemon1, pokemon2 in overlapping_combinations:
    print(f"Phrase: '{phrase}' overlaps with '{pokemon1}' and '{pokemon2}'")
