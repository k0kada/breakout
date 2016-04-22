// phina.js をグローバル領域に展開
phina.globalize();

//ブロックの縦横幅
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    //親クラス初期化
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'black';

    //ブロック管理用のグループ
    this.blockGroup = DisplayElement().addChildTo(this);
    var self = this;
    for (var spanX = 2; spanX < 16; spanX += 2) {
      for (var spanY = 1; spanY < 4; spanY += 0.5) {
        Block().addChildTo(self.blockGroup).setPosition(self.gridX.span(spanX), self.gridY.span(spanY));
      }
    }
  },
});

phina.define('Block', {
  //短形クラスを継承
  superClass: 'RectangleShape',
  init: function() {
    this.superInit({
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
    });
  }
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
