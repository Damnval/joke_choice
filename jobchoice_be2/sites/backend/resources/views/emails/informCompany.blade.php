<!DOCTYPE html>
<html>
<head>
    <title>【JOBチョイス：重要】作成した求人に応募がありました。</title>
    <style type="text/css">
    h3.remarkup-header {
        font-size: 18px;
        line-height: 1.375em;
        margin: 20px 0 4px;
    }
    h2.remarkup-header {
        font-size: 20px;
        line-height: 1.5em;
        margin: 20px 0 4px;
    }
    </style>
</head>
<body>
    <h3 class="remarkup-header">※本メールはプログラムから自動配信されています。</h3>
    <p>この度はJOBチョイスをご利用いただき、ありがとうございます。<br>
    JOBチョイス事務局より、作成された求人に応募がありましたのでご連絡です。</p>

    <h2 class="remarkup-header">以下、求人情報からお早めに開示・落選の対応をお願いいたします。</h2>

    <p>【求人情報】<br>
    ■求人タイトル：{{$job->title}}<br>
    ■雇用形態：{{$job->employment_type}}<br>
    ■掲載期間：{{$job->publication->published_start_date}} ～ {{$job->publication->published_end_date}}</p>
    <p>▼応募確認はこちら↓</p>

    <h2 class="remarkup-header">
        <a href="https://job-choice.jp/○○○○○○○" class="remarkup-link" target="_blank" rel="noreferrer">
            https://job-choice.jp/○○○○○○○
        </a>
    </h2>

    <p>応募から7日間経っても応募者の開示・落選対応がなされない場合、<br>
    ご利用いただいているアカウントが停止されますので、ご注意ください。</p>

    <p>
    以上、よろしくお願いいたします。<br>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br>
    みんなで届けるシェア型求人「JOBチョイス」<br>
    <a href="{{url(config('app.url'))}}" class="remarkup-link" target="_blank" rel="noreferrer">
        https://job-choice.jp
    </a><br>
    お問い合わせ・ご相談　
    <a href="{{url(config('app.url').'/contact')}}" class="remarkup-link" target="_blank" rel="noreferrer">
        https://job-choice.jp/contact
    </a><br>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </p>
</body>
</html>

