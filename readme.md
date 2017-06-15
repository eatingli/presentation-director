
# Presentation Director

目前首要功能為歌詞投影，在雙螢幕(電腦+投影機)的環境下，選擇要撥放的段落到投影幕上。

- 提供歌曲清單和歌曲編輯功能，可儲存和匯出入歌詞檔案。
- 歌詞格式分為單行多行。
- 用滑鼠直接點擊歌詞即可撥放。

# IPC

因為 Webpack 路徑的關係，沒有讓 Main-Window 直接管理 Player-Window，而是透過 main.js 中介來操作，這也能將Electron視窗管理邏輯從React中分離。

## Main Window
    send PLAYER_TEMPLATE
    send PLAYER_CONTENT
    on PLAYER_OPEN
    on PLAYER_CLOSE

## Player Window
    on TEMPLATE
    on CONTENT