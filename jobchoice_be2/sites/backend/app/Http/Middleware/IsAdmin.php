<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class IsAdmin
{
    public function __construct()
    {
        $this->data['status'] = 401;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::user() && Auth::user()->type == 'admin') {
            return $next($request);
        }

        $this->data['results'] = 'You don\'t have the permissions to perform this action.';
        
        return response()->json($this->data, $this->data['status']);
    }
}
