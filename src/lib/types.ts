export interface Library {
    books: LibraryEntry[];
}

export type LibraryEntry = {
    book_id: string,
    file: string,
    lastRead: Date;
    location: string | null;
    completion: number;
    title: string | null;
    coverImage: string | null;
    author: string | null;
}

export interface ReaderTheme {
    body: {
      background?: string,
      color?: string,
    },
    '*'?: {
      color?: string,
      background?: string,
    },
    'a:link'?: {
      color?: string,
      'text-decoration'?: string,
    },
    'a:link:hover'?: {
      background?: string,
    }
}