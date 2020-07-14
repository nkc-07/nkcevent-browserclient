# NKCイベント作成支援アプリ Browser版

## 階層構造
```
├─api
│  ├─event
│  ├─member
│  └─other
├─php
└─public
    ├─create-user
    ├─css
    ├─event-list
    │  └─detail
    ├─image
    │  └─svg
    ├─js
    ├─mypage
    │  └─event-participation
    └─vender
```
## パスワードはhmac-sha256で暗号化してある。(鍵:sionunofficialoffer)DBに入っている値がそのまま入力されたパスワードではないので注意