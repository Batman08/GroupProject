-- Select Database 'Group Project'

USE [GroupProject]
GO


-- ModuleStatusTypes

INSERT [dbo].[ModuleStatusTypes] ([Name]) VALUES (N'Draft')
INSERT [dbo].[ModuleStatusTypes] ([Name]) VALUES (N'Published')



-- Categories

INSERT INTO dbo.Categories([Name]) 
VALUES (N'Module Position'),
	   (N'Client'), 
	   (N'Suspect'), 
	   (N'Crime')



-- Keywords

-- Keywords Category: Module Position
DECLARE @modulePositionCategoryId INT = (SELECT TOP(1) CategoryId FROM dbo.Categories WHERE [Name] = 'Module Position' ORDER BY CategoryId);
INSERT INTO dbo.Keywords
(
    Name,
    CategoryId
)
VALUES (N'Beginning', @modulePositionCategoryId),
	   (N'Middle', @modulePositionCategoryId),
	   (N'End', @modulePositionCategoryId)


-- Keywords Category: Client
DECLARE @clientCategoryId INT = (SELECT TOP(1) CategoryId FROM dbo.Categories WHERE [Name] = 'Client' ORDER BY CategoryId);
INSERT INTO dbo.Keywords
(
    Name,
    CategoryId
)
VALUES (N'Bank Employee', @clientCategoryId),
	   (N'Retail Worker', @clientCategoryId),
	   (N'Mob Boss', @clientCategoryId)


-- Keywords Category: Suspect
DECLARE @suspectCategoryId INT = (SELECT TOP(1) CategoryId FROM dbo.Categories WHERE [Name] = 'Suspect' ORDER BY CategoryId);
INSERT INTO dbo.Keywords
(
    Name,
    CategoryId
)
VALUES (N'Husband', @suspectCategoryId),
	   (N'Wife', @suspectCategoryId),
	   (N'Unknown Individual', @suspectCategoryId),
	   (N'Friend', @suspectCategoryId)


-- Keywords Category: Crime
DECLARE @crimeCategoryId INT = (SELECT TOP(1) CategoryId FROM dbo.Categories WHERE [Name] = 'Crime' ORDER BY CategoryId);
INSERT INTO dbo.Keywords
(
    Name,
    CategoryId
)
VALUES (N'Assault', @crimeCategoryId),
	   (N'Murder', @crimeCategoryId),
	   (N'Infidelity', @crimeCategoryId),
	   (N'Fraud', @crimeCategoryId)