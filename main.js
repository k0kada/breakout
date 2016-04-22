// phina.js をグローバル領域に展開
phina.globalize();

//ブロックの縦横幅
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'black';
  },
});

phina.define('Block', {
  //短形クラスを継承
  superClass: 'RectangleShape',
})

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'title', // メインシーンから開始する
  });

  document.body.appendChild(app.domElement);
  // アプリケーション実行
  app.run();
});
