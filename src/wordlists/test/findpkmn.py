def find_pokemon_with_unique_chars(filepath, min_unique_chars=8):
    """
    Finds Pokemon names in a file with a minimum number of unique characters.

    Args:
        filepath (str): The path to the text file containing Pokemon names.
        min_unique_chars (int): The minimum number of unique characters required.

    Returns:
        list: A list of Pokemon names that meet the criteria.
    """
    try:
        with open(filepath, 'r') as file:
            pokemon_names = [line.strip().lower() for line in file]

        if not pokemon_names:
            return []

        filtered_pokemon = []
        for name in pokemon_names:
            unique_chars = set(name)
            if len(unique_chars) >= min_unique_chars:
                filtered_pokemon.append(name)

        return filtered_pokemon

    except FileNotFoundError:
        print(f"Error: File '{filepath}' not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

# Example usage:
pokemon_file = "pokemon.txt"  # Replace with your pokemon.txt file path
result = find_pokemon_with_unique_chars(pokemon_file)

if result:
    print("Pokemon names with 8 or more unique characters:")
    for pokemon in result:
        print(pokemon)
else:
    print("No Pokemon names found with 8 or more unique characters, or file error.")
