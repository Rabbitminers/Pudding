import { get, writable } from "svelte/store";
import { EpubBook } from "./book";
import { Directory, Encoding, Filesystem, type ReadFileResult } from "@capacitor/filesystem";
import type { Library } from "./types";

const LIBRARY_PATH = "library/";
const LIBRARY_FILE = LIBRARY_PATH + "library.json";

export const library = writable<Map<String, EpubBook>>(new Map());
export const libraryLoaded = writable(false);

export async function loadLibary(filepath: string = LIBRARY_FILE) {
    const loaded = get(libraryLoaded);
    
    if (loaded) {
        return;
    }

    libraryLoaded.set(true);
    
    let contents: ReadFileResult;

    try {
        contents = await Filesystem.readFile({
            encoding: Encoding.UTF8,
            path: filepath,
            directory: Directory.Data
        });
    } catch (error) {
        console.error(`Failed to read library contents: ${error}`)
        return;
    }

    const data = contents.data.toString();
    const json: Library = JSON.parse(data);

    for (let i = 0; i < json.books.length; i++) {
        const meta = json.books[i];

        const book = EpubBook.fromMetadata(meta);

        library.update((books) => books.set(meta.book_id, book));
    }
}

async function saveLibrary(filepath: string = LIBRARY_FILE) {
    const snapshot = get(library);

    const values = Array.from(snapshot.values());
    const entries = values.map(book => book.metadata);

    const data: Library = { books: entries }

    try {
        await Filesystem.writeFile({
            path: filepath,
            data: JSON.stringify(data),
            encoding: Encoding.UTF8,
            directory: Directory.Data
        })
    } catch (error) {
        console.error(`Failed to write library contents: ${error}`)
    }
}

export async function addBookToLibrary(book: EpubBook) {
    const book_id = book.metadata.book_id;

    library.update((books) => {
        books.set(book_id, book)
        return books;
    });

    await saveLibrary();
}

export async function removeBookFromLibrary(book_id: string) {
    library.update((books) => {
        books.delete(book_id)
        return books;
    });

    await saveLibrary();
}