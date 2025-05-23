import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly NODE = 'http://sym-test-03.opening-line.jp:3000/';
  private facade: any = null;
  private isSymbolSDKInitialized = false;

  private readonly AlicePrivateKey =
    '33047CFD3ABA8E1B6FE047182F9B0118E2FA7E7D9E33865533AB582973F3B2A8';
  private readonly AlicePublicKey =
    'ABC57E7B68FF6AA2E5F3D7E674D071697F00F1B377AE484C1EDBA3EEB29761B8';
  private readonly BobAddress = 'TCSMJNJTRI76YPGQFDEZBFL3XTM4L3AWELOGBDY';

  constructor() {}

  // Symbol SDKの動的初期化
  private async initializeSymbolSDK() {
    if (this.isSymbolSDKInitialized && this.facade) {
      return;
    }

    try {
      // ブラウザ環境チェック
      if (typeof window !== 'undefined') {
        console.log('Symbol SDK を動的に初期化中...');

        // Symbol SDKを動的インポート
        const { SymbolFacade } = await import('symbol-sdk/symbol');

        // Facadeの初期化
        this.facade = new SymbolFacade('testnet');
        this.isSymbolSDKInitialized = true;

        console.log('Symbol SDK 初期化完了');
      }
    } catch (error) {
      console.error('Symbol SDK 初期化エラー:', error);
      throw error;
    }
  }

  // Symbol SDKを使ったトランザクション処理
  async showAlert(message: string = 'Hello World!') {
    try {
      console.log('Symbol トランザクション処理を開始...');

      // Symbol SDKを動的に初期化
      await this.initializeSymbolSDK();

      if (!this.facade) {
        throw new Error('Symbol SDK の初期化に失敗しました');
      }

      // Symbol SDKのクラスを動的インポート
      const { KeyPair, models } = await import('symbol-sdk/symbol');
      const { PrivateKey } = await import('symbol-sdk');

      // キーペアの作成
      const keyPair = new KeyPair(new PrivateKey(this.AlicePrivateKey));

      // トランザクション作成
      const symbolMessage = 'Hello, Symbol!';
      const transaction = this.facade.transactionFactory.create({
        type: 'transfer_transaction_v1',
        signerPublicKey: this.AlicePublicKey,
        deadline: this.facade.network.fromDatetime(new Date()).addHours(2)
          .timestamp,
        recipientAddress: this.BobAddress,
        mosaics: [
          { mosaicId: BigInt('0x72c0212e67a08bce'), amount: BigInt('1000000') },
        ],
        message: symbolMessage,
      });

      // 手数料設定
      transaction.fee = new models.Amount(BigInt(transaction.size * 100));

      // 署名
      const sig = this.facade.signTransaction(keyPair, transaction);
      const jsonPayload = this.facade.transactionFactory.static.attachSignature(
        transaction,
        sig
      );

      console.log('JSON Payload:', jsonPayload);

      // トランザクション送信
      const res = await fetch(new URL('/transactions', this.NODE), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload,
      }).then((res) => res.json());

      console.log('結果発表', res);

      // 成功時のアラート
      alert(
        `${message}\n\nSymbol トランザクション送信完了！\n結果: ${JSON.stringify(
          res,
          null,
          2
        )}`
      );
    } catch (error) {
      console.error('Symbol トランザクションエラー:', error);
      alert(`エラーが発生しました: ${error}`);
    }
  }

  // 確認ダイアログを表示
  showConfirm(message: string): boolean {
    return confirm(message);
  }

  // カスタムメッセージでアラート
  showCustomAlert(title: string, message: string) {
    alert(`${title}: ${message}`);
  }

  // シンプルなアラート（Symbol処理なし）
  showSimpleAlert(message: string) {
    alert(message);
  }
}
