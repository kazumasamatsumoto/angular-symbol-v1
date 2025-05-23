import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-symbol-v1';

  // AlertServiceを注入
  private alertService = inject(AlertService);

  // Symbol SDKトランザクション処理を実行
  async showAlert() {
    await this.alertService.showAlert();
  }

  // 他のボタン用のメソッド例
  showCustomMessage() {
    this.alertService.showCustomAlert(
      'カスタム',
      'サービスから呼び出されました！'
    );
  }

  showConfirmDialog() {
    const result = this.alertService.showConfirm('続行しますか？');
    if (result) {
      this.alertService.showSimpleAlert('OKが押されました！');
    }
  }

  // シンプルなアラート（Symbol処理なし）
  showSimpleAlert() {
    this.alertService.showSimpleAlert('シンプルなアラートです');
  }
}
