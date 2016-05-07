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

    //画面上でタッチが離れた時
    this.onpointend = function() {
      if (self.status === 'ready') {
        //ボール発射
        self.ball.vy = -self.ball.speed;
        self.status = 'move';
      }
    };

    //ボール作成
    this.ball = Ball().addChildTo(this);
    //スコープを広げる
    this.paddle = paddle;
    this.screen_rect = screen_rect;
    this.status = 'ready';
  },

  //毎フレーム更新
  update: function() {
    var ball = this.ball;
    var paddle = this.paddle;
    var screen_rect = this.screen_rect;

    //ボール待機中
    if (this.status === 'ready') {
      //ボール移動量
      ball.vx = 0;
      ball.vy = 0;
      //ボールをパドルの上に置く
      ball.x = paddle.x;
      ball.bottom = paddle.top;
    }
    //ボール移動中
    if (this.status === 'move') {
      ball.moveBy(ball.vx, ball.vy);
      //画面端での反射
      //上端
      if (ball.top < screen_rect.top) {
        ball.vy = -ball.vy;
      }
      //左端
      if (ball.left < screen_rect.left) {
        ball.vx = -ball.vx;
      }
      //右端
      if (ball.right > screen_rect.right) {
        ball.vx = -ball.vx;
      }

      //パドルとの反射
      if (ball.hitTestElement(paddle) && ball.vy > 0) {
        ball.vy = -ball.vy;
        //パドルに当たった位置で角度を変化させる
        var dx = paddle.x - ball.x;
        ball.vx = -dx / 5;
      }

      //ブロックとの反射
      this.block_group.children.some(function(block) {
        if (ball.hitTestElement(block)) {
          //左上角にヒット
          if (ball.top < block.top && ball.left < block.left) {
            ball.vx = -ball.speed;
            ball.vy = -ball.speed;
            block.remove();
            return;
          }
          //右上角
          if (ball.top < block.top && block.right < ball.right) {
            ball.vx = ball.speed;
            ball.vy = -ball.speed;
            block.remove();
            return;
          }
          //左下角
          if (block.bottom < ball.bottom && ball.left < block.left) {
            ball.vx = -ball.speed;
            ball.vy = ball.speed;
            block.remove();
            return;
          }
          //右下角
          if (block.bottom < ball.bottom && block.right < ball.right) {
            ball.vx = ball.speed;
            ball.vy = ball.speed;
            block.remove();
            return;
          }
          //左側面
          if (block.left < block.left) {
            ball.vx = -ball.vx;
            block.remove();
            return;
          }
          //右側面
          if (block.right < ball.right) {
            ball.vx = -ball.vx;
            block.remove();
            return;
          }
          //上部
          if (ball.top < block.top) {
            ball.vy = -ball.vy;
            block.remove();
            return;
          }
          //下部
          if (block.bottom < ball.bottom) {
            ball.vy = -ball.vy;
            block.remove();
            return;
          }
        }
      });

      //死亡
      if (ball.top > screen_rect.bottom) {
        this.status = 'ready';
      }
    }
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
    //ボールスピード
    this.speed = 6;
  },
});


// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'title', // メインシーンから開始する
  });
  //fps変更
  app.fps = 60;

  document.body.appendChild(app.domElement);
  // アプリケーション実行
  app.run();
});
