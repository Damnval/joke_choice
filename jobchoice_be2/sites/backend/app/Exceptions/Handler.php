<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'c_password',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($request->expectsJson()) {
            $code = 500;
            $response = [
                'error' => $exception->getMessage(),
            ];

            // handle http exception status code
            if ($exception instanceof HttpException) {
                $code = $exception->getStatusCode();
                if ($code = 405) {
                    $response['error'] = 'Method not found.';
                }
            }

            // handle not found exception
            // and return custom error message
            if ($exception instanceof NotFoundHttpException) {
                $response['error'] = '404 Not Found.';
            }

            // handle unauthentication exception
            if ($exception instanceof AuthenticationException) {
                $code = 401;
                $response['error'] = 'Unauthenticated.';
            }

            // json response
            return response()->json($response, $code);
        }

        return parent::render($request, $exception);
    }
}
