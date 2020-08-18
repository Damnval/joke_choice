#change all publication draft to 1 if job's approval_status is not approved
update
	publications
set
	draft = 1
where publishable_type = 'Job'
	and
publishable_id in
(
	select
		id
	from
		jobs
	where
		approval_status != 'approved'
)

#Delete all jobs that has been shared if `approval_status` in jobs table is `waiting` or `rejected`
delete
from
	shared_jobs
where
	job_id
in
	(
		select
			id
		from
			jobs
		where
			approval_status in ('waiting', 'rejected')
	);

#Delete all applied_jobs data if job  `approval_status` in jobs table is `waiting` or `rejected`
delete
from
	applied_jobs
where
	job_id
in
	(
		select
			id
		from
			jobs
		where
			approval_status in ('waiting', 'rejected')
	);

#update all applied jobs set diclosed to 1 if cmopany has viewed (disclosed) applicant
update
	applied_jobs
set
	disclosed = 1
where
	status != 'waiting';
