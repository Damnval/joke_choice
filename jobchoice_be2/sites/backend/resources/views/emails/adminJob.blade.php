<!DOCTYPE html>
<html>
<head>
    <!-- Title -->
    <title>JobChoice - Job Opportunity</title>

    <!-- Styles -->
    <style>
        html, body {
            background-color: #ffffff;
            font-family: 'Nunito', sans-serif;
            margin: 0;
        }

        .adminEmail-header {
            text-align: center;
            background: #f88561;
            color: #ffffff;
            padding: 15px;
        }

        .adminEmail-body {
            text-align: left;
            height: 100vh;
      		padding:30px;
        }

        a {
            color: #ffc800;
            text-decoration: none;
        }

        .adminEmail-footer {
            font-size: 0.5rem;
            background: #f88561;
            color: #ffffff;
            padding: 15px;
            position: relative;
        }

       .adminEmail-border{
            border-bottom: 1px solid #000000;
        }
        </style>
</head>

<body>
    <div class='adminEmail-header'>
        <h4>【JOBチョイス求人連絡】求人ページが作成されました。</h4>
    </div>
    <div class='adminEmail-body'>
        <h4>※本メールはプログラムから自動配信されています。</h4>
        	求人が作成されました
      		<br />
           承認確認をお願いします。
      		<br />
            <br />
         【求人情報】
      		<br />
           ■求人タイトル：{{$job['title']}}
            <br />
           ■雇用形態：{{$job['employment_type']}}
  		    <br />
  		   ■掲載期間：2019/1/1 to 2019/3/1
           <br />
      	   <br />
      	   ▼求人ページはこちら↓
           <br />
           <a> https://job-choice.jp/○○○○○○○</a>
           <br />
           <br />
           <div class='adminEmail-border'></div>
           <br />
           【会社情報】
           <br />
             ■企業ID：{{$company['id']}}
    	   <br />
             ■会社名： {{$company['company_name']}}
     	   <br />
             ■住所：{{$geolocation['complete_address']}}
     	   <br />
             ■電話番号：{{$company['user']['contact_no']}}
           <br />
             ■メールアドレス：{{$company['user']['email']}}
     	   <br />
             ■登録日時：{{$company['created_at']}}
      	   <br />
           <br />
             ▼会社情報はこちら↓
     	   <br />
             http://～～～～jobchoice.jp
      	   <br />
           <br />
           <div class='adminEmail-border'></div>
           <br />
           <br />みんなで届けるシェア型求人「JOBチョイス」
           <br /><a href="{{url(config('app.url'))}}">https://job-choice.jp</a>
           <br />お問い合わせ・ご相談　<a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a>
           <br />

    </div>
    <div class='adminEmail-footer'>
        <span>Copyright © JOBチョイス | MEDIAFLAG沖縄 All Rights Reserved.</span>
    </div>
</body>

</html>
