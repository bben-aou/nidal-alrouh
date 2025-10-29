declare module 'leo-profanity' {
  type DictionaryName = 'en' | 'fr' | 'ru' | string;

  interface LeoProfanity {
    // Check if the input contains profane words
    check(input: string): boolean;

    // Replace profane words with asterisks or a custom symbol
    clean(input: string, replaceSymbol?: string): string;

    // Get the current list of profane words loaded into the filter
    list(): string[];

    // Add words to the filter list
    add(words: string[] | string): void;

    // Remove words from the filter list
    remove(words: string[] | string): void;

    // Clear all words from the filter list
    clearList(): void;

    // Get a built-in dictionary by name
    getDictionary(name: DictionaryName): string[];

    // Replace current dictionary with the specified built-in dictionary
    loadDictionary(name: DictionaryName): void;

    // Add a custom dictionary under a specific name
    addDictionary(name: string, words: string[]): void;
  }

  const leoProfanity: LeoProfanity;
  export default leoProfanity;
}
