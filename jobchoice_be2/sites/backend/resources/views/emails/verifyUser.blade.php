<!DOCTYPE html>
<html>
<head>
    <title>確認メール</title>
</head>

<body>
    <br><strong>このメールは、登録メールアドレス宛に自動的にお送りしています。</strong>
    <br>こんにちは、JOBチョイス事務局です。
    <br>この度はJOBチョイスにご登録いただき、ありがとうございます。
    <br>
    <br>
    <br>まだ登録の手続きは完了していません。
    <br>下記URLをクリックし、メールアドレスの認証を行うことで会員登録が完了いたします。
    <br><a href="{{url(config('app.url').'/register/form/1/'.$user->type.'/'.$user->custom_token->token)}}">Eメールを確認します</a>
    <br>
    <br>
    <br>なお、本URLはセキュリティ対策のため、2時間のみ有効なURLとなっております。
    <br>もし、期限を過ぎてしまった場合には、お手数ですが以下のURLより認証メール再送の手続きを行ってください。
    <br><a href="{{url(config('app.url').'/email-registration/'.$user->type)}}">もう一度メールを登録する</a>
    <br>
    <br/>※JOBチョイスへの登録を開始された覚えのない場合は、このメールを破棄してくださいますようお願いたします。
    <br>
    <br>▼利用規約はこちらからご確認ください
    @if($user->type =='company')
    <br><a href="{{url(config('app.url').'/agreement-company')}}">https://job-choice.jp/agreement-company</a>
    @else
    <br><a href="{{url(config('app.url').'/agreement')}}">https://job-choice.jp/agreement</a>
    @endif
    <br>
    <br>__________________________________
    <br>
    <br>みんなで届けるシェア型求人「JOBチョイス」
    <br><a href="{{url(config('app.url'))}}">https://job-choice.jp</a>
    <br>お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
    <br>__________________________________
</body>
</html>
