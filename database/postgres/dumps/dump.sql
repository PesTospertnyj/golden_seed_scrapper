create table if not exists dosages
(
	id serial not null
		constraint dosages_pk
			primary key,
	purpose_of_use varchar(64),
	severity varchar(64),
	weight integer,
	step_one_dosage varchar(10),
	step_two_dosage varchar(10),
	step_three_dosage varchar(10)
);

alter table dosages owner to postgres;

create unique index if not exists dosages_id_uindex
	on dosages (id);

