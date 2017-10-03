/**
 * 
 */
export default class BibleStudy {

    constructor(data) {
        this.data = data;
        this.rows = data.split('\n')
    }

    /**
     * Parse
     * row: 'Exo 5:1 後來摩西亞倫去對法老說、耶和華以色列的　神這樣說、容我的百姓去、在曠野向我守節。'
     */
    static parseBook(row) {
        return row.slice(0, 3);
    }

    static parseChapter(row) {
        return Number.parseInt(row.substring(4, row.indexOf(':')));
    }

    static parseVerse(row) {
        let start = row.indexOf(':') + 1;
        return Number.parseInt(row.substring(start, row.indexOf(' ', start)));
    }

    static parseLection(row) {
        return row.substring(row.indexOf(' ', row.indexOf(':')) + 1);
    }

    /**
     * Filter
     */
    static filterChapter(rows, chapter) {
        return rows.filter((row) => BibleStudy.parseChapter(row) == chapter)
    }

    static filterVerse(rows, verse) {
        return rows.filter((row) => BibleStudy.parseVerse(row) === verse)
    }

    /**
     * Count
     */
    static countChapter(book) {
        let temp = new Set();
        book.forEach((row) => temp.add(BibleStudy.parseChapter(row)));
        return temp.size;
    }

    /**
     * Get
     */
    getBook(book) {
        return this.rows.filter((row) => BibleStudy.parseBook(row) === book)
    }

    getChapter(book, chapter) {
        return this.rows.filter((row) => BibleStudy.parseBook(row) === book && BibleStudy.parseChapter(row) === chapter)
    }

    getChapters(book, chapters) {
        return this.rows.filter((row) => {
            if (row.slice(0, 3) === book) {
                let c = Number.parseInt(row.substring(4, row.indexOf(':')));
                for (let chapter of chapters) {
                    if (chapter == c) return true;
                }
            }
            return false;
        })
    }
}