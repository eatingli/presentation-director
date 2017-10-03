
import React from 'react';
import fs from 'fs';
import path from 'path';
import BibleStudy from './lib/bible-study.js';

const BOOKS_LABEL = ['Gen', 'Exo', 'Lev', 'Num', 'Deu', 'Jos', 'Jug', 'Rut', '1Sa', '2Sa', '1Ki', '2Ki', '1Ch', '2Ch', 'Ezr', 'Neh', 'Est', 'Job', 'Psm', 'Pro', 'Ecc', 'Son', 'Isa', 'Jer', 'Lam', 'Eze', 'Dan', 'Hos', 'Joe', 'Amo', 'Oba', 'Jon', 'Mic', 'Nah', 'Hab', 'Zep', 'Hag', 'Zec', 'Mal', 'Mat', 'Mak', 'Luk', 'Jhn', 'Act', 'Rom', '1Co', '2Co', 'Gal', 'Eph', 'Phl', 'Col', '1Ts', '2Ts', '1Ti', '2Ti', 'Tit', 'Phm', 'Heb', 'Jas', '1Pe', '2Pe', '1Jn', '2Jn', '3Jn', 'Jud', 'Rev']

export default class SingleSong extends React.Component {

    constructor(props) {
        super(props);
        let bible = fs.readFileSync(path.join('res', 'bible-version', 'cuv.txt'), { encoding: 'utf8' })
        this.bs = new BibleStudy(bible);
        this.state = {
            book: null,
            chapter: null,
            bookLabel: 'Gen',
            chapterID: 1,
        }

        this.setBook = this.setBook.bind(this);
        this.setChapter = this.setChapter.bind(this);
    }

    componentDidMount() {

        this.props.onLoadMedia((filename, media) => {
            console.log('onLoadMedia()');
        });

        // setImmediate(() => this.setBook('Gen'));
        this.setBook(this.state.bookLabel)
    }

    setBook(label) {
        let book = this.bs.getBook(label);
        let chapter = BibleStudy.filterChapter(book, 1);
        this.setState({ book: book, chapter: chapter, bookLabel: label, chapterID: 1 })
    }

    setChapter(c) {
        let chapter = BibleStudy.filterChapter(this.state.book, c);
        this.setState({ chapter: chapter, chapterID: c })
    }

    handleBookChange(e) {
        let bookId = e.target.value;
        let label = BOOKS_LABEL[bookId];
        this.setBook(label);
    }

    handleChapterChange(e) {
        this.setChapter(Number.parseInt(e.target.value));
    }

    render() {
        let chapterOpt = [];
        let chapterLen = this.state.book ? BibleStudy.countChapter(this.state.book) : 0;
        for (let i = 0; i < chapterLen; i++) chapterOpt.push((<option key={i} value={i + 1}>{i + 1}</option>))

        let rows = this.state.chapter ? this.state.chapter.map((row, i) => (<li key={i}>{BibleStudy.parseVerse(row)}: {BibleStudy.parseLection(row)}</li>)) : null;

        return (
            <div style={Style.container}>
                <p>Version: CUV</p>
                Book:
                <select onChange={this.handleBookChange.bind(this)}>
                    {BOOKS_LABEL.map((label, i) => (<option key={i} value={i}>{label}</option>))}
                </select>
                Chapter:
                <select value={this.state.chapterID} onChange={this.handleChapterChange.bind(this)}>
                    {chapterOpt}
                </select>
                <ul className="scroller" style={Style.content}>
                    {rows}
                </ul>

            </div>
        )
    }
}

const Style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'scroll',
        padding: '0',
        margin: '5px 0px 5px 0px',
    },
}