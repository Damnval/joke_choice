SELECT
	SUM(table1.compensation) as total_compensation
FROM	
	shared_jobs
INNER JOIN
	(
		SELECT
			shared_jobs.id as shared_job_id,
			count(*) * incentive_per_share as compensation
		FROM 
			shared_jobs
		LEFT JOIN
			jobs
		ON
			jobs.id = shared_jobs.job_id
		LEFT JOIN
			applied_jobs
		ON 
			applied_jobs.shared_job_id = shared_jobs.id
		WHERE
			slug_id = @slug_id
		AND	
			applied_jobs.disclosed = 1
		GROUP BY
			shared_jobs.id
	) as table1
ON
	shared_jobs.id = table1.shared_job_id
