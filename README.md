chat application for my practice.  
referance: socket.io tutorial https://socket.io/docs/v4/tutorial/introduction  
  
socket.ioのチュートリアルで作成するチャットアプリをベースに、色々な機能を追加実装してみた。
  
フォルダ構成:  
<pre>
.
├── LICENSE
├── README.md
├── backend
│   ├── controller.js
│   ├── logic.js
│   ├── model
│   │   ├── dao.js
│   │   ├── dto.js
│   │   └── query.js
│   ├── server.js
│   └── setting.js
├── db
├── frontend
│   ├── static
│   │   ├── css
│   │   │   └── chat.css
│   │   ├── html
│   │   └── js
│   │       ├── chat.js
│   │       └── chatcreate.js
│   └── views
│       ├── chat.ejs
│       ├── chatcreate.ejs
│       ├── chatlist.ejs
│       └── signin.ejs
├── package-lock.json
└── package.json
</pre>

## 認証機能  
ユーザIDとパスワードを使った認証機能を実装した。  
## チャット機能  
個別チャット機能を実装した。個別チャットの作成時は、ユーザIDを検索してメンバーを招待できる仕様にした。  
