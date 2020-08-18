<!DOCTYPE html>
<html>
<head>
    <title>Job Application</title>
</head>
	<body>
		<br/>
		<div>
        <strong>※本メールはプログラムから自動配信されています。</strong><br>
        @if($disclosed == 1)
        <br>------Temporary------
        <br>
        <br>Congratulations you have been disclosed.
        @else
        この度はJOBチョイスをご利用いただき、ありがとうございます。<br>
        JOBチョイス事務局より、ご応募いただいた求人【不採用】のご連絡となります。<br>

        <h3>ご応募いただいておりました下記のお仕事につきまして、誠に残念ながら企業様よりの不採用の通知がございました。</h3><br>
        【応募求人情報】<br>
        ■求人タイトル：{{$job['title']}}<br>
        ■雇用形態：{{$job['employment_type']}}<br>
        ■掲載期間：{{$job['publication']['published_start_date']}} to {{$job['publication']['published_end_date']}} <br>
        <br>
        ▼求人ページはこちら↓<br>
        <a href="">https://job-choice.jp/○○○○○○○</a><br>
	    </div>
        <hr>
		<br/>
		<div>
        【会社情報】<br>
        ■企業ID：{{$job['company']['id']}} <br>
        ■会社名：{{$job['company']['company_name']}}<br>
        ■住所：{{$job['company']['geolocation']['complete_address']}}～～～～<br>
        ■電話番号：{{$job['company']['user']['contact_no']}}<br>
        ■メールアドレス：{{$job['company']['user']['email']}}<br>
        ■登録日時：{{$job['company']['user']['created_at']}}<br>

        ▼会社情報はこちら↓<br>
        <a href="">https://job-choice.jp/○○○○○○○</a><br>

        今後とも、JOBチョイスで素敵なお仕事に出会えますよう願っております。<br>
        以上、よろしくお願いいたします。<br>
        <br>
        ____________________________________<br>
        みんなで届けるシェア型求人「JOBチョイス」<br>
        <a href="{{url(config('app.url'))}}">https://job-choice.jp</a><br>
        お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a><br>
        ____________________________________
        </div>
        @endif

	</body>
</html>
