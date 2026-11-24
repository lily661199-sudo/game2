# 小小夢魔｜霧港理財冒險

給小學生的繁體中文生活理財互動網頁，含兩個夢境關卡、逐關得分、通關鑰匙與旅程進步成果。主視覺是原創手繪 SVG 室內場景，搭配低視角、暖色光束、陰影和電影感介面；採用黑暗童話與探索氛圍作為方向，沒有使用《Little Nightmares》的角色、商標或遊戲素材。

## 本機預覽

直接用瀏覽器開啟 `index.html`，或在此資料夾啟動任一靜態檔案伺服器。

## 部署

- **GitHub Pages：** 推送到 `main` 或 `master` 後，`.github/workflows/pages.yml` 會自動部署；首次使用時，在 repository 的 Settings → Pages 將來源設為 GitHub Actions。
- **Netlify：** 匯入 repository，Build command 留空，Publish directory 設為 `.`。`netlify.toml` 已提供靜態發佈設定。

## 教學目標

1. 先存下一部分零用錢，再規劃花費。
2. 認識投資風險、分散安排與耐心等待。

每關答對取得一把鑰匙與 100 分；答錯可讀取提示後重新作答。總成果依得分呈現理財進步狀態。內容為理財素養教育，不構成投資建議。

## 製作環境

目前工作區可直接部署為純靜態網頁。使用者提供的 `C:\Godot` 與 `C:\blender` 目錄在執行環境中不存在，因此本版本以原創 CSS 插畫呈現場景，未匯入 Godot 專案或 Blender 模型。
