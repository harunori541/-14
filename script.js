
let recognition;  // 音声認識オブジェクト

// 音声認識を開始する関数

function startRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Web Speech APIはこのブラウザでサポートされていません。');
        return;
    }

    recognition = new webkitSpeechRecognition();  // 音声認識オブジェクトを作成
    recognition.lang = 'ja-JP';  // 日本語を認識するように設定
    recognition.interimResults = false;  // 中間結果を取得しない
    recognition.continuous = false;  // 音声認識を連続して行わない

    // 音声認識が開始されたときのイベントハンドラー
    recognition.onstart = function() {
        console.log('音声認識を開始しました。');
        document.getElementById('startButton').disabled = true;  // 開始ボタンを無効化
        document.getElementById('stopButton').disabled = false;  // 停止ボタンを有効化
    };

    // 音声認識の結果を処理
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;  // 認識されたテキストを取得
        document.getElementById('result').innerText = transcript;  // 認識結果を表示
        addToHistory(transcript);  // 結果を履歴に追加
        translateText(transcript);  // 結果を翻訳
    };

    // 音声認識中にエラーが発生したときのイベントハンドラー
    recognition.onerror = function(event) {
        console.error('音声認識エラー:', event.error);
    };

    // 音声認識が終了したときのイベントハンドラー
    recognition.onend = function() {
        console.log('音声認識が終了しました。');
        document.getElementById('startButton').disabled = false;  // 開始ボタンを有効化
        document.getElementById('stopButton').disabled = true;  // 停止ボタンを無効化
    };

    recognition.start();  // 音声認識を開始
}

// 音声認識を停止する関数
function stopRecognition() {
    if (recognition) {
        recognition.stop();  // 音声認識を停止
    }
}

// 認識結果を履歴に追加する関数
function addToHistory(transcript) {
    const historyList = document.getElementById('historyList');  // 履歴リストの要素を取得
    const listItem = document.createElement('li');  // 新しいリストアイテムを作成
    listItem.innerText = transcript;  // 認識結果をリストアイテムに設定
    historyList.appendChild(listItem);  // リストアイテムを履歴リストに追加
}

// 認識結果を翻訳する関数
function translateText(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`;  // 翻訳APIのURLを設定

    fetch(url)
        .then(response => response.json())  // APIからのレスポンスをJSON形式で取得
        .then(data => {
            const translation = data.responseData.translatedText;  // 翻訳結果を取得
            document.getElementById('translatedResult').innerText = translation;  // 翻訳結果を表示
        })
        .catch(error => console.error('翻訳エラー:', error));  // エラーが発生した場合にコンソールに表示
}

// 認識結果を音声で読み上げる関数
function speakText() {
    const text = document.getElementById('result').innerText;  // 認識結果のテキストを取得
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);  // 音声合成オブジェクトを作成
        utterance.lang = 'ja-JP';  // 日本語で読み上げるように設定
        window.speechSynthesis.speak(utterance);  // テキストを読み上げ
    }
}