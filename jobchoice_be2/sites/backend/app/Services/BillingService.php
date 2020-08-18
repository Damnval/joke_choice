<?php

namespace App\Services;

use App\Repositories\JobChoiceRepository;

use App\Models\Billing;
use Carbon\Carbon;
use Auth;
use DB;

class BillingService
{
    /**
     * initialize all repositories access it via JobChoiceRepository
     * @param JobChoiceRepository $jobChoiceRepository container of all repositories
     */

    public function __construct(JobChoiceRepository $jobChoiceRepository)
    {
        $this->jobChoiceRepository = $jobChoiceRepository;
    }

    /**
     * Logics and functions in retrieving a specific company's job billings
     * @param  Object $request   Input by user
     * @return Object $billings  billings collection 
     */
    public function companyBillings($request)
    {
        if (Auth::user()->type != 'company') {
            throw new \Exception('Unauthorized viewing of billing accounts.');
        }

        $data = [
            'company_id' => Auth::user()->company->id,
        ];        

        $with = ['billable' => function($sub_query) {                        
            $sub_query->select('id', 'title', 'reference_id', 'price', 'incentive_per_share');
            
        }];
        
        $billings = $this->jobChoiceRepository->billing()->whereWhereMonthAndYear(
                                                                                    $data, 
                                                                                    'created_at', 
                                                                                    $request->month,
                                                                                    $request->year,
                                                                                    $with 
                                                                                );
                                
        // Fixed tax percentage
        $tax_percentage = Billing::VARIABLES['tax_percentage'];
        // Sub total amount of bills
        $sub_total_amount = $billings->sum('billable.incentive_per_share');
        // Result to be returned
        $result['billings'] = $billings;                                                                               
        $result['sub_total_amount'] = $sub_total_amount;
        $result['consumption_tax_fee'] = $sub_total_amount * $tax_percentage;
        $result['total_amount_fee'] = $sub_total_amount + ($sub_total_amount * $tax_percentage);
        
        return $result;
    }

}
