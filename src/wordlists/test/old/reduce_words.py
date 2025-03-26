import os

def combine_and_sort_words(file_paths, output_path):
    combined_words = set()

    # Read words from all files and combine them
    word_lists = []
    for file_path in file_paths:
        with open(file_path, 'r') as infile:
            word_lists.append([line.strip() for line in infile])

    # Combine words from each list
    for animal in word_lists[0]:
        for color in word_lists[1]:
            for verb in word_lists[2]:
                combined_word = ''.join(sorted(set(animal + color + verb)))  # Combine and deduplicate letters
                combined_words.add(combined_word)

    # Write the unique combined words to the output file
    with open(output_path, 'w') as outfile:
        for word in sorted(combined_words):
            outfile.write(word + '\n')

    print(f"Combined and sorted words saved to {output_path}")

if __name__ == "__main__":
    files = ["sorted_animals.txt", "sorted_colors.txt", "sorted_verbs.txt"]
    if all(os.path.exists(file) for file in files):
        combine_and_sort_words(files, "sorted_fakemon.txt")
    else:
        print("Error: One or more files not found.")
