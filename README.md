https://github.com/kajirikajiri/next-puppeteer

task
- [x] 未ログインからのログイン成功時に何も表示されない
  - [x] ログイン済みからだと表示されるよ

- [x] listenLoginっている？（いらない

- [x] それぞれの画面のサイズが適当すぎる
  - [x] 基本サイズを決めるかデザインの確定 クラスにしたよ

- [x] logoutにキャンセルボタン系(ふようになったよ)

- [x] ログアウト機能
- [x] recordingを停止する
- [ ] 不要なrecordingを削除する
- [x] recordingしたデータをfirestoreに送る
- [x] firestoreからrecordingデータを取得する
- [x] firestoreから取得したrecordingデータを表示する
- [x] firestoreから取得したデータを実行する
	- [x] clickはclick
	- [ ] inputはinput

- [x] 環境変数の取り扱い
  - [x] firebaseはherokuとvercelに分散して、chrome-extensionから剥がした。
    - 最初どうしようかと思ったが、iframeにnext vercelを埋め込んでvercelに環境変数をもたせた。
    - apiは普通にherokuに

- [x] clickしたelementを取得
- [ ] inputしたtextを取得

- [ ] 定期実行？

- [ ] listernerのremove

- [ ] sendmessage next-puppeteer refactor 重複

- [ ] apiの確認してない

- [ ] それぞれに削除機能の実装
  - [ ] event一覧(recording時)
  - [ ] event一覧(一覧表示時)

- [ ] それぞれに編集機能の実装
  - [ ] event一覧(recording時)
  - [ ] event一覧(一覧表示時)

- [ ] それぞれに編集機能の追加
  - [ ] event一覧のラベル(recording時)
  - [ ] event一覧のラベル(一覧表示時)

- [ ] サイトのURLを判定してそのサイトのURLに紐づくselectorを出す
  - 微妙な気がする。サイトをまたぐ可能性もある

- [ ] domの出現を待つ

- [x] 環境を意識したくない
  - dotenvを使用した

- [ ] apiを本番につなぐ