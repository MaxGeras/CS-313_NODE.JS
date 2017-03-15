psql -U postgres

CREATE DATABASE quiz_db;

CREATE USER group1 WITH PASSWORD 'group';
GRANT INSERT, SELECT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO group1;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO group1;

CREATE TABLE quiz
(
  id SERIAL PRIMARY KEY NOT NULL,
  question VARCHAR(300) NOT NULL,
  option1 VARCHAR(100) NOT NULL,
  option2 VARCHAR(100) NOT NULL,
  option3 VARCHAR(100) NOT NULL,
  option4 VARCHAR(100) NOT NULL,
  answer VARCHAR(100) NOT NULL
);


CREATE TABLE group
(
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INT NOT NULL REFERENCES quiz(id),
  user VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  points SMALLINT NOT NULL,
  tries SMALLINT NOT NULL,
  options VARCHAR(200) NOT NULL    
);


	INSERT INTO quiz(question , option1, option2, option3, option4, answer) 
	VALUES 
	('What is the world''s biggest island ?', 'a) Greenland', 'b) New Guinea', 'c) Borneo', 'd) Madagascar', 'option1') ,
	('What is the world''s longest river ?', 'a) Nile','b) Amazon','c) Perl','d) Columbia','option2'),
	('What is the name of the world''s largest ocean ?','a) Pacific','b) Atlantic','c) Indian','d) Artic ', 'option1') ,
	('What is the diameter of Earth ?','a) 6000 miles','b) 8000 miles','c) 9000 miles','d) 7000 miles', 'option2') ,
	('What continent has the fewest flowering plants ? ','a) Africa','b) Antarctica','c) Asia','d) Europe', 'option2') ,
	('How many U.S. states border the Gulf of Mexico ?','a) 3','b) 4','c) 5','d) 6', 'option3') ,
	('What color is Absynth? ','a) Red','b) Black','c) Green','b) Brown', 'option3') ,
	('What is capital the city of Spain ?','a) Malaga','b) Valencia','c) Barcelona','d) Madrid', 'option4') ,
	('In which country is the Simpson Desert found ?','a) India ','b) Australia ','c) America','d) China', 'option2') ,
	('What is the only rock regularly eaten by humans ?','a) Marble','b) Coal','c) Salt','d) Basalt','option3');