<!DOCTYPE html>
<html>
<head>
    <title>パスワードのリセット</title>
</head>

<body>
    -----------------------------------------------------------------------------
    <br><strong>このメールは、登録メールアドレス宛に自動的にお送りしています。</strong><br>
    -----------------------------------------------------------------------------
    <br>こんにちは、JOBチョイス事務局です。
    <br>いつもJOBチョイスをご利用いただきまして、誠にありがとうございます。
    <br>パスワードの再設定は下記のURLから行うことができます。
    <br>
    <br>
    <br>____________________________
    <br>パスワードのリセット
    <br><a href="{{url(config('app.url').'/reset-password/'.$password_reset_token->token)}}">https://job-choice.jp/{{$password_reset_token->token}}</a>
    <br>____________________________
    <br>
    <br>※本メールに心当たりない場合は、このメールを破棄してくださいますようお願いたします
    <br>
    <br>それでは、今後ともJOBチョイスをよろしくお願いいたします。]
    <br>
    <br>__________________________________
    <br>
    <br>みんなで届けるシェア型求人「JOBチョイス」
    <br><a href="{{url(config('app.url'))}}">https://job-choice.jp</a>
    <br>お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
    <br>__________________________________
</body>
</html>
