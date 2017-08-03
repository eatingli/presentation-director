/**
 * 
 */
export default class SingleSongParser {

    constructor() {
        this.lineSpliter = '\n';
        this.title1 = '';
        this.title2 = '';
        this.description1 = '';
        this.description2 = '';
        this.lyrics = [];
    }

    /**
     * 回傳 Song 物件
     */
    getSong() {
        return {
            title1: this.title1,
            title2: this.title2,
            description1: this.description1,
            description2: this.description2,
            lyrics: this.lyrics
        }
    }

    /**
     * 標題 | 副標題
     */
    parseTitle(str) {
        if (str.indexOf('|') > -1) {
            let temp = str.split('|');
            this.title1 = temp[0].trim();
            this.title2 = temp[1].trim();
        } else {
            this.title1 = str.trim();
        }
    }

    /**
     * 描述
     */
    parseDescription(str) {
        let descriptions = str.split(this.lineSpliter);
        this.description1 = descriptions[0];
        this.description2 = descriptions.length > 1 ? descriptions[1] : '';
    }

    /**
     * 歌詞
     */
    parseLyrics(str) {

        this.lyrics = [];
        let rows = str.split(this.lineSpliter);
        rows.forEach((row) => {

            // 去除空白
            row = row.trim();

            // 解析標記
            let tag = '';
            let match = row.match(/\[(.*?)\]/);
            if (match) {
                tag = match[1];
                row = row.replace(match[0], '');
            }

            // 解析主歌詞 | 副歌詞
            let content1 = '';
            let content2 = '';
            if (row.indexOf('|') > -1) {
                let temp = row.split('|');
                content1 = temp[0];
                content2 = temp[1];
            } else {
                content1 = row;
            }

            // 建構物件
            let lyric = {};
            lyric.tag = tag.trim();
            lyric.content1 = content1.trim();
            lyric.content2 = content2.trim();

            this.lyrics.push(lyric);
        });
    }
}