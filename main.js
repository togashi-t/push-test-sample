document.addEventListener("DOMContentLoaded", () => {
  console.log("通過点1");

  // HTMLの属性値からVAPID公開鍵とCSRFトークンを取得
  const pushConfig = document.getElementById("push-config");
  if (!pushConfig) {
    console.error("push-config要素がない");
    return;
  }

  const vapidPublicKey = pushConfig.getAttribute("data-vapid-public-key");
  console.log("VAPID Public Key:", vapidPublicKey);

  // ボタンのクリックイベントを設定
  const subscribeButton = document.getElementById("subscribe-button");
  subscribeButton.addEventListener("click", () => {
    Notification.requestPermission().then((permission) => {
      console.log(permission);
      // Service WorkerとPush Managerのサポートを個別に確認
      const isServiceWorkerSupported = "serviceWorker" in navigator;
      const isPushManagerSupported = "PushManager" in window;
      console.log("Service Workerサポート状況:", isServiceWorkerSupported);
      console.log("Push Managerサポート状況:", isPushManagerSupported);

      // if ("serviceWorker" in navigator && "PushManager" in window) {
      // console.log("Service WorkerおよびPush Managerはサポートされている");

      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker登録成功。登録スコープ:",
            registration.scope
          );

          navigator.serviceWorker.ready.then((sw) => {
            console.log("pushManager in sw", "pushManager" in sw);
          });

          registration.pushManager.getSubscription().then((subscription) => {
            const options = {
              userVisibleOnly: true,
              applicationServerKey: vapidPublicKey,
            };

            return registration.pushManager
              .subscribe(options)
              .then((pushSubscription) => {
                console.log("ユーザーが購読しました:", pushSubscription);

                // 購読情報をconsole.logで出力
                const endpoint = pushSubscription.endpoint;
                const keys = pushSubscription.toJSON().keys;
                const p256dh = keys.p256dh;
                const auth = keys.auth;

                console.log(pushSubscription);
                console.log("Endpoint:", endpoint);
                console.log("p256dh:", p256dh);
                console.log("auth:", auth);
              })
              .catch((error) => {
                console.error("Pushサブスクリプションのエラー:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Service Worker登録失敗:", error);
        });
      // } else {
      //   console.warn("プッシュメッセージングはサポートされていません");
      // }
    });
  });
});
