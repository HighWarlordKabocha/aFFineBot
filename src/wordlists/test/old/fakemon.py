import os

def combine_sorted_files(output_file, *input_files):
    combined_words = set()
    
    for file_path in input_files:
        if os.path.exists(file_path):
            with open(file_path, 'r') as infile:
                for line in infile:
                    combined_words.add(line.strip())
        else:
            print(f"Warning: {file_path} not found.")
    
    with open(output_file, 'w') as outfile:
        for word in sorted(combined_words):
            outfile.write(word + '\n')
    
    print(f"Created {output_file} with combined words.")

if __name__ == "__main__":
    combine_sorted_files("sorted_fakemon.txt", "sorted_animals.txt", "sorted_colors.txt", "sorted_verbs.txt")

