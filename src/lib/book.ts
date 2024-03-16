import { nanoid } from "nanoid";
import ePub from "epubjs";

import type { Book } from "epubjs";
import type { LibraryEntry } from "./types";
import { Filesystem } from "@capacitor/filesystem";

export class EpubBook {
    // The name of the book file with not extensions
    metadata: LibraryEntry;
    // Lazy loaded since it is relatively time consuming
    // and for general functionality not required, only
    // readlly needed to be loaded when actually  being read
    book: Book | undefined;

    loadAttempted = false;

    private constructor(book: Book | undefined, entry: LibraryEntry) {
        this.metadata = entry;
        this.book = book;
        this.loadAttempted = book !== undefined;
    }

    static async fromNewBook(book: Book, cover_uri: string | null, file_uri: string): Promise<EpubBook> {
        const book_id = nanoid();

        const meta: LibraryEntry = {
            book_id: book_id,
            file: file_uri,
            lastRead: new Date(),
            location: null,
            completion: 0,
            title: book.packaging.metadata.title,
            coverImage: cover_uri,
            author: book.packaging.metadata.creator
        }

        return new this(book, meta);
    }

    static fromMetadata(entry: LibraryEntry): EpubBook {
        const book = new this(undefined, entry);
        return book;
    }

    async loadEpubFile() {
        let result;
        this.loadAttempted = true;

        try {
            result = await Filesystem.readFile({ path: this.metadata.file });
        } catch (error) {
            console.error(`Failed to read file for book: ${error}`)
            return;
        }

        const data = result.data.toString();
        const book = await EpubBook.epubFromBase64(data);

        if (book === null) {
            return null;
        }

        this.book = book;
    }

    static async epubFromBase64(data: String): Promise<Book | null> {
		const book = ePub();

		try {
			await book.open(data.toString(), 'base64');

			return book;
		} catch (error) {
			console.error(`error parsing book: ${error}`);
			return null;
		}
	}
}