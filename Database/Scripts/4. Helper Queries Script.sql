-- get all modules (includes both draft & published status)
SELECT DISTINCT
       m.*
FROM   Modules m


-- get all published modules
SELECT DISTINCT
       m.*
FROM   Modules m
       INNER JOIN ModuleStatusTypes mst ON m.ModuleStatusTypeId = mst.ModuleStatusTypeId
WHERE  mst.[Name] = 'Published';


-- get modules that have an associated keyword & associated category
SELECT m.ModuleId, k.[Name] AS KeywordName, c.[Name] AS KeywordCategory
FROM   Modules2Keywords m2k
       INNER JOIN Keywords k ON m2k.KeywordId = k.KeywordId
       INNER JOIN Categories c ON k.CategoryId = c.CategoryId
       INNER JOIN Modules m ON m2k.ModuleId = m.ModuleId
	   
	   
-- get number of keywords per module
SELECT   ModuleId, COUNT(Module2KeywordId) AS Keywords
FROM     dbo.Modules2Keywords
GROUP BY ModuleId