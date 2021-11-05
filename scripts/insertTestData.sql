
/*
 * This script inserts Civocracy test data in its database.
 *
 * This test data is:
 *    - user        #42 called 'Test'  ;
 *    - issue       #42 called '#Test' ;
 *    - proposition #42 called from user  42 + the creator's upvote ;
 *    - proposition #43 called from user 296 + the creator's upvote ;
 *    - community   #42 called 'Test'.
 *    - update      #42 called 'Test'.
 */

-- Delete user 42's followings

DELETE FROM issue_following WHERE user = 42 ;

-- Delete user 42's ratings

DELETE FROM link_rating WHERE user = 42 ;
DELETE FROM action_rating WHERE user = 42 ;
DELETE FROM comment_rating WHERE user = 42 ;
DELETE FROM issue_stakeholding_rating WHERE user = 42 ;

-- Delete user 42's trackings

DELETE FROM link_tracking WHERE user = 42 ;
DELETE FROM action_tracking WHERE user = 42 ;
DELETE FROM issue_stakeholding_tracking WHERE user = 42 ;

-- Delete ratings on user 42's posts

DELETE FROM link_rating WHERE content IN (
	SELECT id
	FROM link
	WHERE user = 42
);
DELETE FROM action_rating WHERE content IN (
	SELECT id
	FROM action
	WHERE user = 42
);
DELETE FROM comment_rating WHERE content IN (
	SELECT id
	FROM comment
	WHERE user = 42
);
DELETE FROM issue_stakeholding_rating WHERE content IN (
	SELECT id
	FROM issue_stakeholding
	WHERE user = 42
);

-- Delete trackings from user 42's posts

DELETE FROM link_tracking WHERE content IN (
	SELECT id
	FROM link
	WHERE user = 42
);
DELETE FROM action_tracking WHERE content IN (
	SELECT id
	FROM action
	WHERE user = 42
);
DELETE FROM issue_stakeholding_tracking WHERE content IN (
	SELECT id
	FROM issue_stakeholding
	WHERE user = 42
);

-- Delete content from user 42's issues

-- Followings
DELETE FROM issue_following WHERE issue IN (
	SELECT id
	FROM issue
	WHERE user = 42
);

-- Ratings
DELETE FROM link_rating WHERE content IN (
	SELECT link.id
	FROM link
	JOIN issue
	ON link.issue = issue.id
	WHERE issue.user = 42
);
DELETE FROM action_rating WHERE content IN (
	SELECT action.id
	FROM action
	JOIN issue
	ON action.issue = issue.id
	WHERE issue.user = 42
);
DELETE FROM comment_rating WHERE content IN (
	SELECT comment.id
	FROM comment
	JOIN issue
	ON comment.issue = issue.id
	WHERE issue.user = 42
);
DELETE FROM issue_stakeholding_rating WHERE content IN (
	SELECT issue_stakeholding.id
	FROM issue_stakeholding
	JOIN issue
	ON issue_stakeholding.issue = issue.id
	WHERE issue.user = 42
);

-- Trackings
DELETE FROM link_tracking WHERE content IN (
	SELECT link.id
	FROM link
	JOIN issue
	ON link.issue = issue.id
	WHERE issue.user = 42
);
DELETE FROM action_tracking WHERE content IN (
	SELECT action.id
	FROM action
	JOIN issue
	ON action.issue = issue.id
	WHERE issue.user = 42
);
DELETE FROM comment_tracking WHERE content IN (
	SELECT comment.id
	FROM comment
	JOIN issue
	ON comment.issue = issue.id
	WHERE issue.user = 42
);
DELETE FROM issue_stakeholding_tracking WHERE content IN (
	SELECT issue_stakeholding.id
	FROM issue_stakeholding
	JOIN issue
	ON issue_stakeholding.issue = issue.id
	WHERE issue.user = 42
);

-- Posts
DELETE FROM link WHERE issue IN (
	SELECT id
	FROM issue
	WHERE user = 42
);
DELETE FROM action WHERE issue IN (
	SELECT id
	FROM issue
	WHERE user = 42
);
DELETE FROM comment WHERE issue IN (
	SELECT id
	FROM issue
	WHERE user = 42
);
DELETE FROM issue_stakeholding WHERE issue IN (
	SELECT id
	FROM issue
	WHERE user = 42
);

