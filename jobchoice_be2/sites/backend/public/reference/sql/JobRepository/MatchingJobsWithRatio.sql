SET @job_seeker_id = 1;

SELECT
	jobs.id,
	jobs.title,
	SUM(points) as total_points,
	CASE 
		WHEN SUM(points) >= 100 THEN 99.9
		WHEN SUM(points) >= 90 THEN (SUM(points) * 1)
		WHEN SUM(points) >= 80 THEN (SUM(points) * 1.1)
		WHEN SUM(points) >= 70 THEN (SUM(points) * 1.25)
		WHEN SUM(points) >= 60 THEN (SUM(points) * 1.4)
		ELSE SUM(points) * 1.1
	END AS matching_ratio
FROM
	jobs
LEFT JOIN
	(
		(
			SELECT 
				hk_job.taggable_id as job_id,
				(count(*) * 11) as points			
			FROM 
				jobs
			LEFT JOIN
				hataraki_kata_resource as hk_job
			ON
				hk_job.taggable_id = jobs.id
			LEFT JOIN
				hataraki_kata_resource as hk_job_seeker
			ON
				hk_job_seeker.hataraki_kata_id = hk_job.hataraki_kata_id
			WHERE
				hk_job.taggable_type = 'Job'
			AND
				hk_job_seeker.taggable_type = 'JobSeeker'
			AND
				hk_job_seeker.taggable_id = @job_seeker_id
			AND
				hk_job_seeker.deleted_at IS NULL
			AND
				hk_job.deleted_at IS NULL
			GROUP BY 
				hk_job.taggable_id
		) 
	UNION
		(
			SELECT 
				jobs.id as job_id,
				(count(*) * 7) as points
			FROM	
				jobs
			LEFT JOIN
				hataraki_kata_resource
			ON
				hataraki_kata_resource.taggable_id = jobs.id
			LEFT JOIN
				hataraki_kata
			ON
				hataraki_kata.id = hataraki_kata_resource.hataraki_kata_id
			LEFT JOIN
				hataraki_kata_categories job_hataraki_kata_categories
			ON
				job_hataraki_kata_categories.id = hataraki_kata.hataraki_kata_category_id
			INNER JOIN
				(
					SELECT
						DISTINCT hataraki_kata_categories.id as hataraki_kata_category_id
					FROM
						job_seekers
					LEFT JOIN
						hataraki_kata_resource
					ON
						hataraki_kata_resource.taggable_id = job_seekers.id
					LEFT JOIN 
						hataraki_kata
					ON
						hataraki_kata.id = hataraki_kata_resource.hataraki_kata_id
					LEFT JOIN
						hataraki_kata_categories
					ON
						hataraki_kata_categories.id = hataraki_kata.hataraki_kata_category_id
					WHERE 
						job_seekers.id = @job_seeker_id
					AND
						hataraki_kata_resource.taggable_type = 'JobSeeker'
					AND
						hataraki_kata_resource.deleted_at IS NULL
					GROUP BY
						hataraki_kata_categories.id
				) as job_seeker_hataraki_kata_categories
			ON
				job_seeker_hataraki_kata_categories.hataraki_kata_category_id  = job_hataraki_kata_categories.id
			WHERE
				hataraki_kata_resource.taggable_type = 'Job'
			AND
				hataraki_kata_resource.deleted_at IS NULL
			GROUP BY
				jobs.id
		)
	UNION
		(
			SELECT 
				other_hk_job.job_id as job_id,
				(count(*) * 4) as points			
			FROM 
				jobs
			LEFT JOIN
				other_hataraki_kata as other_hk_job
			ON
				other_hk_job.job_id = jobs.id
			LEFT JOIN
				hataraki_kata_resource as hk_job_seeker
			ON
				hk_job_seeker.hataraki_kata_id = other_hk_job.hataraki_kata_id
			WHERE
				hk_job_seeker.taggable_type = 'JobSeeker'
			AND
				hk_job_seeker.taggable_id = @job_seeker_id
			AND
				hk_job_seeker.deleted_at IS NULL
			AND
				other_hk_job.deleted_at IS NULL
			GROUP BY 
				other_hk_job.job_id
		)
	UNION
		(
			SELECT 
				jobs.id as job_id,
				(count(*) * 3) as points
			FROM	
				jobs
			LEFT JOIN
				other_hataraki_kata
			ON
				other_hataraki_kata.job_id = jobs.id
			LEFT JOIN
				hataraki_kata
			ON
				hataraki_kata.id = other_hataraki_kata.hataraki_kata_id
			LEFT JOIN
				hataraki_kata_categories job_hataraki_kata_categories
			ON
				job_hataraki_kata_categories.id = hataraki_kata.hataraki_kata_category_id
			INNER JOIN
				(
					SELECT
						DISTINCT hataraki_kata_categories.id as hataraki_kata_category_id
					FROM
						job_seekers
					LEFT JOIN
						hataraki_kata_resource
					ON
						hataraki_kata_resource.taggable_id = @job_seeker_id
					LEFT JOIN 
						hataraki_kata
					ON
						hataraki_kata.id = hataraki_kata_resource.hataraki_kata_id
					LEFT JOIN
						hataraki_kata_categories
					ON
						hataraki_kata_categories.id = hataraki_kata.hataraki_kata_category_id
					WHERE 
						job_seekers.id = @job_seeker_id
					AND
						hataraki_kata_resource.taggable_type = 'JobSeeker'
					AND
						hataraki_kata_resource.deleted_at IS NULL
					GROUP BY
						hataraki_kata_categories.id
				) as job_seeker_hataraki_kata_categories
			ON
				job_seeker_hataraki_kata_categories.hataraki_kata_category_id  = job_hataraki_kata_categories.id
			WHERE
				other_hataraki_kata.deleted_at IS NULL
			GROUP BY
				jobs.id
		)
	) as hataraki_kata_union
ON
	hataraki_kata_union.job_id = jobs.id
WHERE
	jobs.approval_status = 'approved'
AND	
	jobs.deleted_at IS NULL
GROUP BY
	jobs.id
ORDER BY
	matching_ratio DESC
