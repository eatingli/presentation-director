
# Presentation Director

目前主要使用情境為歌詞投影，在雙螢幕(電腦+投影機)的環境下，選擇要撥放的段落到投影幕上。

- 提供歌曲清單和歌曲編輯功能，可儲存和匯出入歌詞檔案。
- 歌詞格式分為單行多行，或者未來更多的格式。
- 單向控制，從控制端更新撥放端狀態，但程式本身不監控撥放端狀態。

## 系統架構

### Media 系統

- 媒體系統為基於檔案系統的，資料存取、管理單位。
- 包含媒體檔案的新增/刪除/更名，並對其他系統提供載入/儲存的接口。
- 每個媒體檔案內紀錄其所屬的 Director 型別，和媒體資料。

### Director 系統

- 使用者操作核心，實作媒體資料的編輯，對畫面的控制。
- 提供媒體編輯介面：載入媒體檔案 -> 編輯 -> 儲存媒體檔案。
- 提供畫面控制：選擇 Template -> 將媒體作為 Content -> 填充為完整畫面
- Director 為獨立組件，如何調用由所選媒體的型別決定。

### Template 系統

- 顯示畫面的範本，所有畫面都來自 Template。
- 可以填入 Content、設定 Config(暫定)，來展示不同的畫面。
- Template 為獨立組件，被 Director 調用和控制。

## 使用技術

### Electron

- 用 Web 技術來實作桌面 App。
- 透過 IPC 來調用 nodejs 軟體。
- 跨平台，可打包成各平台執行檔。

### ReactJS

- 負責 Web 前端畫面

### Webpack + Babel

- 負責轉譯並打包程式
