chat application for my practice.  
referance: socket.io tutorial https://socket.io/docs/v4/tutorial/introduction  
  
socket.ioのチュートリアルで作成するチャットアプリをベースに色々な機能を追加実装してみる.  
  
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
