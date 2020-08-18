<!DOCTYPE html>
<html>
<head>
    <!-- Title -->
    <title>JobChoice - Job Approval Status</title>

    <!-- Styles -->
    <style>
        html, body {
            background-color: #ffffff;
            font-family: 'Nunito', sans-serif;
            margin: 0;
        }

        .companyEmail-header {
            text-align: center;
            background: #f88561;
            color: #ffffff;
            padding: 15px;
        }

        .companyEmail-body {
            margin-top: 100px;
            height: 100vh;
            padding: 20px 30px;
        }

        a {
            color: #ffffff;
            text-decoration: none;
        }

        #job-link {
            color: #ffc800;
            font-size: 1.5rem;
        }

        .companyEmail-footer {
            font-size: 1rem;
            background: #f88561;
            color: #ffffff;
            padding: 15px;
            position: relative;
            text-align: center;
        }
        </style>
</head>

<body>
    <div class='companyEmail-header'>
        <h4>※本メールはプログラムから自動配信されています。</h4>
    </div>
    <div class='companyEmail-body'>
        <div>
            <span>この度はJOBチョイスをご利用いただき、ありがとうございます。</span><br />
            <span>JOBチョイス事務局より、作成された求人ページについてご連絡です。</span><br /><br />
            @if($approval_status =='approved')
            <span>この度、作成された求人ページが無事審査を完了し、掲載となりました。</span><br />
            <span>以下、記入内容となりますので、ご確認くださいませ。</span><br />
            @else
            <span>ご記載の内容に不備を発見し、差し戻しいたしました。</span><br />
            <span>以下、記入内容をご確認いただき、修正いただきますようお願いいたします。</span><br /><br />
            @endif
        </div>
        @if($approval_status == 'rejected')
        <div>
            <h2>※まだ掲載は開始されておりません。下記を修正し、再度掲載申請を行っていただきますようお願い致します。</h2><br /><br />
        </div>
        @endif
        <div>
            <span>【求人情報】</span><br />
            <ul>
                <li>求人タイトル： {{$job['title']}}</li>
                <li>雇用形態：{{$job['employment_type']}}</li>
                <li>掲載期間：{{$job['publications']['published_start_date']}} ～ {{$job['publications']['published_end_date']}}</li>
            </ul>
        </div>
        @if($approval_status == 'rejected')
        <div>
            <span>※まだ掲載は開始されておりません。下記を修正し、再度掲載申請を行っていただきますようお願い致します。</span><br />
            <p>{{$job['notes']['notes']}}</p>
        </div>
        @endif
        <div>
            <span>▼求人ページはこちら↓</span><br />
            <a id="job-link" href="{{url(config('app.url').'/job-detail/'.$job['id'])}}">https://job-choice.jp/{{$job['id']}}</a><br /><br />
            @if($approval_status === "approved")
            <span>求職者からの応募がございましたら、お早めに開示・落選の対応をお願いいたします。</span><br /><br />
            <span>応募から7日間経っても応募者の開示・落選対応がなされない場合、</span><br />
            <span>ご利用いただいているアカウントが停止されますので、ご注意ください。</span><br /><br />
            @endif
            <span>以上、よろしくお願いいたします。</span>
        </div>
    </div>
    <div class='companyEmail-footer'>
        <span>みんなで届けるシェア型求人「JOBチョイス」</span><br />
        <a href="{{url(config('app.url'))}}">https://job-choice.jp</a><br />
        <span>お問い合わせ・ご相談　</span><a href="{{url(config('app.url').'/contact/')}}">https://job-choice.jp/contact</a><br />
    </div>
</body>

</html>
