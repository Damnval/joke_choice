<!DOCTYPE html>
<html>
<head>
    <title>確認メール成功</title>
</head>

<body>
    <br><strong>※本メールはプログラムから自動配信されています。</strong>
    <br>この度はJOBチョイスにご登録いただき、ありがとうございました。
    <br>
    <br>
    <br><strong>登録が完了したことをお伝えいたします。</strong>
    <br>【登録内容】
    <br> ■ユーザーID：{{$user->id}}
    <br> ■ユーザー名：{{$user->last_name}} {{$user->first_name}} 
    <br> ■ニックネーム： {{$user->job_seeker['nickname']}}
    <br> ■住所：
        @if($user->type == 'company')
            {{$user->company->geolocation['complete_address']}}
        @else
            {{$user->job_seeker->geolocation['complete_address']}}
        @endif
    <br> ■電話番号：{{$user->contact_no}}
    <br> ■メールアドレス：{{$user->email}}
    <br>
    <br>マイページはこちら↓
    <br><a href ="{{url(config('app.url'))}}"><strong>https://job-choice.jp/○○○○○○○</strong></a>
    <br>ご不明点などありましたら下記からお気軽にご連絡下さい。
    <br>お問い合わせ・ご相談 <a href ="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
    <br>素敵なお仕事に出会えますように願っております。
    <br>宜しくお願い致します。
    <br>__________________________________
    <br>
    <br>みんなで届けるシェア型求人「JOBチョイス」
    <br><a href="{{url(config('app.url'))}}">https://job-choice.jp</a>
    <br>お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
    <br>__________________________________
</body>
</html>
