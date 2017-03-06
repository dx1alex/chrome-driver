export interface PromisefyString {
    /** Returns a string representation of a string. */
    toString(): Promise<string>;
    /**
      * Returns the character at the specified index.
      * @param pos The zero-based index of the desired character.
      */
    charAt(pos: number): Promise<string>;
    /**
      * Returns the Unicode value of the character at the specified location.
      * @param index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.
      */
    charCodeAt(index: number): Promise<number>;
    /**
      * Returns a string that contains the concatenation of two or more strings.
      * @param strings The strings to append to the end of the string.
      */
    concat(...strings: string[]): Promise<string>;
    /**
      * Returns the position of the first occurrence of a substring.
      * @param searchString The substring to search for in the string
      * @param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
      */
    indexOf(searchString: string, position?: number): Promise<number>;
    /**
      * Returns the last occurrence of a substring in the string.
      * @param searchString The substring to search for.
      * @param position The index at which to begin searching. If omitted, the search begins at the end of the string.
      */
    lastIndexOf(searchString: string, position?: number): Promise<number>;
    /**
      * Determines whether two strings are equivalent in the current locale.
      * @param that String to compare to target string
      */
    localeCompare(that: string): Promise<number>;
    /**
      * Matches a string with a regular expression, and returns an array containing the results of that search.
      * @param regexp A variable name or string literal containing the regular expression pattern and flags.
      */
    match(regexp: string): Promise<RegExpMatchArray | null>;
    /**
      * Matches a string with a regular expression, and returns an array containing the results of that search.
      * @param regexp A regular expression object that contains the regular expression pattern and applicable flags.
      */
    match(regexp: RegExp): Promise<RegExpMatchArray | null>;
    /**
      * Replaces text in a string, using a regular expression or search string.
      * @param searchValue A string to search for.
      * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
      */
    replace(searchValue: string, replaceValue: string): Promise<string>;
    /**
      * Replaces text in a string, using a regular expression or search string.
      * @param searchValue A string to search for.
      * @param replacer A function that returns the replacement text.
      */
    replace(searchValue: string, replacer: (substring: string, ...args: any[]) => string): Promise<string>;
    /**
      * Replaces text in a string, using a regular expression or search string.
      * @param searchValue A Regular Expression object containing the regular expression pattern and applicable flags.
      * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
      */
    replace(searchValue: RegExp, replaceValue: string): Promise<string>;
    /**
      * Replaces text in a string, using a regular expression or search string.
      * @param searchValue A Regular Expression object containing the regular expression pattern and applicable flags
      * @param replacer A function that returns the replacement text.
      */
    replace(searchValue: RegExp, replacer: (substring: string, ...args: any[]) => string): Promise<string>;
    /**
      * Finds the first substring match in a regular expression search.
      * @param regexp The regular expression pattern and applicable flags.
      */
    search(regexp: string): Promise<number>;
    /**
      * Finds the first substring match in a regular expression search.
      * @param regexp The regular expression pattern and applicable flags.
      */
    search(regexp: RegExp): Promise<number>;
    /**
      * Returns a section of a string.
      * @param start The index to the beginning of the specified portion of stringObj.
      * @param end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.
      * If this value is not specified, the substring continues to the end of stringObj.
      */
    slice(start?: number, end?: number): Promise<string>;
    /**
      * Split a string into substrings using the specified separator and return them as an array.
      * @param separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
      * @param limit A value used to limit the number of elements returned in the array.
      */
    split(separator: string, limit?: number): Promise<string[]>;
    /**
      * Split a string into substrings using the specified separator and return them as an array.
      * @param separator A Regular Express that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
      * @param limit A value used to limit the number of elements returned in the array.
      */
    split(separator: RegExp, limit?: number): Promise<string[]>;
    /**
      * Returns the substring at the specified location within a String object.
      * @param start The zero-based index number indicating the beginning of the substring.
      * @param end Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.
      * If end is omitted, the characters from start through the end of the original string are returned.
      */
    substring(start: number, end?: number): Promise<string>;
    /** Converts all the alphabetic characters in a string to lowercase. */
    toLowerCase(): Promise<string>;
    /** Converts all alphabetic characters to lowercase, taking into account the host environment's current locale. */
    toLocaleLowerCase(): Promise<string>;
    /** Converts all the alphabetic characters in a string to uppercase. */
    toUpperCase(): Promise<string>;
    /** Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale. */
    toLocaleUpperCase(): Promise<string>;
    /** Removes the leading and trailing white space and line terminator characters from a string. */
    trim(): Promise<string>;
    /**
      * Gets a substring beginning at the specified location and having the specified length.
      * @param from The starting position of the desired substring. The index of the first character in the string is zero.
      * @param length The number of characters to include in the returned substring.
      */
    substr(from: number, length?: number): Promise<string>;
    /** Returns the primitive value of the specified object. */
    valueOf(): Promise<string>;
    /**
      * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
      * The padding is applied from the start (left) of the current string.
      *
      * @param maxLength The length of the resulting string once the current string has been padded.
      *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
      *
      * @param fillString The string to pad the current string with.
      *        If this string is too long, it will be truncated and the left-most part will be applied.
      *        The default value for this parameter is " " (U+0020).
      */
    padStart(maxLength: number, fillString?: string): Promise<string>;
    /**
      * Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
      * The padding is applied from the end (right) of the current string.
      *
      * @param maxLength The length of the resulting string once the current string has been padded.
      *        If this parameter is smaller than the current string's length, the current string will be returned as it is.
      *
      * @param fillString The string to pad the current string with.
      *        If this string is too long, it will be truncated and the left-most part will be applied.
      *        The default value for this parameter is " " (U+0020).
      */
    padEnd(maxLength: number, fillString?: string): Promise<string>;
    /**
        * Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
        * value of the UTF-16 encoded code point starting at the string element at position pos in
        * the String resulting from converting this object to a String.
        * If there is no element at that position, the result is undefined.
        * If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.
        */
    codePointAt(pos: number): Promise<number | undefined>;
    /**
      * Returns true if searchString appears as a substring of the result of converting this
      * object to a String, at one or more positions that are
      * greater than or equal to position; otherwise, returns false.
      * @param searchString search string
      * @param position If position is undefined, 0 is assumed, so as to search all of the String.
      */
    includes(searchString: string, position?: number): Promise<boolean>;
    /**
      * Returns true if the sequence of elements of searchString converted to a String is the
      * same as the corresponding elements of this object (converted to a String) starting at
      * endPosition – length(this). Otherwise returns false.
      */
    endsWith(searchString: string, endPosition?: number): Promise<boolean>;
    /**
      * Returns the String value result of normalizing the string into the normalization form
      * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
      * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
      * is "NFC"
      */
    normalize(form: "NFC" | "NFD" | "NFKC" | "NFKD"): Promise<string>;
    /**
      * Returns the String value result of normalizing the string into the normalization form
      * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
      * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
      * is "NFC"
      */
    normalize(form?: string): Promise<string>;
    /**
      * Returns a String value that is made from count copies appended together. If count is 0,
      * T is the empty String is returned.
      * @param count number of copies to append
      */
    repeat(count: number): Promise<string>;
    /**
      * Returns true if the sequence of elements of searchString converted to a String is the
      * same as the corresponding elements of this object (converted to a String) starting at
      * position. Otherwise returns false.
      */
    startsWith(searchString: string, position?: number): Promise<boolean>;
}
