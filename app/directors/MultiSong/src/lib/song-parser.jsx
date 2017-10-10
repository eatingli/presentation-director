/**
 * 
 */
export default class SongParser {

    constructor() {
        this.lineSpliter = '\n';
        this.title = '';
        this.parts = [];
    }

    /**
     * 回傳 Song 物件
     */
    getSong() {
        return {
            title: this.title,
            parts: this.parts
        }
    }

    /**
     * 標題
     */
    parseTitle(str) {
        this.title = str.trim();
    }

    /**
     * 歌詞
     */
    parseLyrics(str) {

        // 去空白
        str = str.trim();

        // 每行去空白，再組回去
        str = str.split('\n').map((row) => row.trim()).join('\n');

        // 將超過一個空行的段落都整理成一個。(空行 = 超過一個以上的換行)
        while (str.indexOf('\n\n\n') > -1) {
            str = str.replace(/\n{3,}/, '\n\n');
        }

        // 解析出段落
        let parts = str.split('\n\n');

        // 解析出各行
        this.parts = parts.map((part) =>
            part.split('\n').map((row) => {

                // 解析標記
                let tag = '';
                let content = row;
                let match = row.match(/\[(.*?)\]/);
                if (match) {
                    tag = match[1];
                    content = row.replace(match[0], '').trim();
                }

                //建構物件
                let lyric = {
                    tag: tag,
                    content: content
                }

                return lyric;
            })
        );
    }
}