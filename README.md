# NKCイベント作成支援アプリ Browser版
NKCキャンパスライフ イベントを作成支援するプラットフォーム

NKCキャンパスライフは名古屋工学院専門学校でイベントを作成するアプリです。
イベントによる上下のクラスのつながり、コミュニケーション能力向上をはかり遊び、勉強、就活などで役立てるのが目的です。

## 階層構造
```
├─api
│  ├─event
│  ├─member
│  └─other
├─php
└─public
    ├─css
    ├─html
    │  ├─create-user
    │  ├─event-list
    │  │  ├─detail
    │  │  │  └─attendance-confirmation
    │  │  └─new
    │  ├─group
    │  │  ├─group-detail
    │  │  │  └─chat
    │  │  ├─edit
    │  │  └─group-new
    │  ├─mypage
    │  │  └─event-participation
    │  └─sign_up
    ├─image
    ├─js
    │  └─general
    └─vender
```
## パスワードはhmac-sha256で暗号化してある。(鍵:sionunofficialoffer)DBに入っている値がそのまま入力されたパスワードではないので注意

## js cssのファイル名
* ページ間での共有ファイルは **general** ディレクトリの中に合った名前にする
* ページ単体で使う単体ファイルはjs cssファイルの直下にページと同じ名前でつける