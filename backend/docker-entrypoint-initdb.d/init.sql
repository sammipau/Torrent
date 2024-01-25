-- roles
create table Roles (
    roleID serial primary key,
    name varchar unique not null,
    permissions bit(10) not null
);

-- tags
create table Tags (
    tagID serial primary key,
    name varchar unique not null,
    description varchar
);

-- categories
create table Categories (
    categoryID serial primary key,
    name varchar unique not null,
    description varchar
);

-- users
create table UsersAge (
    dob date primary key,
    age interval not null
);

create table Users (
    userID serial primary key,
    username varchar(32) unique not null,
    password varchar not null,
    registered timestamp not null,
    dob date not null,
    roleID integer not null,
    foreign key (dob) references UsersAge(dob),
    foreign key (roleID) references Roles(roleID)
);

-- adminUsers
create table AdminUsersAge (
    dob date primary key,
    age interval not null
);

create table AdminUsers (
    userID serial primary key,
    username varchar(32) unique not null,
    password varchar not null,
    registered timestamp not null,
    dob date not null,
    roleID integer not null,
    email varchar(254) not null,
    lastLogin timestamp not null,
    adminName varchar not null,
    foreign key (dob) references AdminUsersAge(dob),
    foreign key (roleID) references Roles(roleID)
);

-- torrents
create table TorrentsAge (
    uploaded timestamp primary key,
    age interval not null
);

create table Torrents (
    hash varchar(32) primary key,
    name varchar(100) not null,
    size int not null,
    uploaded timestamp not null,
    description varchar,
    categoryID integer not null,
    userID integer not null,
    foreign key (uploaded) references TorrentsAge(uploaded),
    foreign key (categoryID) references Categories(categoryID),
    foreign key (userID) references Users(userID) on delete cascade
);

-- requests
create table Requests (
    reqID serial primary key,
    posted timestamp not null,
    title varchar not null,
    body varchar not null,
    hash varchar(32),
    userID integer not null,
    foreign key (hash) references Torrents(hash),
    foreign key (userID) references Users(userID) on delete cascade
);

-- history
    create table History(
    historyID serial primary key,
    snatched timestamp not null,
    hash varchar(32) not null,
    userID integer not null,
    foreign key (hash) references Torrents(hash) on delete cascade,
    foreign key (userID) references Users(userID) on delete cascade
);

-- comments
create table Comments(
    body varchar not null,
    posted timestamp,
    hash varchar(32) ,
    userID integer,
    primary key (posted, hash, userID),
    foreign key (hash) references Torrents(hash),
    foreign key (userID) references Users(userID) on delete cascade
);

-- junction tables
create table TorrentTags (
    tagID integer not null,
    hash varchar(32) not null,
    primary key (tagID, hash),
    foreign key (tagID) references Tags(tagID),
    foreign key (hash) references Torrents(hash) on delete cascade
);

-- roles
INSERT INTO Roles (name, permissions) VALUES
    ('Admin', B'1111111111'),
    ('Super Moderator', B'1111111000'),
    ('Moderator', B'1111100000'),
    ('User', B'1100000000'),
    ('Banned', B'0000000000');

-- tags
INSERT INTO Tags (name, description) VALUES
    ('Action', 'Movies or games with lots of action'),
    ('Comedy', 'Funny and entertaining'),
    ('Drama', 'Serious and emotional'),
    ('Sci-Fi', 'Science fiction content'),
    ('EDM', 'Electronic Dance Music genre');

-- categories
INSERT INTO Categories (name, description) VALUES
    ('Movies', 'Various movie genres'),
    ('Games', 'Different types of video games'),
    ('ISOs', 'Linux ISOs'),
    ('Programs', 'Programs in ELF format'),
    ('Music', 'All kinds of music albums');

-- users
INSERT INTO UsersAge (dob, age) VALUES
    ('1990-01-15', age(timestamp '1990-01-15')),
    ('1985-06-28', age(timestamp '1985-06-28')),
    ('2000-03-10', age(timestamp '2000-03-10')),
    ('1972-11-03', age(timestamp '1972-11-03')),
    ('1998-09-21', age(timestamp '1998-09-21'));

