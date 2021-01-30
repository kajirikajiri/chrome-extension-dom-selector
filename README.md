https://github.com/kajirikajiri/next-puppeteer

task

- [x] 未ログインからのログイン成功時に何も表示されない

  - [x] ログイン済みからだと表示されるよ

- [x] listenLogin っている？（いらない

- [x] それぞれの画面のサイズが適当すぎる

  - [x] 基本サイズを決めるかデザインの確定 クラスにしたよ

- [x] logout にキャンセルボタン系(ふようになったよ)

- [x] ログアウト機能
- [x] recording を停止する
- [ ] 不要な recording を削除する
- [x] recording したデータを firestore に送る
- [x] firestore から recording データを取得する
- [x] firestore から取得した recording データを表示する
- [x] firestore から取得したデータを実行する

  - [x] click は click
  - [ ] input は input

- [x] 環境変数の取り扱い

  - [x] firebase は heroku と vercel に分散して、chrome-extension から剥がした。
    - 最初どうしようかと思ったが、iframe に next vercel を埋め込んで vercel に環境変数をもたせた。
    - api は普通に heroku に

- [x] click した element を取得
- [ ] input した text を取得

- [ ] 定期実行？

- [ ] listerner の remove

- [ ] sendmessage next-puppeteer refactor 重複

- [ ] api の確認してない

- [ ] それぞれに削除機能の実装

  - [ ] event 一覧(recording 時)
  - [ ] event 一覧(一覧表示時)

- [ ] それぞれに編集機能の実装

  - [ ] event 一覧(recording 時)
  - [ ] event 一覧(一覧表示時)

- [ ] それぞれに編集機能の追加

  - [ ] event 一覧のラベル(recording 時)
  - [ ] event 一覧のラベル(一覧表示時)

- [ ] サイトの URL を判定してそのサイトの URL に紐づく selector を出す

  - 微妙な気がする。サイトをまたぐ可能性もある

- [ ] dom の出現を待機してクリックする

- [x] 環境を意識したくない

  - dotenv を使用した

- [x] api を本番につなぐ

- [x] prettier,lint ほしいなー

- [ ] loading 中にアイコンを押したら、押したことをわかるようにしたい

- [x] recording stop

- [ ] 過去のイベントが残っていた場合、破棄するか、継続か選ぶ

- [ ] session 作る。それが正しくない場合、通信できない

- [ ] 削除

- [ ] 入力値のバリデーションを送信前に
