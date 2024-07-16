// プッシュイベントのリスナーを追加
self.addEventListener('push', function(event) {
    console.log('pushイベントを検知');
    if (event.data) {
        const jsonData = event.data.json();
        console.log('pushのデータ内容:', jsonData);

        const options = {
            body: jsonData.body,
            // icon: '/assets/images/favicon.png',
            data: { url: jsonData.url }
        };

        // プッシュ通知を表示
        event.waitUntil(
            self.registration.showNotification(jsonData.title, options)
        );
    } else {
        console.log('pushのデータがない');
    }
});

// 通知クリックイベントのリスナーを追加
self.addEventListener('notificationclick', function(event) {
    console.log('push通知のクリックを検知');
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