-- Delete user 42's posts

DELETE FROM link WHERE user = 42 ;
DELETE FROM action WHERE user = 42 ;
DELETE FROM comment WHERE user = 42 ;
DELETE FROM issue_stakeholding WHERE user = 42 ;
DELETE FROM issue WHERE user = 42 ;
DELETE FROM proposition WHERE user = 42 ;

-- Delete user 42's stakeholdings

DELETE FROM community_stakeholding WHERE user = 42 ;
DELETE FROM issue_stakeholding WHERE user = 42 ;

-- Delete user 42's followings

DELETE FROM community_following WHERE user = 42 ;
DELETE FROM issue_following WHERE user = 42 ;

-- Delete user 42's ratings

DELETE FROM proposition_rating WHERE user = 42 ;

-- Delete user 42's tokens

DELETE FROM access_token WHERE user = 42 ;
DELETE FROM refresh_token WHERE user_id = 42 ;

-- Delete user 42

DELETE FROM fos_user WHERE id = 42 ;

-- Create test user (password = test)

INSERT INTO `fos_user` (
	`id`,
	`username`,
	`username_canonical`,
	`email`,
	`email_canonical`,
	`enabled`,
	`salt`,
	`password`,
	`last_login`,
	`confirmation_token`,
	`password_requested_at`,
	`roles`,
	`facebook_id`,
	`twitter_id`,
	`google_id`,
	`linkedin_id`,
	`description`,
	`image`,
	`first_name`,
	`last_name`,
	`date_register`,
	`cover`,
	`locale`,
	`summary`,
	`notif_response`,
	`twitter_account`
)
VALUES (
	42,
	'SuperduperTestUser',
	'superdupertestuser',
	'superdupertestuser@civocracy.org',
	'superdupertestuser@civocracy.org',
	1,
	'd3v428uo4hkw4kggkksk0cskgwsos48',
	'dKrnci7gGCvogNOYB6X6UObzU2NavoEDqKAlADiplgYhT8i6Xd/sukbggATYouBb9dtLIBrRRzoApgi2t7howg==',
	NULL,
	NULL,
	NULL,
	'a:0:{}',
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	'Superduper',
	'Testuser',
	'2016-01-28 10:39:13',
	NULL,
	'en_XX',
	NULL,
	1,
	NULL
) ;
INSERT INTO `fos_user` (
	`username`,
	`username_canonical`,
	`email`,
	`email_canonical`,
	`enabled`,
	`salt`,
	`password`,
	`last_login`,
	`confirmation_token`,
	`password_requested_at`,
	`roles`,
	`facebook_id`,
	`twitter_id`,
	`google_id`,
	`linkedin_id`,
	`description`,
	`image`,
	`first_name`,
	`last_name`,
	`date_register`,
	`cover`,
	`locale`,
	`summary`,
	`notif_response`,
	`twitter_account`
) ;
(
	'Test',
	'test',
	'test@civocracy.org',
	'test@civocracy.org',
	1,
	'd3v428uo4hkw4kggkksk0cskgwsos48',
	'dKrnci7gGCvogNOYB6X6UObzU2NavoEDqKAlADiplgYhT8i6Xd/sukbggATYouBb9dtLIBrRRzoApgi2t7howg==',
	NULL,
	NULL,
	NULL,
	'a:0:{}',
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	NULL,
	'Test',
	'Test',
	'2016-01-28 10:39:13',
	NULL,
	'en_XX',
	NULL,
	1,
	NULL
);

-- Delete community 42

-- FIXME for further improvement:
--       http://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query
SET foreign_key_checks = 0; -- don't try this at home ! (localities are recursive.)
DELETE FROM community WHERE id = 42 ;
SET foreign_key_checks = 1;

-- Create test community

INSERT INTO `community` (
	`id`,
	`root`,
	`user`,
	`name`,
	`level`,
	`description`,
	`image`,
	`color`,
	`country`,
	`url`,
	`type`,
	`is_active`,
	`status`
) VALUES (
	42,
	1,
	NULL,
	'Test',
	10,
	'This community is for testing purpose: please don''t delete it! :)',
	'http://m.memegen.com/xy4vrm.jpg',
	'55FF99',
	'DE',
	'test',
	'government',
	1,
	'active'
);

