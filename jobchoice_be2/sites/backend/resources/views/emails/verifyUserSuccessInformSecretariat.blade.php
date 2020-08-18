<!DOCTYPE html>
<html>
<head>
    <title>確認メール成功</title>
</head>

<body>
    <br><strong>※本メールはプログラムから自動配信されています。</strong>
    <br>JOBチョイスにユーザーの登録がありました。
    <br>
    <br>【ユーザー情報】
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
    <br> ■登録日時：{{$user->email_verified_at}}
    <br>
    <br>▼ユーザー情報はこちら↓
    <br><a href ="{{url(config('app.url'))}}"><strong>https://job-choice.jp/○○○○○○○</strong></a>
    <br>__________________________________
    <br>
    <br>みんなで届けるシェア型求人「JOBチョイス」
    <br><a href="{{url(config('app.url'))}}">https://job-choice.jp</a>
    <br>お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
    <br>__________________________________
</body>
</html>