INSERT INTO Users (username, password, registered, dob, roleID) VALUES
    ('user1', '$2a$10$zKNZtYoIO1Icv0dhWz7X.OWduVt0WOWiZVWgLRztatnK.B4RGO0ji', '2020-10-20', '1990-01-15', 1), -- pw1
    ('user2', '$2a$10$s8kgKcYe92Bh606VdSRzGeQJ7jtNl6IoOpXpN0zxk5CYMIA6qGQXK', '2021-04-20', '1985-06-28', 2), -- pw2
    ('user3', '$2a$10$EltVkw2/SwyzGV7IRV2PBeIXzLlZB7W8qUwy497Om26k10EgsRXTC', '2021-10-20', '2000-03-10', 3), -- pw3
    ('user4', '$2a$10$Hy/QS3u.j7p4IWpT1wQLMOm6YX70uyXsCi8UwuYQXD7fXlOJgr8zK', '2022-04-20', '1972-11-03', 4), -- pw4
    ('user5', '$2a$10$0XcnMnlmkcnLSeeZWq1EhOhiqrvR1IDQmDFnTZ27Pz/FNHFodsvdG', '2022-10-20', '1998-09-21', 5); -- pw5

-- adminUsers
INSERT INTO AdminUsersAge (dob, age) VALUES
    ('1990-01-15', age(timestamp '1990-01-15')),
    ('1985-06-28', age(timestamp '1985-06-28')),
    ('2000-03-10', age(timestamp '2000-03-10')),
    ('1972-11-03', age(timestamp '1972-11-03')),
    ('1998-09-21', age(timestamp '1998-09-21'));

INSERT INTO AdminUsers (username, password, registered, dob, roleID, email, lastLogin, adminName) VALUES
    ('admin1', 'adminpassword1', '2023-01-15', '1990-01-15', 1, 'admin1@gmail.com', '2023-01-15', 'AdminName1'),
    ('admin2', 'adminpassword2', '2023-02-28', '1985-06-28', 1, 'admin2@gmail.com', '2023-02-28', 'AdminName2'),
    ('admin3', 'adminpassword3', '2023-03-10', '2000-03-10', 1, 'admin3@gmail.com', '2023-03-10', 'AdminName3'),
    ('admin4', 'adminpassword4', '2023-04-25', '1972-11-03', 1, 'admin4@gmail.com', '2023-04-25', 'AdminName4'),
    ('admin5', 'adminpassword5', '2023-05-30', '1998-09-21', 1, 'admin5@gmail.com', '2023-05-30', 'AdminName5');

-- torrents
insert into TorrentsAge (uploaded, age) values
    ('1990-01-15', age(timestamp '1990-01-15')),
    ('1985-06-28', age(timestamp '1985-06-28')),
    ('2000-03-10', age(timestamp '2000-03-10')),
    ('1972-11-03', age(timestamp '1972-11-03')),
    ('1998-09-21', age(timestamp '1998-09-21'));
insert into Torrents (hash, name, size, uploaded, description, categoryID, userID) values
    ('hash1', 'Action Movie', 1, '1990-01-15', 'description1', 1, 1),
    ('hash2', 'Comedy Game', 2, '1985-06-28', 'description2', 2, 2),
    ('hash3', 'Drama ISO', 3, '2000-03-10', 'description3', 3, 3),
    ('hash4', 'Sci-Fi Program', 4, '1972-11-03', 'description4', 4, 4),
    ('hash5', 'EDM Music', 5, '1998-09-21', 'description5', 5, 5);

-- requests
insert into Requests (posted, title, body, hash, userID) values
    ('1990-01-15', 'title1', 'body1', 'hash1', 1),
    ('1985-06-28', 'title2', 'body2', 'hash2', 2),
    ('2000-03-10', 'title3', 'body3', 'hash3', 3),
    ('1972-11-03', 'title4', 'body4', 'hash4', 4),
    ('1998-09-21', 'title5', 'body5', 'hash5', 5);

-- history
insert into History (snatched, hash, userID) values
    ('1990-01-15', 'hash1', 1),
    ('1985-06-28', 'hash2', 2),
    ('2000-03-10', 'hash3', 3),
    ('1972-11-03', 'hash4', 4),
    ('1998-09-21', 'hash1', 5),
    ('1998-09-21', 'hash2', 5),
    ('1998-09-21', 'hash3', 5),
    ('1998-09-21', 'hash4', 5),
    ('1998-09-21', 'hash5', 5);

-- comments
insert into Comments (body, posted, hash, userID) values
    ('Great action movie!', '1990-01-15', 'hash1', 1),
    ('Not funny comedy game', '1985-06-28', 'hash2', 2),
    ('Very dramatic ISO!', '2000-03-10', 'hash3', 3),
    ('Anyone like this program?', '1972-11-03', 'hash4', 4),
    ('My favorite EDM album for sure :)', '1998-09-21', 'hash5', 4),
    ('Also dont forget to check out Tchamis stuff', '1998-09-22', 'hash5', 4);

-- junction tables
insert into TorrentTags (tagID, hash) values
    (1, 'hash1'),
    (2, 'hash2'),
    (3, 'hash3'),
    (4, 'hash4'),
    (5, 'hash5');
