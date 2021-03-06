
# Presentation Director

目前主要使用情境為歌詞投影，在雙螢幕(電腦+投影機)的環境下，點選歌詞投放到投影幕上。

- 提供媒體清單和媒體編輯功能，可儲存和匯出/入媒體檔案。
- 媒體類型分為單行歌詞/多行歌詞，或者未來更多的格式。
- 單向控制，從控制端更新投影幕狀態，但無法監控，只能丟狀態過去。

## 系統架構

### Media 系統

- 媒體系統基於檔案系統，負責媒體檔案存取、管理。
- 包含媒體檔案的新增/刪除/更名，並對其他系統提供載入/儲存的接口。
- 每個媒體檔案內紀錄其所屬類型(Director)，和資料(Data)。
- 選擇一個媒體檔案作為選定媒體(Selected Media)，以此決定所調用的 Director 組件。
- 在 UI 上，提供 Media List 來操作。

### Director 系統

- 實作媒體資料的編輯，對畫面的控制。
- 提供媒體編輯：載入媒體檔案 -> 編輯 -> 儲存媒體檔案。
- 提供畫面控制：選擇 Template -> 設定 Config(未定) -> 填充 Content -> 產生完整畫面
- Director 為獨立組件，媒體檔案皆有其所屬的 Director。

### Template 系統

- 顯示畫面的範本，所有畫面都來自 Template。
- 藉由調整其 Content 和 Config(未定)，來展示出不同的畫面。
- Template 為獨立組件，被 Director 調用和控制。

## 使用技術

### Electron

- 用 Web 技術來實作桌面程式。
- 以主進程來調用其他渲染進程，透過 IPC 來溝通。
- 主進程為純的 Nodejs，也負責 AppMenu 和作業系統依賴性的部分。
- 跨平台，可打包成各平台執行檔。

### ReactJS

- 負責 Web 前端畫面
- Director 和 Template 系統的各種組件，皆是 React 組件。

### Webpack

- 負責調用轉譯並打包程式