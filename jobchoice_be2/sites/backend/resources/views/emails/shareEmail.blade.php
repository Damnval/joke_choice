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

        .shareEmail-header {
            text-align: center;
            background: #f88561;
            color: #ffffff;
            padding: 15px;
        }

        .shareEmail-body {
            text-align: center;
            height: 100vh;
            white-space: pre;
        }

        .shareEmail-from-user {
            color: #FFA733;
        }

        a {
            color: #ffc800;
            text-decoration: none;
        }

        .shareEmail-footer {
            font-size: 0.5rem;
            background: #f88561;
            color: #ffffff; 
            padding: 15px;
            position: relative;
        }
        </style>
</head>

<body>
    <div class='shareEmail-header'>
        <h4>JOBチョイス-あなたに求人紹介！</h4>
    </div>
    <div class='shareEmail-body'>
        <span>紹介してくれた方: <span class="shareEmail-from-user">{{$email['from_user']}}</span></span>
        <span class="shareEmail-from-user">{{$email['from_email']}}</span><br/>
        <p>{{$email['body']}}</p>
        <br/>
        <a href="{{url($email['url'])}}">求人を確認はこちらから！</a>
    </div>
    <div class='shareEmail-footer'>
        <span>Copyright © JOBチョイス | MEDIAFLAG沖縄 All Rights Reserved. </span>
    </div>
</body>

</html>
