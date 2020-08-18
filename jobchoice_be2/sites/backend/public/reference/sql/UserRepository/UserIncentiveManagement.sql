select 
	user.id as user_id,
	job_seeker.id as job_seeker_id,
	user.first_name,
	user.last_name,
	job_seeker.gender,
	job_seeker.birth_date,
	geo.prefectures,
	slug.id as slug_id,
	shared_count.shared_job_count,
	applied_shared.updated_at,
	applied_shared.no_disclosed
from
	users user
inner join
	job_seekers job_seeker
on
	job_seeker.user_id = user.id
inner join
	geolocation geo
on
	geo.taggable_id = job_seeker.id
inner join
	slugs slug
on
	slug.sluggable_id = user.id
left join
	(
	SELECT 
		slug_id, 
		count(*) as shared_job_count 
	FROM 
		shared_jobs
	GROUP BY 
		slug_id
	) shared_count
on
	shared_count.slug_id = slug.id
inner join
	(
	select
		max(applied.updated_at) as updated_at,
		slug.id as slug_id,
		count(applied.disclosed) as no_disclosed
	from
		shared_jobs shared
	inner join
		applied_jobs applied
	on 
		shared.id = applied.shared_job_id
	inner join
		slugs slug
	on
		slug.id = shared.slug_id
	where 
		applied.disclosed = 1
	group by
		slug.id
	)	applied_shared
on 
	applied_shared.slug_id = slug.id
where
	user.`type` = 'job_seeker'
and
	geo.taggable_type = 'JobSeeker'
and
	slug.sluggable_type = 'User'
order by updated_at desc
