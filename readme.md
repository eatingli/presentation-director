
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

# Directing Console

配置與當前選擇媒體(Media)對應的 Director

## Director
獨立處理**編輯**和**指揮**，用React的元件來鑲嵌，透過檔名來動態載入對應實例。

    // Props
    selectTemplate(template)
    updateContent(content)
    save(newDate)

## 預計的 Director
- 歌詞主畫面
- 歌詞提示幕
- 新家人名單(小組)
- 新家人名單(集中)

# Template
所有畫面都是Template填入Content來產生.

# 待確認

## 可否動態載入組件？
是，在function中必須用require而不能用import，且必須是 export default

## 可否動態更換組件？ 
是，只要prop一樣，熱切換是沒問題的

## 剛選完Template後，Content還是舊的，會出現錯誤？
收到Template Update後，判定實際上是否有變化，沒變化則視為無效，有變化則把Content也清空

## 上述如何實作？ 如果控制端同時發送selectTemplate和updateContent，不能確定哪個先觸發，這樣有可能收到新Content後馬上被清除
...

## 初始狀態所套用的Template？
...