-- Delete issue 42's content

-- Followings
DELETE FROM issue_following WHERE issue = 42 ;

-- Ratings
DELETE FROM link_rating WHERE content IN (
	SELECT link.id
	FROM link
	WHERE issue = 42
);
DELETE FROM action_rating WHERE content IN (
	SELECT action.id
	FROM action
	WHERE issue = 42
);
DELETE FROM comment_rating WHERE content IN (
	SELECT comment.id
	FROM comment
	WHERE issue = 42
);
DELETE FROM issue_stakeholding_rating WHERE content IN (
	SELECT issue_stakeholding.id
	FROM issue_stakeholding
	WHERE issue = 42
);

-- Trackings
DELETE FROM link_tracking WHERE content IN (
	SELECT link.id
	FROM link
	WHERE issue = 42
);
DELETE FROM action_tracking WHERE content IN (
	SELECT action.id
	FROM action
	WHERE issue = 42
);
DELETE FROM issue_stakeholding_tracking WHERE content IN (
	SELECT issue_stakeholding.id
	FROM issue_stakeholding
	WHERE issue = 42
);

-- Posts
DELETE FROM link WHERE issue = 42 ;
DELETE FROM action WHERE issue = 42 ;
-- FIXME for further improvement:
--       http://stackoverflow.com/questions/20215744/how-to-create-a-mysql-hierarchical-recursive-query
SET foreign_key_checks = 0; -- don't try this at home ! (comments are recursive.)
DELETE FROM comment WHERE issue = 42 ;
SET foreign_key_checks = 1;
DELETE FROM issue_stakeholding WHERE issue = 42 ;

-- Delete issue 42

DELETE FROM issue WHERE id = 42 ;

-- Create test issue

INSERT INTO `civ`.`issue` (
	`id`,
	`user`,
	`title`,
	`summary`,
	`description`,
	`date_begin`,
	`date_end`,
	`status`,
	`image`,
	`locale`,
	`tag`,
	`initiator_name`,
	`initiator_summary`,
	`community`,
	`date`
) VALUES (
	42,
	'42',
	'Don''t delete me',
	'This issue is for automated testing purpose. Please don''t delete! :-)',
	'This issue is for automated testing purpose. Please don''t delete! :-)',
	'2016-01-29 00:00:00',
	'2020-01-30 00:00:00',
	'active',
	'http://m.memegen.com/xy4vrm.jpg',
	'en',
	'Test',
	'Test Test',
	NULL,
	42,
	'2015-25-12 00:00:00'
);

-- Delete proposition 42 & 43's ratings

DELETE FROM `proposition_rating`
WHERE content = 42
OR    content = 43 ;

-- Delete proposition 42 & 43

DELETE FROM `proposition`
WHERE id = 42
OR    id = 43 ;

-- Create test propositions

INSERT INTO `proposition` (`id`, `user`, `community`, `title`, `content`, `status`, `date`, `locale`) VALUES
(42, 42, 42, 'I want', 'automated testing on the add new proposition feature!', 'active', '2016-03-14 00:00:00', 'en'),
(43, 296, 42, 'I want', 'automated testing on the upvote proposition feature!', 'active', '2016-03-14 00:00:00', 'en');

-- Add creator upvotes

DELETE FROM `proposition_rating`
WHERE id = 42
OR    id = 43 ;

INSERT INTO `proposition_rating` (`id`, `user`, `content`, `relevancy`, `date`) VALUES
(42,  42, 42, 1, '2016-03-14 15:08:03'),
(43, 296, 43, 1, '2016-03-14 15:08:04') ;

-- Delete update 42

DELETE FROM `civ_update`
WHERE id = 42 ;

-- Create test community-update

INSERT INTO `civ_update` (`id`, `issue`, `community`, `title`, `content`, `date`, `status`, `locale`) VALUES
(42, NULL, 42, 'Test', 'I am a community update created for automated testing. Please don''t delete me!', '2016-03-14 00:00:00', 'active', 'en');
