<!DOCTYPE html>
<html>
<head>
    <title>インセンティブ報酬</title>
</head>

<body>
    <br><strong>※本メールはプログラムから自動配信されています。</strong>
    <br>この度はJOBチョイスをご利用いただき、ありがとうございます。
    <br>JOBチョイス事務局より、シェア報酬確定のご連絡です。
    <br>
    <br><h4><strong>あなたのシェアから応募があり、応募者情報が企業に開示されたため、シェア報酬が確定いたしました。</strong></h4>
    <br>【紹介情報】
    <br>■応募者ニックネーム：{{$job_seeker['user']['first_name']}}
    <br>■応募求人：{{$job['description']}}
    <br>■シェア報酬額：{{$job['incentive_per_share']}}
    <br>
    <br> 詳しくはシェア履歴よりご確認下さい。
    <br>https://job-choice.jp/○○○○○○○
    <br>
    <br>以上、よろしくお願いいたします
    <br>
    <br>__________________________________
    <br>
    <br>みんなで届けるシェア型求人「JOBチョイス」
    <br><a href="{{url(config('app.url'))}}">https://job-choice.jp</a>
    <br>お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
    <br>__________________________________
</body>
</html>
