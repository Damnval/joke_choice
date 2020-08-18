<!DOCTYPE html>
<html>
<head>
    <title>【JOBチョイス：通知】求人への応募が完了しました。</title>
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
    hr {
        height: 1px;
        background: #bbb;
        border: none;
    }
    </style>
</head>
<body>
    <h3 class="remarkup-header">※本メールはプログラムから自動配信されています。</h3>
    <p>この度はJOBチョイスに登録いただき、ありがとうございます。<br>
    JOBチョイス事務局より、求人応募を受け付けたことをご連絡いたします。</p>

    <p>ご応募いただいた内容の当落選のご連絡は、企業様よりございますので、</p>

    <h2 class="remarkup-header">今しばらくお待ちくださいませ。</h2>

    <p>【応募求人情報】<br>
    ■求人タイトル：{{$job->title}}<br>
    ■雇用形態：{{$job->employment_type}}<br>
    ■掲載期間：{{$job->publication->published_start_date}} ～ {{$job->publication->published_end_date}}</p>
    <p>▼求人ページはこちら↓<br>
    {{config('url')}}</p>

    <hr class="remarkup-hr">

   <p>【会社情報】<br>
    ■会社名：{{$company->company_name}}<br>
    ■住所：{{$company->geolocation->complete_address}}<br>
    ■電話番号：{{$company->user->contact_no}}<br>
    ■メールアドレス：{{$job->mail_reply_email_address}}<br>
    ■登録日時：{{$company->user->created_at}}</p>

    <p>▼会社情報はこちら↓<br>
    {{config('url')}}</p>

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

