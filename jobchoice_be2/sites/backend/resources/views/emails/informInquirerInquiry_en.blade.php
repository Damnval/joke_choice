<!DOCTYPE html>
<html>
<head>
    <title>Job Choice</title>
</head>

<body>
    <h4><strong>※This email is delivered automatically from the program.</strong></h4>
    <p>Thank you for using JOB Choice.</p>
    <h4><strong>We will notify you of inquiries received from the JOB Choice Office.</strong></h4>
    <h4><strong>We have received your inquiry with the following contents.
                We will check the content you sent us and we will contact you, please wait for a while.</strong></h4>
    【Content of inquiry】
    <br>
    ■Inquirer:
    @switch($inquiry['inquirer'])
        @case('job_seeker/sharer') Job Seeker / Sharer Inquiry @break
        @case('company') Company @break
        @case('others') Others @break
    @endswitch<br>
    ■Inquiry Type : {{$inquiry['type']}}<br>
    ■Name : {{$inquiry['name']}}<br>
    ■Email Address : {{$inquiry['email']}}<br>
    ■Contact Number : {{$inquiry['contact_no']}}<br>
    ■Details : {{$inquiry['details']}}
    <br>
    __________________________________<br>
    <p>Share type job offer "JOB Choice" delivered by everyone</p>
    <p><a href="{{url(config('app.url'))}}">https://job-choice.jp</a></p>
    <p>Contact / Consultation <a href="{{url(config('app.url').'/contact')}}">https://job-choice.jp/contact</a></p>
    __________________________________
</body>

</html>
