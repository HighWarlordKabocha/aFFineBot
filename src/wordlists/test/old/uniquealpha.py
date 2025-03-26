def find_pokemon_with_most_unique_letters(filepath):
    """
    Finds the Pokemon names in a file with the highest number of unique letters.

    Args:
        filepath (str): The path to the text file containing Pokemon names.

    Returns:
        list: A list of Pokemon names with the highest number of unique letters.
    """
    try:
        with open(filepath, 'r') as file:
            pokemon_names = [line.strip().lower() for line in file]

        if not pokemon_names:
            return []  # Return empty list if file is empty

        unique_letter_counts = {}
        for name in pokemon_names:
            unique_letters = set(name)
            unique_letter_counts[name] = len(unique_letters)

        max_unique_count = max(unique_letter_counts.values())
        pokemon_with_max_unique = [
            name
            for name, count in unique_letter_counts.items()
            if count == max_unique_count
        ]

        return pokemon_with_max_unique

    except FileNotFoundError:
        return []  # Return empty list if file not found
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# Example usage (assuming you have a "pokemon.txt" file in the same directory):
pokemon_file = "pokemon.txt"  # Replace with the actual file path
result = find_pokemon_with_most_unique_letters(pokemon_file)

if result:
    print("Pokemon with the most unique letters:")
    for pokemon in result:
        print(pokemon)
else:
    print("Could not process the pokemon file. Please check the file path or contents.")
