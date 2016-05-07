// phina.js をグローバル領域に展開
phina.globalize();

//ブロックの縦横幅
var BLOCK_WIDTH = 40 * 2;
var BLOCK_HEIGHT = 60 / 2;

var PADDLE_WIDTH = BLOCK_WIDTH * 1.5;
var PADDLE_HEIGHT = BLOCK_HEIGHT;
var BALL_RADIUS = BLOCK_WIDTH / 8;

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    //親クラス初期化
    this.superInit();
    // 背景色を指定
    this.backgroundColor = 'black';

    //ブロック管理用のグループ
    this.block_group = DisplayElement().addChildTo(this);
    //位置判定のrect
    var screen_rect = Rect(0, 0, 640, 960);

    var self = this;
    //ブロック設置
    for (var span_x = 2; span_x < 16; span_x += 2) {
      for (var span_y = 1; span_y < 4; span_y += 0.5) {
        Block().addChildTo(self.block_group).setPosition(self.gridX.span(span_x), self.gridY.span(span_y));
      }
    }

    //パドルのY軸
    var paddle_y = this.gridY.span(14.5);
    //パドル設置
    var paddle = Paddle().addChildTo(this).setPosition(this.gridX.center(), paddle_y);
    //タッチ移動
    this.onpointmove = function(e) {
      paddle.setPosition(e.pointer.x | 0, paddle_y);
      //画面はみ出し
      if (paddle.left < screen_rect.left) {
        paddle.left = screen_rect.left;
      }
      if (paddle.right > screen_rect.right) {
        paddle.right = screen_rect.right;
      }
    };
    //ボール作成
    this.ball = Ball().addChildTo(this);
    //スコープを広げる
    this.paddle = paddle;
  },

  //毎フレーム更新
  update: function() {
    var ball = this.ball;
    var paddle = this.paddle;

    //ボールをパドルの上に置く
    ball.x = paddle.x;
    ball.bottom = paddle.top;
  },

});

//ブロッククラス
phina.define('Block', {
  //短形クラスを継承
  superClass: 'RectangleShape',
  init: function() {
    this.superInit({
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
    });
  },
});

//パドルクラス
phina.define('Paddle', {
  //短形クラスを継承
    superClass: 'RectangleShape',
    init: function() {
      this.superInit({
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        fill: 'silver',
      });
    },
});

//ボールクラス
phina.define('Ball', {
  //円のクラスを継承
  superClass: 'CircleShape',
  init: function() {
    this.superInit({
      radius: BALL_RADIUS,
      fill: 'silver',
    });
  },
});


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
