<!DOCTYPE html>
<html>
<head>
    <title>Job Choice</title>
</head>

<body>
    <h4><strong>※本メールはプログラムから自動配信されています。</strong></h4>
    <p>この度はJOBチョイスをご利用いただき、ありがとうございます。</p>
    <h4><strong>以下の内容にて、お問い合わせを受け付け致しました。
                お送りいただきました内容を確認させて頂き、
                ご連絡を致しますので、もうしばらくお待ち下さいませ</strong></h4>
    【お問い合わせ内容】
    <br>
    ■問い合わせる方 :
    @switch($inquiry['inquirer'])
        @case('job_seeker/sharer') 仕事をお探しの方、お仕事をシェアしたい方 @break
        @case('company') 掲載をお考えの方 @break
        @case('others') その他 @break
    @endswitch<br>
    ■問い合わせの種類 : {{$inquiry['type']}}<br>
    ■氏名 : {{$inquiry['name']}}<br>
    ■メールアドレス : {{$inquiry['email']}}<br>
    ■携帯電話番号 : {{$inquiry['contact_no']}}<br>
    ■問い合わせ内容 : {{$inquiry['details']}}
    <br>
    __________________________________<br>
    <p>みんなで届けるシェア型求人「JOBチョイス」</p>
    <p><a href="{{url(config('app.url'))}}">https://job-choice.jp</a></p>
    <p>お問い合わせ・ご相談 <a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a></p>
    __________________________________
</body>

</html>
