<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(HatarakiKataCategoriesTableSeeder::class);
        $this->call(HatarakiKataTableSeeder::class);
        $this->call(UserTableSeeder::class);
        $this->call(JobCategoryTableSeeder::class);
        $this->call(IndustryTableSeeder::class);
        $this->call(OccupationTableSeeder::class);
        $this->call(CompanyTableSeeder::class);
        $this->call(JobTableSeeder::class);
        $this->call(JobSeekerTableSeeder::class);
        $this->call(EducationalBackgroundTableSeeder::class);
        $this->call(GeolocationTableSeeder::class);
        $this->call(ProviderTableSeeder::class);
        $this->call(SharedJobsTableSeeder::class);
        $this->call(AppliedJobSeeder::class);
        $this->call(HatarakiKataResourceTableSeeder::class);
        $this->call(SkillTableSeeder::class);
        $this->call(WorkExperienceTableSeeder::class);
        $this->call(DayTableSeeder::class);
        $this->call(JobSeekerSkillTableSeeder::class);
        $this->call(GalleriesTableSeeder::class);
        $this->call(JobStrengthTableSeeder::class);
        $this->call(JobSubCategoryTableSeeder::class);
        $this->call(JobWelfareTableSeeder::class);
        $this->call(JobReasonsToHireTableSeeder::class);
        $this->call(JobQuestionsTableSeeder::class);
        $this->call(JobJobSubCategoryTableSeeder::class);
        $this->call(DocumentTableSeeder::class);
        $this->call(ImageTableSeeder::class);
        $this->call(NotificationTableSeeder::class);
        $this->call(PublicationTableSeeder::class);
        $this->call(BillingTableSeeder::class);
        $this->call(SpecialFeatureTableSeeder::class);
        // seeder behaves like a migration, this will clean all the data after initial migration
        // this should be called once only.
        $this->call(CleanSeederScript::class);
    }

}
