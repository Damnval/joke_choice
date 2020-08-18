<!DOCTYPE html> 
<html>
<head>
    <title>Inquiry</title>
</head>

<body>
    <h2>Inquiry # {{$inquiry['id']}}</h2>
    <hr>
    ■Inquirer : 
        @switch($inquiry['inquirer'])
            @case('job_seeker/sharer') 仕事をお探しの方、お仕事をシェアしたい方 @break
            @case('company') 掲載をお考えの方 @break
            @case('others') その他 @break
        @endswitch<br>
    ■Inquiry Type : {{$inquiry['type']}}<br>
    ■Name : {{$inquiry['name']}}<br>
    ■Email Address : {{$inquiry['email']}}<br>
    ■Contact Number : {{$inquiry['contact_no']}}<br>
    ■Details : {{$inquiry['details']}}
    <br>
</body>

</html>
