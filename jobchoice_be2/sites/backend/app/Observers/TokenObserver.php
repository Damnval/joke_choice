<?php

namespace App\Observers;

use App\Models\Token;

class TokenObserver
{
    /**
     * Initialize Token
     * @param Object $token
     */
    public function __construct(Token $token)
    {
        $this->token = $token;
    }

    /**
     * Method is triggered when ever the creating eloquent is used in Model Token
     * @param Object $token Model binded by id
     */
    public function creating(Token $token)
    {   
        // deletes first the existing token of user before creating new token
        $token->user()->each( function ($user) {
            $user->custom_token()->delete();
        });
    }

}
