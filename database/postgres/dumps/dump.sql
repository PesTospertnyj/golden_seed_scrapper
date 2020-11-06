create table dosages
(
	id serial not null,
	purpose_of_use varchar(64),
	severity varchar(64),
	step varchar(64),
	weight int,
	dosage int
);

create unique index dosages_id_uindex
	on dosages (id);

alter table dosages
	add constraint dosages_pk
		primary key (id);

